const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema({
  name: String,
  number: String,
  type: String,
  brand: String,
  fuel: String,
  year: Number
});

module.exports = mongoose.model("Vehicle", vehicleSchema);
