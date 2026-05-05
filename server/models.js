const mongoose = require('mongoose');

// User Schema
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
    },
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  { timestamps: true }
);

// Schedule Schema
const scheduleSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    courseName: {
      type: String,
      required: [true, 'Course name is required'],
      trim: true,
    },
    courseCode: {
      type: String,
      trim: true,
    },
    days: {
      type: [String],
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      required: [true, 'At least one day is required'],
    },
    startTime: {
      type: String,
      required: [true, 'Start time is required'],
    },
    endTime: {
      type: String,
      required: [true, 'End time is required'],
    },
    location: {
      type: String,
      trim: true,
      default: '',
    },
    color: {
      type: String,
      default: '#4f46e5',
    },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);
const Schedule = mongoose.model('Schedule', scheduleSchema);

module.exports = { User, Schedule };
