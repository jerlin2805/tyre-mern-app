const mongoose = require('mongoose');


const VehicleSchema = new mongoose.Schema(
  {
    vehicleNumber: { type: String, required: true },
    vehicleType: { type: String, required: true },
    brand: { type: String, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    // optional notes
    notes: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Vehicle', VehicleSchema);
