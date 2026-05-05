const express = require('express');
const router = express.Router();
const {
  getSchedulesByUser,
  getScheduleById,
  createSchedule,
  updateSchedule,
  deleteSchedule,
} = require('../controllers/schedule.controller');

router.get('/:userId', getSchedulesByUser);
router.get('/entry/:id', getScheduleById);
router.post('/', createSchedule);
router.put('/:id', updateSchedule);
router.delete('/:id', deleteSchedule);

module.exports = router;
