const statusDao = require("../../dao/status-dao.js");

async function ListAbl(req, res) {
  try {
    const statusList = statusDao.list();
    res.json({ itemList: statusList });
  } catch (e) {
    res.status(500).json({ status: e.status });
  }
}

module.exports = ListAbl;