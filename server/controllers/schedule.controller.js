const Schedule = require('../models/Schedule');

// GET /api/schedules/:userId
const getSchedulesByUser = async (req, res) => {
  try {
    const schedules = await Schedule.find({ userId: req.params.userId }).sort({ day: 1, startTime: 1 });
    res.json(schedules);
  } catch (err) {
    res.status(500).json({ message: 'Server error fetching schedules', error: err.message });
  }
};

// GET /api/schedules/entry/:id
const getScheduleById = async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id);
    if (!schedule) {
      return res.status(404).json({ message: 'Schedule entry not found' });
    }
    res.json(schedule);
  } catch (err) {
    res.status(500).json({ message: 'Server error fetching schedule entry', error: err.message });
  }
};

// POST /api/schedules
const createSchedule = async (req, res) => {
  try {
    const { userId, courseName, courseCode, days, startTime, endTime, location, color } = req.body;

    const schedule = new Schedule({
      userId,
      courseName,
      courseCode,
      days,
      startTime,
      endTime,
      location,
      color,
    });

    await schedule.save();
    res.status(201).json(schedule);
  } catch (err) {
    res.status(500).json({ message: 'Server error creating schedule entry', error: err.message });
  }
};

// PUT /api/schedules/:id
const updateSchedule = async (req, res) => {
  try {
    const { courseName, courseCode, days, startTime, endTime, location, color } = req.body;

    const schedule = await Schedule.findByIdAndUpdate(
      req.params.id,
      { courseName, courseCode, days, startTime, endTime, location, color },
      { new: true, runValidators: true }
    );

    if (!schedule) {
      return res.status(404).json({ message: 'Schedule entry not found' });
    }

    res.json(schedule);
  } catch (err) {
    res.status(500).json({ message: 'Server error updating schedule entry', error: err.message });
  }
};

// DELETE /api/schedules/:id
const deleteSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.findByIdAndDelete(req.params.id);
    if (!schedule) {
      return res.status(404).json({ message: 'Schedule entry not found' });
    }
    res.json({ message: 'Schedule entry deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error deleting schedule entry', error: err.message });
  }
};

module.exports = {
  getSchedulesByUser,
  getScheduleById,
  createSchedule,
  updateSchedule,
  deleteSchedule,
};
