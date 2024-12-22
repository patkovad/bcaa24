const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const taskFolderPath = path.join(__dirname, "storage", "taskList");

// Method to read an task from a file
function get(taskId) {
    try {
        const filePath = path.join(taskFolderPath, `${taskId}.json`);
        if (!fs.existsSync(filePath)) {
            return null; // if the file does not exist, we return null
            }
        const fileData = fs.readFileSync(filePath, "utf8");
        return JSON.parse(fileData);
    } catch (error) {
        if (error.code === "ENOENT") return null;
        throw { code: "failedToReadTask", task: error.task };
    }
}

// list of all tasks
function list() {
  try {
    const files = fs.readdirSync(taskFolderPath);
    let taskList = files.map((file) => {
      const fileData = fs.readFileSync(
        path.join(taskFolderPath, file),
        "utf8"
      );
      return JSON.parse(fileData);
    });

    return taskList;
  } catch (error) {
    throw { code: "failedToListTasks", message: error.message };
  }
}

// list of tasks filtered by statusId
function listByStatusId(taskList, statusId) {
  return taskList.filter((item) => item.statusId === statusId);
}

// list of tasks sorted by date
function listSortedByDate(taskList, sortOrder) {
  return taskList.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });
}

// Method to write an task to a file
function create(task) {
  try {
      task.id = crypto.randomBytes(16).toString("hex"); // generate an unique ID
      const filePath = path.join(taskFolderPath, `${task.id}.json`); //create and save task o a file
      const fileData = JSON.stringify(task);
      fs.writeFileSync(filePath, fileData, "utf8");
      return task;
  } catch (error) {
      throw { code: "failedToCreateTask", task: error.task };
  }
}

// Method to update task in a file
function update(updatedTask) {
  try {
      const currentTask = get(updatedTask.id);
      if (!currentTask) {
          throw { code: "taskNotFound", message: "Task not found" };
      };

      const newTask = { ...currentTask, ...updatedTask };
      const filePath = path.join(taskFolderPath, `${updatedTask.id}.json`);
      const fileData = JSON.stringify(newTask);
      fs.writeFileSync(filePath, fileData, "utf8");
      return newTask;
  } catch (error) {
      throw { code: "failedToUpdateTask", message: error.message };
  }
}

// Method to update task status
function updateStatus(taskId, statusId) {
  try {
      // get task by ID
      const task = get(taskId);
      if (!task) {
          throw { code: "taskNotFound", message: "Task not found" };
      }

      // task status update
      task.statusId = statusId;

      // saving the changed task back to the file
      const filePath = path.join(taskFolderPath, `${taskId}.json`);
      const fileData = JSON.stringify(task, null, 2);
      fs.writeFileSync(filePath, fileData, "utf8");

      return task;  // we will return the updated task
  } catch (error) {
      throw { code: "failedToUpdateStatus", message: "Error updating task status", error: error };
  }
}

// Method to remove an task from a file
function remove(taskId) {
  try {
  const filePath = path.join(taskFolderPath, `${taskId}.json`);
  if (!fs.existsSync(filePath)) {
      throw { code: "taskNotFound", message: `Task ID '${taskId}' doesn't exist.` };
      }
  fs.unlinkSync(filePath);
  return {message: `Task ID '${taskId}' was successfully deleted.`};
  } catch (error) {
  if (error.code === "ENOENT") {
      return {message: "Task not found" };
  }
  throw { code: "failedToRemoveTask", task: error.task };
  }
}

module.exports = {
  get,
  list,
  listByStatusId,
  listSortedByDate,
  create,
  update,
  updateStatus,
  remove,
};