const express = require('express');
const router = express.Router();

const userRoutes = require('./routes/user.routes');
const scheduleRoutes = require('./routes/schedule.routes');
const friendRoutes = require('./routes/friend.routes');
const compareRoutes = require('./routes/compare.routes');

router.use('/users', userRoutes);
router.use('/schedules', scheduleRoutes);
router.use('/friends', friendRoutes);
router.use('/compare', compareRoutes);

module.exports = router;
