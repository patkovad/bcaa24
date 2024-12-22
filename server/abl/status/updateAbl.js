const Ajv = require("ajv");
const ajv = new Ajv();

const statusDao = require("../../dao/status-dao.js");

const schema = {
  type: "object",
  properties: {
    id: { type: "string" },
    name: { type: "string" },
  },
  required: ["id"],
  additionalProperties: false,
};

async function UpdateAbl(req, res) {
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

    // update status in persistent storage
    let updatedStatus;
    try {
      updatedStatus = statusDao.update(status);
    } catch (e) {
      res.status(400).json({
        ...e,
      });
      return;
    }
    if (!updatedStatus) {
      res.status(404).json({
        code: "statusNotFound",
        status: `Status with id ${status.id} not found`,
      });
      return;
    }

    // return properly filled dtoOut
    res.json(updatedStatus);
  } catch (e) {
    res.status(500).json({ status: e.status });
  }
}

module.exports = UpdateAbl;