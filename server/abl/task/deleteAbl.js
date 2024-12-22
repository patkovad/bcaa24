const Ajv = require("ajv");
const ajv = new Ajv();

const taskDao = require("../../dao/task-dao.js");

const schema = {
  type: "object",
  properties: {
    id: { type: "string", minLength: 32, maxLength: 32 },
  },
  required: ["id"], // ID is a required parameter
  additionalProperties: false,
};

async function DeleteAbl(req, res) {
  try {
    // get request query or body
    const reqParams = req.body;

    // validate input
    const valid = ajv.validate(schema, reqParams);
    if (!valid) {
      res.status(400).json({
        code: "dtoInIsNotValid",
        message: "dtoIn is not valid",
        validationError: ajv.errors,
      });
      return;
    }

    // checking the existence of a task
    const task = taskDao.get(reqParams.id);
    if (!task) {
      res.status(404).json({
        code: "taskNotFound",
        message: `Task ID '${reqParams.id}' not found.`,
      });
      return;
    }

    // remove task from persistant storage
    try {
      taskDao.remove(reqParams.id);
    } catch (e) {
      res.status(500).json({
        code: "failedToRemoveTask",
        message: "Failed to delete task.",
        error: e.message,
      });
      return;
    }

    res.status(200).json({
      code: "taskDeleted",
      message: `Task ID '${reqParams.id}' was successfully deleted.`,
    });
  } catch (e) {
    res.status(500).json({
      code: "unexpectedError",
      message: "Unexpected error while deleting task.",
      error: e.message,
    });
  }
}

module.exports = DeleteAbl;