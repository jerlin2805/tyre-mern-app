const mongoose = require('mongoose');

const VehicleSchema = new mongoose.Schema(
  {
    vehicleNumber: { type: String, required: true },
    vehicleType: { type: String, required: true },
    brand: { type: String, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    // registration info
    registrationNumber: { type: String },
    registrationExpiry: { type: Date },
    // tyre specifications
    tyreSpecs: {
      size: { type: String },
      brand: { type: String },
      pressure: { type: Number },
    },
    // optional notes
    notes: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Vehicle', VehicleSchema);
