const Ajv = require("ajv");
const addFormats = require("ajv-formats").default;
const ajv = new Ajv();
addFormats(ajv);

const taskDao = require("../../dao/task-dao.js");

const schema = {
  type: "object",
  properties: {
    id: { type: "string", minLength: 32, maxLength: 32 },
    name: { type: "string" },
    description: { type: "string" },
    date: { type: "string", format: "date" },
    statusId: { type: "string" }
  },
  required: ["id"], // id is a required parameter
  additionalProperties: false,
};

async function UpdateAbl(req, res) {
  try {
    let reqParams = req.body;

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

    // get an existing task
    const existingTask = taskDao.get(reqParams.id);
    if (!existingTask) {
      return res.status(404).json({
        code: "taskNotFound",
        message: `Task ID ${reqParams.id} not found.`,
      });
    }


    // task update
    const updatedTask = { ...existingTask, ...reqParams };
    const result = taskDao.update(updatedTask);

    // returning an updated task
    res.json(result);
  } catch (e) {
    res.status(500).json({
      code: "internalError",
      message: "Mistake during updating.",
      error: e.message,
    });
  }
}

module.exports = UpdateAbl;