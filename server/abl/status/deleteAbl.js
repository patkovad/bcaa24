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
        message: "dtoIn is not valid",
        validationError: ajv.errors,
      });
      return;
    }

    const allTasks = taskDao.list();

    // check there is no task related to given status
    const taskList = taskDao.listByStatusId(allTasks, reqParams.id);
    if (taskList.length) {
      res.status(400).json({
        code: "statusWithTasks",
        message: "Status has related tasks and cannot be deleted",
        validationError: ajv.errors,
      });
      return;
    }

     // remove task from persistant storage
        try {
          statusDao.remove(reqParams.id);
        } catch (e) {
          res.status(500).json({
            code: "failedToRemoveTask",
            message: "Failed to delete status.",
            error: e.message,
          });
          return;
        }
    
        res.status(200).json({
          code: "statusDeleted",
          message: `Status ID '${reqParams.id}' was successfully deleted.`,
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