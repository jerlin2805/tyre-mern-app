const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema(
  {
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
      required: true
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    serviceDescription: {
      type: String,
      required: true,
      trim: true
    },
    serviceDate: {
      type: Date,
      required: true
    },
    serviceCost: {
      type: Number,
      default: 0
    },
    serviceProvider: {
      type: String,
      trim: true
    },
    notes: {
      type: String,
      trim: true
    },
    nextServiceDate: {
      type: Date
    },
    serviceType: {
      type: String,
      enum: ['maintenance', 'repair', 'inspection', 'replacement', 'other'],
      default: 'maintenance'
    }
  },
  { timestamps: true }
);

// Index for better query performance
ServiceSchema.index({ owner: 1, vehicle: 1, serviceDate: -1 });

module.exports = mongoose.model('Service', ServiceSchema);
