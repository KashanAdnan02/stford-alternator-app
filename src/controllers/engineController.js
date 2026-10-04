const Engine = require("../models/Engine");

async function getEngineBySerialNumber(req, res) {
  const serialNumber = req.params.serialNumber?.trim();
  if (!serialNumber) {
    return res.status(400).json({ success: false, msg: "Serial number is required." });
  }

  try {
    const engine = await Engine.findOne(
      { serial_no: serialNumber },
      { _id: 0, serial_no: 1, model: 1, engine_name: 1, location: 1 },
    ).lean();
    if (!engine) {
      return res.status(404).json({ success: false, msg: "No alternator was found." });
    }

    return res.json({ success: true, engine });
  } catch (error) {
    console.error("Fetching engine failed:", error);
    return res.status(500).json({ success: false, msg: "Unable to fetch alternator." });
  }
}

module.exports = { getEngineBySerialNumber };
