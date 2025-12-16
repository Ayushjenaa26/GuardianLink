const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

// Import models
const AdminTeacher = require('../models/AdminSide/AdminTeacher');
const AdminStudent = require('../models/AdminSide/AdminStudent');
const Admin = require('../models/Admin');
const Parent = require('../models/Parent');
const AdminCode = require('../models/AdminCode');

// Login handler
exports.login = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                success: false,
                errors: errors.array(),
                message: 'Validation error' 
            });
        }

        const { email, password } = req.body;

        // Search for user across all models to auto-detect role
        let user = null;
        let role = null;
        
        const models = [
            { model: Admin, role: 'admin' },
            { model: AdminTeacher, role: 'teacher' },
            { model: Parent, role: 'parent' },
            { model: AdminStudent, role: 'student' }
        ];
        
        for (const { model, role: modelRole } of models) {
            const foundUser = await model.findOne({ email: email.toLowerCase() });
            if (foundUser) {
                user = foundUser;
                role = modelRole;
                break;
            }
        }
        
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Verify password
        let isMatch;
        if (user.matchPassword) {
            // Use the schema method if available
            isMatch = await user.matchPassword(password);
        } else {
            // Fallback to direct comparison
            isMatch = await bcrypt.compare(password, user.password);
        }

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { 
                id: user._id, 
                email: user.email,
                role: role.toLowerCase() 
            },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: role.toLowerCase(),
                ...(role.toLowerCase() === 'teacher' && {
                    subject: user.subject,
                    classes: user.classes
                }),
                ...(role.toLowerCase() === 'parent' && {
                    phone: user.phone,
                    studentRollNo: user.studentRollNo
                }),
                ...(role.toLowerCase() === 'student' && {
                    class: user.class,
                    section: user.section,
                    admissionNumber: user.admissionNumber
                }),
                ...(role.toLowerCase() === 'admin' && {
                    permissions: user.permissions,
                    adminId: user.adminId
                })
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error during login',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Register handler
exports.register = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array(),
                message: 'Validation error'
            });
        }

        const { name, email, password, role, ...additionalFields } = req.body;

        // Determine which model to use based on role
        let UserModel;
        switch (role.toLowerCase()) {
            case 'teacher':
                UserModel = Teacher;
                break;
            case 'parent':
                UserModel = Parent;
                break;
            case 'student':
                UserModel = Student;
                break;
            case 'admin':
                UserModel = Admin;
                break;
            default:
                return res.status(400).json({
                    success: false,
                    message: 'Invalid role specified'
                });
        }

        // Check if user already exists
        const existingUser = await UserModel.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email'
            });
        }

        // Validate admin code if registering as admin
        if (role.toLowerCase() === 'admin') {
            if (!additionalFields.adminId) {
                return res.status(400).json({
                    success: false,
                    message: 'Admin Unique ID is required'
                });
            }

            const codeValidation = await AdminCode.isValidCode(additionalFields.adminId);
            if (!codeValidation.valid) {
                return res.status(400).json({
                    success: false,
                    message: codeValidation.message
                });
            }
        }

        // Validate teacher email against AdminTeacher database
        if (role.toLowerCase() === 'teacher') {
            const AdminTeacher = require('../models/AdminSide/AdminTeacher');
            const teacherRecord = await AdminTeacher.findOne({ email: email.toLowerCase() });
            
            if (!teacherRecord) {
                return res.status(400).json({
                    success: false,
                    message: 'This email is not registered as a teacher in the system. Please contact the administrator.'
                });
            }
        }

        // Validate studentRollNo for parent registration
        if (role.toLowerCase() === 'parent') {
            if (!additionalFields.studentRollNo) {
                return res.status(400).json({
                    success: false,
                    message: 'Student Roll Number is required'
                });
            }

            // Check if roll number exists in AdminStudent database
            const AdminStudent = require('../models/AdminSide/AdminStudent');
            const studentRecord = await AdminStudent.findOne({ rollNo: additionalFields.studentRollNo.trim() });
            
            if (!studentRecord) {
                return res.status(400).json({
                    success: false,
                    message: 'This Student Roll Number does not exist in the system. Please verify the roll number.'
                });
            }

            // Check if roll number is already registered
            const existingParent = await Parent.findOne({ studentRollNo: additionalFields.studentRollNo.trim() });
            if (existingParent) {
                return res.status(400).json({
                    success: false,
                    message: 'This Student Roll Number is already registered with another parent account'
                });
            }
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user with role-specific fields
        const userData = {
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
            role: role.toLowerCase(),
            ...additionalFields
        };

        const user = await UserModel.create(userData);

        // Mark admin code as used if admin registration
        if (role.toLowerCase() === 'admin' && additionalFields.adminId) {
            await AdminCode.markAsUsed(additionalFields.adminId, user._id);
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, role: role.toLowerCase() },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        res.status(201).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: role.toLowerCase(),
                ...(role.toLowerCase() === 'teacher' && {
                    subject: user.subject,
                    classes: user.classes
                }),
                ...(role.toLowerCase() === 'parent' && {
                    phone: user.phone,
                    studentRollNo: user.studentRollNo
                }),
                ...(role.toLowerCase() === 'student' && {
                    class: user.class,
                    section: user.section,
                    admissionNumber: user.admissionNumber
                }),
                ...(role.toLowerCase() === 'admin' && {
                    permissions: user.permissions,
                    adminId: user.adminId
                })
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        
        // Handle MongoDB duplicate key errors
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            const fieldMessages = {
                email: 'This email is already registered',
                studentRollNo: 'This Student Roll Number is already registered with another account',
                adminId: 'This Admin Unique ID is already in use'
            };
            return res.status(400).json({
                success: false,
                message: fieldMessages[field] || `Duplicate value for ${field}`
            });
        }
        
        // Handle validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(e => e.message);
            return res.status(400).json({
                success: false,
                message: messages.join(', ')
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'An error occurred during registration. Please try again.'
        });
    }
};

// Create demo accounts for testing
exports.createDemoTeacher = async () => {
    try {
        // Check for both demo teacher and your account
        const [demoTeacher, yourAccount] = await Promise.all([
            Teacher.findOne({ email: 'teacher@demo.com' }),
            Teacher.findOne({ email: 'ayush.jena26@gmail.com' })
        ]);

        const accounts = [];

        if (!demoTeacher) {
            const hashedPassword = await bcrypt.hash('teacher123', 10);
            accounts.push({
                name: 'Demo Teacher',
                email: 'teacher@demo.com',
                password: hashedPassword,
                subject: 'Computer Science',
                classes: ['Class A', 'Class B']
            });
        }

        if (!yourAccount) {
            const hashedPassword = await bcrypt.hash('123456', 10);
            accounts.push({
                name: 'Ayush Jena',
                email: 'ayush.jena26@gmail.com',
                password: hashedPassword,
                subject: 'General',
                classes: ['All']
            });
        }

        if (accounts.length > 0) {
            await Teacher.create(accounts);
            console.log('Created accounts:', accounts.map(a => a.email).join(', '));
        }
    } catch (error) {
        console.error('Error creating teacher accounts:', error);
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
