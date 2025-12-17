const express = require('express');
const Service = require('../models/Service');
const Vehicle = require('../models/Vehicle');
const auth = require('../middleware/auth');

const router = express.Router();

// GET /api/services - list all services for authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const services = await Service.find({ owner: req.user._id })
      .populate('vehicle', 'vehicleNumber vehicleType brand')
      .sort({ serviceDate: -1 });
    res.json(services);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/services/vehicle/:vehicleId - get services for specific vehicle
router.get('/vehicle/:vehicleId', auth, async (req, res) => {
  try {
    // Verify vehicle belongs to user
    const vehicle = await Vehicle.findOne({
      _id: req.params.vehicleId,
      owner: req.user._id
    });
    
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    const services = await Service.find({
      vehicle: req.params.vehicleId,
      owner: req.user._id
    }).sort({ serviceDate: -1 });

    res.json(services);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/services - add a new service
router.post('/', auth, async (req, res) => {
  try {
    const {
      vehicleId,
      serviceDescription,
      serviceDate,
      serviceCost,
      serviceProvider,
      notes,
      nextServiceDate,
      serviceType
    } = req.body;

    if (!vehicleId || !serviceDescription || !serviceDate) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Verify vehicle belongs to user
    const vehicle = await Vehicle.findOne({
      _id: vehicleId,
      owner: req.user._id
    });

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    const service = new Service({
      vehicle: vehicleId,
      owner: req.user._id,
      serviceDescription,
      serviceDate: new Date(serviceDate),
      serviceCost: serviceCost || 0,
      serviceProvider,
      notes,
      nextServiceDate: nextServiceDate ? new Date(nextServiceDate) : undefined,
      serviceType: serviceType || 'maintenance'
    });

    await service.save();
    
    // Populate vehicle info before returning
    await service.populate('vehicle', 'vehicleNumber vehicleType brand');
    
    res.status(201).json(service);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/services/:id - update a service
router.put('/:id', auth, async (req, res) => {
  try {
    const update = req.body;
    
    // Convert date strings to Date objects
    if (update.serviceDate) update.serviceDate = new Date(update.serviceDate);
    if (update.nextServiceDate) update.nextServiceDate = new Date(update.nextServiceDate);

    const service = await Service.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      update,
      { new: true }
    ).populate('vehicle', 'vehicleNumber vehicleType brand');

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.json(service);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/services/:id - delete a service
router.delete('/:id', auth, async (req, res) => {
  try {
    const service = await Service.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.json({ message: 'Service deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
