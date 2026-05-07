const Schedule = require('../models/Schedule');

// Convert HH:MM time string to minutes since midnight for comparison
function timeToMinutes(timeStr) {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

// Check if two time blocks overlap
function doTimesOverlap(startA, endA, startB, endB) {
  const startAMin = timeToMinutes(startA);
  const endAMin = timeToMinutes(endA);
  const startBMin = timeToMinutes(startB);
  const endBMin = timeToMinutes(endB);
  return startAMin < endBMin && endAMin > startBMin;
}

// GET /api/compare/:userId/:friendId
const compareSchedules = async (req, res) => {
  try {
    const { userId, friendId } = req.params;

    const [userSchedules, friendSchedules] = await Promise.all([
      Schedule.find({ userId }),
      Schedule.find({ userId: friendId }),
    ]);

    const sharedClasses = [];
    const overlappingFreeTime = [];
    const conflicts = [];

    // Find shared course names (same class)
    userSchedules.forEach((userEntry) => {
      friendSchedules.forEach((friendEntry) => {
        const sameCourse =
          userEntry.courseName.toLowerCase() === friendEntry.courseName.toLowerCase();

        if (sameCourse) {
          sharedClasses.push({
            courseName: userEntry.courseName,
            courseCode: userEntry.courseCode,
            days: userEntry.days,
            startTime: userEntry.startTime,
            endTime: userEntry.endTime,
          });
        }
      });
    });

    // Find time conflicts (both busy at the same time - no free time overlap)
    const allDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

    allDays.forEach((day) => {
      const userBusy = userSchedules.filter((s) => s.days.includes(day));
      const friendBusy = friendSchedules.filter((s) => s.days.includes(day));

      userBusy.forEach((uEntry) => {
        friendBusy.forEach((fEntry) => {
          if (doTimesOverlap(uEntry.startTime, uEntry.endTime, fEntry.startTime, fEntry.endTime)) {
            const alreadyShared = sharedClasses.some(
              (sc) =>
                sc.courseName.toLowerCase() === uEntry.courseName.toLowerCase() &&
                sc.days.includes(day)
            );

            if (!alreadyShared) {
              conflicts.push({
                day,
                userCourse: uEntry.courseName,
                friendCourse: fEntry.courseName,
                userTime: `${uEntry.startTime} - ${uEntry.endTime}`,
                friendTime: `${fEntry.startTime} - ${fEntry.endTime}`,
              });
            }
          }
        });
      });
    });

    res.json({
      sharedClasses,
      conflicts,
      userScheduleCount: userSchedules.length,
      friendScheduleCount: friendSchedules.length,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error comparing schedules', error: err.message });
  }
};

module.exports = { compareSchedules };
