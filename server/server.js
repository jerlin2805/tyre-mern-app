const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();


const authRouter = require('./routes/auth');
const vehiclesRouter = require('./routes/vehicles');
const servicesRouter = require('./routes/services');

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// test route
app.get('/', (req, res) => {
  res.send('Backend is running 🚀');
});


// mount auth routes
app.use('/api/auth', authRouter);
// mount vehicle routes
app.use('/api/vehicles', vehiclesRouter);
// mount services routes
app.use('/api/services', servicesRouter);


// connect to mongo and start server
const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/nextgen';

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Mongo connection error', err);
    process.exit(1);
  });
