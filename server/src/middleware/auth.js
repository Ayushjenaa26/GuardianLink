const jwt = require('jsonwebtoken');
const Teacher = require('../models/TeacherSide/Teacher');
const Student = require('../models/Student');
const Admin = require('../models/Admin');

module.exports = async (req, res, next) => {
    try {
        // Get token from header
        const token = req.header('Authorization')?.replace('Bearer ', '');

        // Check if no token
        if (!token) {
            return res.status(401).json({ 
                success: false,
                message: 'Authentication required. Please login.' 
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Support tokens signed as either { user: { ... } } or flat { id, role, ... }
        const payload = decoded.user ? decoded.user : decoded;

        // Find user based on role
        let user;
        switch (payload.role) {
            case 'teacher':
                user = await Teacher.findById(payload.id);
                break;
            case 'student':
                user = await Student.findById(payload.id);
                break;
            case 'admin':
                user = await Admin.findById(payload.id);
                break;
            default:
                throw new Error('Invalid user role');
        }

        if (!user) {
            throw new Error('User not found');
        }

        // Add user info to request
        req.user = {
            id: user._id,
            role: payload.role,
            name: user.name,
            email: user.email
        };

        next();
    } catch (err) {
        res.status(401).json({
            success: false,
            message: 'Authentication failed',
            error: err.message
        });
    }
};