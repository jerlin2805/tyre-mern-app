const express = require('express');
const Vehicle = require('../models/Vehicle');
const auth = require('../middleware/auth');

const router = express.Router();

// GET /api/vehicles - list vehicles for authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ owner: req.user._id }).sort({ createdAt: -1 });
    res.json(vehicles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/vehicles - add a vehicle
router.post('/', auth, async (req, res) => {
  try {

    const {
      vehicleNumber,
      vehicleType,
      brand,
      notes,
    } = req.body;

    if (!vehicleNumber || !vehicleType || !brand) {
      return res.status(400).json({ message: 'Missing fields' });
    }


    const v = new Vehicle({
      vehicleNumber,
      vehicleType,
      brand,
      notes,
      owner: req.user._id,
    });
    await v.save();
    res.status(201).json(v);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


// PUT /api/vehicles/:id - update vehicle
router.put('/:id', auth, async (req, res) => {
  try {
    const update = req.body;
    const v = await Vehicle.findOneAndUpdate({ _id: req.params.id, owner: req.user._id }, update, { new: true });
    if (!v) return res.status(404).json({ message: 'Not found' });
    res.json(v);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/vehicles/:id - delete vehicle
router.delete('/:id', auth, async (req, res) => {
  try {
    const v = await Vehicle.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    if (!v) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
