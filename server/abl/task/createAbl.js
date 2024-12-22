const Ajv = require("ajv");
const addFormats = require("ajv-formats").default;
const ajv = new Ajv();
addFormats(ajv);

const taskDao = require("../../dao/task-dao.js");

const schema = {
  type: "object",
  properties: {
    name: { type: "string", minLength: 1 }, // the name must be non-empty
    description: { type: "string", default: "" }, // if it is not specified, the default value wil be an empty string
    date: { type: "string", format: "date" },
    statusId: { type: "string", minLength: 1 }, //the status must be non-empty
  },
  required: ["name", "date", "statusId"], // name, date and statusID are a required parameters
  additionalProperties: false,
};

async function CreateAbl(req, res) {
  try {
    let task = req.body;

    // validate input
    const valid = ajv.validate(schema, task);
    if (!valid) {
      const errors = ajv.errors.map((err) => {
        if (err.instancePath === "/name" && err.keyword === "minLength") {
          return "Please enter a task name.";
        }
        if (err.instancePath === "/date" && err.keyword === "format") {
          return "Please enter a valid completion date (YYYY-MM-DD).";
        }
        if (err.instancePath === "/statusId" && err.keyword === "minLength") {
          return "Please enter a valid task status.";
        }
        return `Mistake: ${err.message}`;
      });

      res.status(400).json({
        code: "dtoInIsNotValid",
        task: "dtoIn is not valid",
        validationError: errors,
      });
      return;
    }

    // store task to a persistant storage
    try {
        task = taskDao.create(task);
    } catch (e) {
      res.status(400).json({
        ...e,
      });
      return;
    }

    // return properly filled dtoOut
    res.json(task);
  } catch (e) {
    res.status(500).json({ task: e.task });
  }
}

module.exports = CreateAbl;