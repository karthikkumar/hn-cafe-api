const mongoose = require("mongoose");

const settingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  value: {}, // Mixed
});

const Setting = new mongoose.model("Setting", settingSchema);

module.exports = Setting;
