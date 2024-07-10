const express = require('express');
const router = express.Router();
const Teacher = require('../models/Teacher');

// GET /api/teachers
router.get('/teachers', async (req, res) => {
    try {
        const teachers = await Teacher.find();
        res.json(teachers);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

module.exports = router;
