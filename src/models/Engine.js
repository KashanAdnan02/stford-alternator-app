const mongoose = require("mongoose");

const engineSchema = new mongoose.Schema(
  {
    engine_name: { type: String, required: true },
    location: { type: String, required: true },
    serial_no: { type: String, required: true, unique: true },
    model: { type: String, required: true },
  },
  { versionKey: false },
);

module.exports = mongoose.model("Engine", engineSchema, "engines");
