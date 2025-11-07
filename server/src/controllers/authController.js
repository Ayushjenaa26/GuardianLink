const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

// Import models
const Teacher = require('../models/TeacherSide/Teacher');
const Student = require('../models/Student');
const Admin = require('../models/Admin');

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

        const { email, password, role } = req.body;

        // Determine which model to use based on role
        let UserModel;
        switch (role.toLowerCase()) {
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
                return res.status(400).json({
                    success: false,
                    message: 'Invalid role specified'
                });
        }

        // Find user by email
        const user = await UserModel.findOne({ email: email.toLowerCase() });
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
            { id: user._id, role: role.toLowerCase() },
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
                ...(role.toLowerCase() === 'student' && {
                    class: user.class,
                    section: user.section,
                    admissionNumber: user.admissionNumber
                }),
                ...(role.toLowerCase() === 'admin' && {
                    permissions: user.permissions
                })
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred during login'
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
                ...(role.toLowerCase() === 'student' && {
                    class: user.class,
                    section: user.section,
                    admissionNumber: user.admissionNumber
                }),
                ...(role.toLowerCase() === 'admin' && {
                    permissions: user.permissions
                })
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred during registration'
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

exports.login = async (req, res) => {
    try {
        console.log('\n=== Login Request ===');
        console.log('Headers:', req.headers);
        console.log('URL:', req.originalUrl);
        console.log('Body:', {
            email: req.body.email,
            role: req.body.role,
            hasPassword: !!req.body.password
        });

        // Ensure request body is properly parsed
        if (!req.is('application/json')) {
            return res.status(400).json({
                success: false,
                message: 'Content-Type must be application/json'
            });
        }
        
        const { email, password, role } = req.body;
        
        console.log('Processing login for:', { email, role });
        
        if (!email || !password || !role) {
            console.log('❌ Validation failed - missing fields');
            return res.status(400).json({ 
                success: false,
                message: 'All fields are required',
                details: {
                    email: !email ? 'Email is required' : undefined,
                    password: !password ? 'Password is required' : undefined,
                    role: !role ? 'Role is required' : undefined
                }
            });
        }

        // Validate input
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log('❌ Validation errors:', errors.array());
            return res.status(400).json({ errors: errors.array() });
        }

    let user;
    let Model;
    let payloadRole;
    
    console.log('🔍 Looking up user:', { email, role });
        // Find user based on role
        const normalizedRole = role.toLowerCase();
        switch (normalizedRole) {
            case 'teacher':
                Model = Teacher;
                break;
            case 'student':
                Model = Student;
                break;
            case 'admin':
                Model = Admin;
                break;
            default:
                console.log('❌ Invalid role:', role);
                return res.status(400).json({ 
                    success: false,
                    message: 'Invalid role specified',
                    validRoles: ['teacher', 'student', 'admin']
                });
        }
        
    // Normalize email for search
    const normalizedEmail = email.toLowerCase().trim();
    
    // First try exact email match
    user = await Model.findOne({ email: normalizedEmail });
    console.log('DB lookup:', { 
        role,
        email: normalizedEmail,
        collection: Model.collection.name,
        found: !!user
    });

        // If still not found, attempt other role collections
        if (!user) {
            console.log('Trying fallback role lookup...');
            const fallbackModels = [Teacher, Student, Admin];
            for (const FModel of fallbackModels) {
                // Try both exact and case-insensitive
                const candidate = await FModel.findOne({
                    $or: [
                        { email: email },
                        { email: { $regex: new RegExp('^' + email + '$', 'i') }}
                    ]
                });
                if (candidate) {
                    user = candidate;
                    // detect role from model
                    if (FModel === Teacher) payloadRole = 'teacher';
                    else if (FModel === Student) payloadRole = 'student';
                    else if (FModel === Admin) payloadRole = 'admin';
                    console.log('Fallback found user in model, assigned role:', payloadRole);
                    break;
                }
            }
        }

        if (!user) {
            console.log('❌ User not found');
            return res.status(401).json({ 
                success: false,
                message: 'Invalid email or password'
            });
        }

        console.log('✅ Found user:', { 
            id: user._id,
            email: user.email,
            role: user.role || role
        });
        
        // Verify password
        try {
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                console.log('❌ Password verification failed');
                return res.status(401).json({ 
                    success: false,
                    message: 'Invalid email or password'
                });
            }
            console.log('✅ Password verified successfully');
        } catch (bcryptError) {
            console.error('⚠️ Bcrypt error:', bcryptError);
            return res.status(500).json({
                success: false,
                message: 'Error verifying credentials'
            });
        }

        // Create JWT payload
        const payload = {
            id: user._id.toString(),
            email: user.email,
            role: typeof payloadRole !== 'undefined' ? payloadRole : role,
            name: user.name
        };

        // Log the payload we're about to sign
        console.log('🔑 Creating token with payload:', { ...payload, id: '[REDACTED]' });

        // Sign JWT
        try {
            const token = await new Promise((resolve, reject) => {
                jwt.sign(
                    payload,
                    process.env.JWT_SECRET,
                    { expiresIn: '24h' },
                    (err, token) => {
                        if (err) reject(err);
                        else resolve(token);
                    }
                );
            });

            // Send successful response
            const response = {
                success: true,
                message: 'Login successful',
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: payload.role
                }
            };

            console.log('✅ Login successful for:', user.email);
            res.json(response);
        } catch (tokenError) {
            console.error('⚠️ Token creation failed:', tokenError);
            res.status(500).json({
                success: false,
                message: 'Error creating authentication token'
            });
        }

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
        } catch (error) {
            console.error('❌ Auth error:', error);
            if (error.name === 'ValidationError') {
                return res.status(400).json({
                    message: 'Validation failed',
                    errors: Object.values(error.errors).map(err => ({
                        field: err.path,
                        message: err.message
                    }))
                });
            }
            throw error;
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
                if (err) {
                    console.error('JWT signing error:', err);
                    throw err;
                }
                
                const response = {
                    success: true,
                    token,
                    user: {
                        id: user._id,
                        name: user.name,
                        email: user.email,
                        role: role
                    }
                };
                
                console.log('Sending successful response:', response);
                res.status(200).json(response);
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