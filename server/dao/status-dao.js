const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const statusFolderPath = path.join(__dirname, "storage", "statusList");

// Method to read an status from a file
function get(statusId) {
  try {
    const filePath = path.join(statusFolderPath, `${statusId}.json`);
    const fileData = fs.readFileSync(filePath, "utf8");
    return JSON.parse(fileData);
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw { code: "failedToReadStatus", status: error.status };
  }
}

// getstatusMap
function getStatusMap() {
  const statusMap = {};
  const statusList = list();
  statusList.forEach((status) => {
    statusMap[status.id] = status;
  });
  return statusMap;
}

// Method to list statuses in a folder
function list() {
  try {
    const files = fs.readdirSync(statusFolderPath);
    const statusList = files.map((file) => {
      const fileData = fs.readFileSync(
        path.join(statusFolderPath, file),
        "utf8"
      );
      return JSON.parse(fileData);
    });
    return statusList;
  } catch (error) {
    throw { code: "failedToListStatuses", status: error.status };
  }
}

// Method to write an status to a file
function create(status) {
  try {
    const statusList = list();
    if (statusList.some((item) => item.name === status.name)) {
      throw {
        code: "uniqueNameAlreadyExists",
        message: "exists status with given name",
      };
    }
    status.id = crypto.randomBytes(16).toString("hex");
    const filePath = path.join(statusFolderPath, `${status.id}.json`);
    const fileData = JSON.stringify(status);
    fs.writeFileSync(filePath, fileData, "utf8");
    return status;
  } catch (error) {
    throw { code: "failedToCreateStatus", status: error.status };
  }
}

// Method to update status in a file
function update(status) {
  try {
    const currentStatus = get(status.id);
    if (!currentStatus) return null;

    if (status.name && status.name !== currentStatus.name) {
      const statusList = list();
      if (statusList.some((item) => item.name === status.name)) {
        throw {
          code: "uniqueNameAlreadyExists",
          message: "exists status with given name",
        };
      }
    }

    const newStatus = { ...currentStatus, ...status };
    const filePath = path.join(statusFolderPath, `${status.id}.json`);
    const fileData = JSON.stringify(newStatus);
    fs.writeFileSync(filePath, fileData, "utf8");
    return newStatus;
  } catch (error) {
    throw { code: "failedToUpdateStatus", status: error.status };
  }
}

// Method to remove an status from a file
function remove(statusId) {
  try {
    const filePath = path.join(statusFolderPath, `${statusId}.json`);
    fs.unlinkSync(filePath);
    return {};
  } catch (error) {
    if (error.code === "ENOENT") {
      return {};
    }
    throw { code: "failedToRemoveStatus", status: error.status };
  }
}

module.exports = {
  get,
  getStatusMap,
  list,
  create,
  update,
  remove,
};