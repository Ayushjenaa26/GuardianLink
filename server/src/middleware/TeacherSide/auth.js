const jwt = require('jsonwebtoken');
const AdminTeacher = require('../../models/AdminSide/AdminTeacher');

const teacherAuth = async (req, res, next) => {
  try {
    console.log('🔐 Teacher Auth Middleware - Headers:', req.headers.authorization);
    
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      console.log('❌ No token provided');
      return res.status(401).json({
        success: false,
        message: 'No authentication token provided'
      });
    }
    
    console.log('🔑 Token found:', token.substring(0, 20) + '...');

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Token decoded:', decoded);

    // Find teacher
    const teacher = await AdminTeacher.findOne({
      _id: decoded.id,
      status: 'Active'
    });

    if (!teacher) {
      console.log('❌ Teacher not found or inactive');
      return res.status(401).json({
        success: false,
        message: 'Teacher not found or inactive'
      });
    }

    console.log('✅ Teacher authenticated:', teacher.name);

    // Add teacher info to request
    req.user = {
      id: teacher._id,
      name: teacher.name,
      email: teacher.email,
      subject: teacher.subject,
      classes: teacher.classes
    };

    next();
  } catch (error) {
    console.error('❌ Auth error:', error.message);
    res.status(401).json({
      success: false,
      message: 'Authentication failed',
      error: error.message
    });
  }
};

module.exports = teacherAuth;
