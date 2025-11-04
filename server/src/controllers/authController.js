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
        console.error('Registration/Login error:', error);
        let errorMessage = 'Server error occurred';
        let statusCode = 500;

        if (error.name === 'ValidationError') {
            statusCode = 400;
            errorMessage = 'Invalid data provided';
        } else if (error.name === 'MongoError' || error.name === 'MongoServerError') {
            if (error.code === 11000) {
                statusCode = 409;
                errorMessage = 'A user with this email already exists';
            }
        }

        // Send detailed error in development, generic error in production
        res.status(statusCode).json({ 
            message: errorMessage,
            error: process.env.NODE_ENV === 'development' ? {
                details: error.message,
                stack: error.stack
            } : undefined
        });
    }
};

exports.register = async (req, res) => {
    try {
        const { name, email, password, role, subject, classes, phone, ...additionalData } = req.body;

        // Validate required fields
        if (!name || !email || !password || !role) {
            return res.status(400).json({ 
                message: 'Missing required fields',
                details: {
                    name: !name ? 'Name is required' : null,
                    email: !email ? 'Email is required' : null,
                    password: !password ? 'Password is required' : null,
                    role: !role ? 'Role is required' : null
                }
            });
        }

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: 'Invalid email format'
            });
        }

        // Password validation
        if (password.length < 6) {
            return res.status(400).json({
                message: 'Password must be at least 6 characters long'
            });
        }

        // Validate role
        const validRoles = ['teacher', 'student', 'admin'];
        if (!validRoles.includes(role)) {
            return res.status(400).json({ 
                message: 'Invalid role specified',
                validRoles: validRoles
            });
        }

        // Check if user already exists for any role
        const existingUser = await Promise.all([
            Teacher.findOne({ email }),
            Student.findOne({ email }),
            Admin.findOne({ email })
        ]);

        if (existingUser.some(user => user !== null)) {
            return res.status(400).json({
                message: 'Email already registered'
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        let user;
        // Create user based on role
        switch (role) {
            case 'teacher':
                user = new Teacher({
                    name,
                    email,
                    password: hashedPassword,
                    subject: subject || 'General',
                    classes: classes || ['All'],
                    phone: phone || '0000000000'
                });
                break;
            case 'student':
                // Validate student-specific fields
                const requiredStudentFields = ['class', 'section', 'admissionNumber'];
                const missingFields = requiredStudentFields.filter(field => !additionalData[field]);
                if (missingFields.length > 0) {
                    return res.status(400).json({
                        message: 'Missing required student fields',
                        missingFields: missingFields
                    });
                }
                user = new Student({
                    name,
                    email,
                    password: hashedPassword,
                    ...additionalData
                });
                break;
            case 'admin':
                user = new Admin({
                    name,
                    email,
                    password: hashedPassword
                });
                break;
        }

        try {
            // Save the user
            await user.save();

            // Create JWT payload with role-specific data
            const payload = {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: role
                }
            };

            // Sign the JWT token
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
        } catch (modelError) {
            if (modelError.name === 'ValidationError') {
                return res.status(400).json({
                    message: 'Validation failed',
                    errors: Object.values(modelError.errors).map(err => ({
                        field: err.path,
                        message: err.message
                    }))
                });
            }
            throw modelError;
        }
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