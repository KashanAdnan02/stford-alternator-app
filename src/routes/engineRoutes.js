const express = require("express");
const { getEngineBySerialNumber } = require("../controllers/engineController");

const router = express.Router();

router.get("/:serialNumber", getEngineBySerialNumber);

module.exports = router;
