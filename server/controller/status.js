const express = require("express");
const router = express.Router();

const GetAbl = require("../abl/status/getAbl");
const ListAbl = require("../abl/status/listAbl");
const CreateAbl = require("../abl/status/createAbl");
const UpdateAbl = require("../abl/status/updateAbl");
const DeleteAbl = require("../abl/status/deleteAbl");

router.get("/get", GetAbl);
router.get("/list", ListAbl);
router.post("/create", CreateAbl);
router.post("/delete", DeleteAbl);
router.post("/update", UpdateAbl);

module.exports = router;