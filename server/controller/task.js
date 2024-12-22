const express = require("express");
const router = express.Router();

const GetAbl = require("../abl/task/getAbl");
const ListAbl = require("../abl/task/listAbl");
const CreateAbl = require("../abl/task/createAbl");
const DeleteAbl = require("../abl/task/deleteAbl");
const UpdateAbl = require("../abl/task/updateAbl");
const UpdateStatusAbl = require("../abl/task/updateStatusAbl");

router.get("/get", GetAbl);
router.get("/list", ListAbl);
router.post("/create", CreateAbl);
router.post("/delete", DeleteAbl);
router.post("/update", UpdateAbl);
router.post("/updateStatus", UpdateStatusAbl);

module.exports = router;