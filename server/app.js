const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const router = require('./router');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/syncschedule';
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected to SyncSchedule database'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes handled outside middleware - imported from router.js
app.use('/api', router);

// Serve Angular build in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist/client')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/client/index.html'));
  });
}

module.exports = app;
