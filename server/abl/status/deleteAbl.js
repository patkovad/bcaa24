const Ajv = require("ajv");
const ajv = new Ajv();

const statusDao = require("../../dao/status-dao.js");
const taskDao = require("../../dao/task-dao.js");

const schema = {
  type: "object",
  properties: {
    id: { type: "string" },
  },
  required: ["id"],
  additionalProperties: false,
};

async function DeleteAbl(req, res) {
  try {
    const reqParams = req.body;

    // validate input
    const valid = ajv.validate(schema, reqParams);
    if (!valid) {
      res.status(400).json({
        code: "dtoInIsNotValid",
        status: "dtoIn is not valid",
        validationError: ajv.errors,
      });
      return;
    }

    // check there is no task related to given status
    const taskList = taskDao.listByStatusId(reqParams.id);
    if (taskList.length) {
      res.status(400).json({
        code: "statusWithTasks",
        message: "Status has related tasks and cannot be deleted",
        validationError: ajv.errors,
      });
      return;
    }

    // remove task from persistant storage
    statusDao.remove(reqParams.id);

    // return properly filled dtoOut
    res.json({});
  } catch (e) {
    res.status(500).json({ status: e.status });
  }
}

module.exports = DeleteAbl;