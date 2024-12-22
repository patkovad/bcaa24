const Ajv = require("ajv");
const ajv = new Ajv();

const taskDao = require("../../dao/task-dao.js");

const schema = {
  type: "object",
  properties: {
    taskId: { type: "string", minLength: 32, maxLength: 32 },
    statusId: { type: "string", minLength: 1 },
  },
  required: ["taskId", "statusId"],
  additionalProperties: false,
};

async function UpdateStatusAbl(req, res) {
  try {
    const { taskId, statusId } = req.body;

    // validate input
    const valid = ajv.validate(schema, { taskId, statusId });
    if (!valid) {
      return res.status(400).json({
        code: "dtoInIsNotValid",
        message: "dtoIn is not valid",
        validationError: ajv.errors,
      });
    }

    // get an existing task
    const existingTask = taskDao.get(reqParams.id);
    if (!existingTask) {
      return res.status(404).json({
        code: "taskNotFound",
        message: `Task ID ${reqParams.id} not found.`,
      });
    }

    // task status update
    const updatedTask = taskDao.updateStatus(taskId, statusId);

    // returning an updated task
    res.json(updatedTask);
  } catch (e) {
    res.status(500).json({
      code: "internalError",
      message: "Mistake during updating.",
      error: e.message,
    });
  }
}

module.exports = UpdateStatusAbl;