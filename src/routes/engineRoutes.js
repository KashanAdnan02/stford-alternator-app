const express = require("express");
const { getEngineBySerialNumber } = require("../controllers/engineController");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

router.get("/:serialNumber", requireAuth, getEngineBySerialNumber);

module.exports = router;
