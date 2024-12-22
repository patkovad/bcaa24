const Ajv = require("ajv");
const ajv = new Ajv();

const statusDao = require("../../dao/status-dao.js");

const schema = {
  type: "object",
  properties: {
    id: { type: "string" },
  },
  required: ["id"],
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
        status: "dtoIn is not valid",
        validationError: ajv.errors,
      });
      return;
    }

    // read status by given id
    const status = statusDao.get(reqParams.id);
    if (!status) {
      res.status(404).json({
        code: "statusNotFound",
        status: `Status with ID ${reqParams.id} not found`,
      });
      return;
    }

    // return properly filled dtoOut
    res.json(status);
  } catch (e) {
    res.status(500).json({ status: e.status });
  }
}

module.exports = GetAbl;