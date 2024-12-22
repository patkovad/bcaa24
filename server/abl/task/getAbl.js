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

async function GetAbl(req, res) {
  try {
    // get request query or body
    const reqParams = req.query?.id ? req.query : req.body;

    // validate input
    const valid = ajv.validate(schema, reqParams);
    if (!valid) {
      res.status(400).json({
        code: "dtoInIsNotValid",
        task: "dtoIn is not valid",
        validationError: ajv.errors,
      });
      return;
    }

    // read task by given id
    const task = taskDao.get(reqParams.id);
    if (!task) {
      res.status(404).json({
        code: "taskNotFound",
        task: `Task with ID ${reqParams.id} not found`,
      });
      return;
    }

    // return properly filled dtoOut
    res.json(task);
  } catch (e) {
    res.status(500).json({
      code: "unexpectedError",
      message: "Unexpected error while getting task.",
      error: e.message,
    });
  }
}

module.exports = GetAbl;