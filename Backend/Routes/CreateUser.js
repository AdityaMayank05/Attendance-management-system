const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const Admin = require('../models/Admin');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');

// POST /api/createuser
router.post('/createuser',
    [
        body('email').isEmail().withMessage('Please enter a valid email'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
        body('name').notEmpty().withMessage('Name is required'),
        body('role').notEmpty().withMessage('Role is required') // Validate role
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ success: false, errors: errors.array() });
            }

            const { name, email, password, role } = req.body;

            // Check if user already exists
            let user;
            switch (role) {
                case 'admin':
                    user = await Admin.findOne({ email });
                    break;
                case 'student':
                    user = await Student.findOne({ email });
                    break;
                case 'teacher':
                    user = await Teacher.findOne({ email });
                    break;
                default:
                    return res.status(400).json({ success: false, error: 'Invalid role' });
            }

            if (user) {
                return res.status(400).json({ success: false, error: 'User already exists' });
            }

            // Create new user
            switch (role) {
                case 'admin':
                    user = new Admin({ name, email, password });
                    break;
                case 'student':
                    user = new Student({ name, email, password });
                    break;
                case 'teacher':
                    user = new Teacher({ name, email, password });
                    break;
                default:
                    return res.status(400).json({ success: false, error: 'Invalid role' });
            }

            // Save user to database
            await user.save();

            res.json({ success: true });
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ success: false, error: 'Server error' });
        }
    }
);
// POST /api/login
router.post('/login',
    [
        body('email').isEmail().withMessage('Please enter a valid email'),
        body('password').notEmpty().withMessage('Password is required'),
        body('role').notEmpty().withMessage('Role is required') // Validate role
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ success: false, errors: errors.array() });
            }

            const { email, password, role } = req.body;
            let user;

            // Check user role and find user in the respective collection
            switch (role) {
                case 'admin':
                    user = await Admin.findOne({ email });
                    break;
                case 'student':
                    user = await Student.findOne({ email });
                    break;
                case 'teacher':
                    user = await Teacher.findOne({ email });
                    break;
                default:
                    return res.status(400).json({ success: false, error: 'Invalid role' });
            }

            if (!user) {
                return res.status(400).json({ success: false, error: 'Invalid credentials' });
            }

            // For demonstration purposes, compare plain text passwords
            if (user.password !== password) {
                return res.status(400).json({ success: false, error: 'Invalid credentials' });
            }

            res.json({ success: true, message: 'Login successful', role });
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ success: false, error: 'Server error' });
        }
    }
);

module.exports = router;