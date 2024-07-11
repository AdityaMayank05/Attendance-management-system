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

// PUT /api/editteacher/:id
router.put('/editteacher/:id', async (req, res) => {
    const { name, email, password } = req.body;
    const { id } = req.params;

    try {
        // Find the teacher by ID
        const teacher = await Teacher.findById(id);

        if (!teacher) {
            return res.status(404).json({ success: false, error: 'Teacher not found' });
        }

        // Update the teacher's information
        teacher.name = name || teacher.name;
        teacher.email = email || teacher.email;
        teacher.password = password || teacher.password;

        // Save the updated teacher to the database
        await teacher.save();

        res.json({ success: true, data: teacher });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

module.exports = router;
