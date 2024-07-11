const express = require('express');
const router = express.Router();
const Attendance = require('../models/attendance');
const Student = require('../models/Student');

// Mark attendance
router.post('/mark', async (req, res) => {
  const { studentId, date, status } = req.body;

  if (!['P', 'A'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  try {
    // Fetch student information excluding the password
    const student = await Student.findById(studentId).select('-password');
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const attendance = new Attendance({
      studentId,
      date,
      status,
      studentInfo: student.toObject()
    });
    await attendance.save();
    res.status(201).json(attendance);
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark attendance' });
  }
});

// Get attendance for a student by email
router.get('/:emailId', async (req, res) => {
  const { emailId } = req.params;

  try {
    // Find the student by email
    const student = await Student.findOne({ email: emailId });

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const studentId = student._id;
    
    // Fetch attendance records by student ID
    const attendanceRecords = await Attendance.find({ studentId }).sort({ date: -1 });

    res.status(200).json(attendanceRecords);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch attendance records' });
  }
});

module.exports = router;


// Check if attendance is marked for a specific date
router.get('/check', async (req, res) => {
  const { date } = req.query;

  try {
    const attendanceRecords = await Attendance.find({ date: new Date(date) });
    if (attendanceRecords.length > 0) {
      return res.status(200).json({ marked: true });
    }
    res.status(200).json({ marked: false });
  } catch (error) {
    res.status(500).json({ error: 'Failed to check attendance records' });
  }
});

module.exports = router;
