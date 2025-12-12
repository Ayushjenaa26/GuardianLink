const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

// Import models
const Teacher = require('../models/TeacherSide/Teacher');
const Student = require('../models/Student');
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

        const { email, password, role } = req.body;

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

        // Validate studentRollNo for parent registration
        if (role.toLowerCase() === 'parent') {
            if (!additionalFields.studentRollNo) {
                return res.status(400).json({
                    success: false,
                    message: 'Student Roll Number is required'
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
            console.log('🔑 Verifying password for user:', user.email);
            console.log('🔑 Password hash exists:', !!user.password);
            console.log('🔑 Password provided:', !!password);
            
            const isMatch = await bcrypt.compare(password, user.password);
            
            console.log('🔑 Password match result:', isMatch);
            console.log('🔑 User object type:', user.constructor.name);
            console.log('🔑 User password type:', typeof user.password);
            console.log('🔑 Password provided type:', typeof password);
            
            if (!isMatch) {
                console.log('❌ Password verification failed for:', user.email);
                console.log('   Stored hash starts with:', user.password?.substring(0, 10));
                console.log('   Provided password:', password?.substring(0, 5) + '...');
                return res.status(401).json({ 
                    success: false,
                    message: 'Invalid email or password'
                });
            }
            console.log('✅ Password verified successfully');
        } catch (bcryptError) {
            console.error('⚠️ Bcrypt error:', bcryptError);
            console.error('⚠️ User password:', user.password);
            console.error('⚠️ Is bcrypt hash:', user.password?.startsWith('$2'));
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