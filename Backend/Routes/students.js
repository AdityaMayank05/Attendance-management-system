const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

// GET /api/students
router.get('/students', async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

module.exports = router;
