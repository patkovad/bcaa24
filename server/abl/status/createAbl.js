const Ajv = require("ajv");
const addFormats = require("ajv-formats").default;
const ajv = new Ajv();
addFormats(ajv);

const statusDao = require("../../dao/status-dao.js");

const schema = {
  type: "object",
  properties: {
    name: { type: "string", minLength: 1, maxLength: 255 },
  },
  required: ["name"],
  additionalProperties: false,
};

async function CreateAbl(req, res) {
  try {
    let status = req.body;

    // validate input
    const valid = ajv.validate(schema, status);
    if (!valid) {
      res.status(400).json({
        code: "dtoInIsNotValid",
        status: "dtoIn is not valid",
        validationError: ajv.errors,
      });
      return;
    }

    // store status to a persistant storage
    try {
        status = statusDao.create(status);
    } catch (e) {
      res.status(400).json({
        ...e,
      });
      return;
    }

    // return properly filled dtoOut
    res.json(status);
  } catch (e) {
    res.status(500).json({ status: e.status });
  }
}

module.exports = CreateAbl;