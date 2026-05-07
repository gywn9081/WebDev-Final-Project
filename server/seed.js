const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User')
const Schedule = require('./models/Schedule')
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/syncschedule';

const seedData = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Schedule.deleteMany({});
    console.log('Cleared existing data.');

    // Create test users
    const hashedPassword = await bcrypt.hash('password123', 10);

    const caleb = await User.create({
      username: 'caleb',
      email: 'caleb@syncschedule.com',
      password: hashedPassword,
    });

    const henry = await User.create({
      username: 'henry',
      email: 'henry@syncschedule.com',
      password: hashedPassword,
    });

    const alice = await User.create({
      username: 'alice',
      email: 'alice@syncschedule.com',
      password: hashedPassword,
    });

    // Establish friendships
    caleb.friends.push(henry._id);
    henry.friends.push(caleb._id);
    caleb.friends.push(alice._id);
    alice.friends.push(caleb._id);

    await caleb.save();
    await henry.save();
    await alice.save();

    console.log('Users created and friendships established.');

    // Create schedules for caleb
    await Schedule.insertMany([
      {
        userId: caleb._id,
        courseName: 'Web Development II',
        courseCode: 'CS 4420',
        days: ['Monday', 'Wednesday'],
        startTime: '09:00',
        endTime: '10:15',
        location: 'Tech Hall 101',
        color: '#4f46e5',
      },
      {
        userId: caleb._id,
        courseName: 'Data Structures',
        courseCode: 'CS 3200',
        days: ['Tuesday', 'Thursday'],
        startTime: '11:00',
        endTime: '12:15',
        location: 'Science Building 205',
        color: '#0891b2',
      },
      {
        userId: caleb._id,
        courseName: 'Linear Algebra',
        courseCode: 'MATH 3100',
        days: ['Monday', 'Wednesday', 'Friday'],
        startTime: '13:00',
        endTime: '13:50',
        location: 'Math Hall 310',
        color: '#16a34a',
      },
    ]);

    // Create schedules for henry
    await Schedule.insertMany([
      {
        userId: henry._id,
        courseName: 'Web Development II',
        courseCode: 'CS 4420',
        days: ['Monday', 'Wednesday'],
        startTime: '09:00',
        endTime: '10:15',
        location: 'Tech Hall 101',
        color: '#4f46e5',
      },
      {
        userId: henry._id,
        courseName: 'Operating Systems',
        courseCode: 'CS 4500',
        days: ['Tuesday', 'Thursday'],
        startTime: '09:30',
        endTime: '10:45',
        location: 'Tech Hall 220',
        color: '#dc2626',
      },
      {
        userId: henry._id,
        courseName: 'Linear Algebra',
        courseCode: 'MATH 3100',
        days: ['Monday', 'Wednesday', 'Friday'],
        startTime: '13:00',
        endTime: '13:50',
        location: 'Math Hall 310',
        color: '#16a34a',
      },
    ]);

    // Create schedules for alice
    await Schedule.insertMany([
      {
        userId: alice._id,
        courseName: 'Data Structures',
        courseCode: 'CS 3200',
        days: ['Tuesday', 'Thursday'],
        startTime: '11:00',
        endTime: '12:15',
        location: 'Science Building 205',
        color: '#0891b2',
      },
      {
        userId: alice._id,
        courseName: 'Technical Writing',
        courseCode: 'ENG 3100',
        days: ['Monday', 'Wednesday'],
        startTime: '14:00',
        endTime: '15:15',
        location: 'Liberal Arts 108',
        color: '#9333ea',
      },
    ]);

    console.log('Schedules seeded for all users.');
    console.log('\nSeed complete. Test credentials:');
    console.log('  caleb@syncschedule.com / password123');
    console.log('  henry@syncschedule.com / password123');
    console.log('  alice@syncschedule.com / password123');

    mongoose.disconnect();
  } catch (err) {
    console.error('Seeding error:', err);
    mongoose.disconnect();
    process.exit(1);
  }
};

seedData();
