const Ajv = require("ajv");
const addFormats = require("ajv-formats").default;
const ajv = new Ajv();
addFormats(ajv);

const taskDao = require("../../dao/task-dao.js");
const statusDao = require("../../dao/status-dao.js");

const schema = {
  type: "object",
  properties: {
    statusId: { type: "string" },
    sortOrder: { type: "string", enum: ["asc", "desc"] },
  },
  required: [],
  additionalProperties: false,
};

async function ListAbl(req, res) {
  try {
    const filter = req.query?.statusId ? req.query : req.body;

    // validate input
    const valid = ajv.validate(schema, filter);
    if (!valid) {
      res.status(400).json({
        code: "dtoInIsNotValid",
        message: "dtoIn is not valid",
        validationError: ajv.errors,
      });
      return;
    }

    // get all transactions
    let taskList = taskDao.list();

    // filter by statusId
    if (filter.statusId) {
        taskList = taskDao.listByStatusId(taskList, filter.statusId);
    }

    // sort by date
    if (filter.sortOrder) {
      taskList = taskDao.listSortedByDate(taskList, filter.sortOrder);  // sort by date
    }

    // get status map
    const statusMap = statusDao.getStatusMap();

    // return properly filled dtoOut
    res.json({ itemList: taskList, statusMap });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = ListAbl;