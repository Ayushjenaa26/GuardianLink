const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

// Import models
const Teacher = require('../models/TeacherSide/Teacher');
const Student = require('../models/Student'); // We'll need to create this
const Admin = require('../models/Admin'); // We'll need to create this

exports.login = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        // Validate input
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        let user;
        // Find user based on role
        switch (role) {
            case 'teacher':
                user = await Teacher.findOne({ email });
                break;
            case 'student':
                user = await Student.findOne({ email });
                break;
            case 'admin':
                user = await Admin.findOne({ email });
                break;
            default:
                return res.status(400).json({ message: 'Invalid role specified' });
        }

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Create JWT payload
        const payload = {
            user: {
                id: user._id,
                role: role,
                name: user.name,
                email: user.email
            }
        };

        // Sign and return JWT
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '24h' },
            (err, token) => {
                if (err) throw err;
                res.json({
                    token,
                    user: {
                        id: user._id,
                        name: user.name,
                        email: user.email,
                        role: role
                    }
                });
            }
        );

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
};

exports.register = async (req, res) => {
    try {
        const { name, email, password, role, ...additionalData } = req.body;

        // Validate input
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Check if user already exists
        let UserModel;
        switch (role) {
            case 'teacher':
                UserModel = Teacher;
                break;
            case 'student':
                UserModel = Student;
                break;
            case 'admin':
                UserModel = Admin;
                break;
            default:
                return res.status(400).json({ message: 'Invalid role specified' });
        }

        let user = await UserModel.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user based on role
        user = new UserModel({
            name,
            email,
            password: hashedPassword,
            ...additionalData
        });

        await user.save();

        // Create JWT payload
        const payload = {
            user: {
                id: user._id,
                role: role,
                name: user.name,
                email: user.email
            }
        };

        // Sign and return JWT
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '24h' },
            (err, token) => {
                if (err) throw err;
                res.status(201).json({
                    token,
                    user: {
                        id: user._id,
                        name: user.name,
                        email: user.email,
                        role: role
                    }
                });
            }
        );

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
};

// Get current user
exports.getCurrentUser = async (req, res) => {
    try {
        const { id, role } = req.user;
        
        let UserModel;
        switch (role) {
            case 'teacher':
                UserModel = Teacher;
                break;
            case 'student':
                UserModel = Student;
                break;
            case 'admin':
                UserModel = Admin;
                break;
            default:
                return res.status(400).json({ message: 'Invalid role' });
        }

        const user = await UserModel.findById(id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ user: { ...user._doc, role } });
    } catch (error) {
        console.error('Get current user error:', error);
        res.status(500).json({ message: 'Server error fetching user data' });
    }
};