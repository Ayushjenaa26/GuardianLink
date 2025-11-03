const jwt = require('jsonwebtoken');
const Teacher = require('../../models/TeacherSide/Teacher');

const teacherAuth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No authentication token provided'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find teacher
    const teacher = await Teacher.findOne({
      _id: decoded.id,
      isActive: true
    });

    if (!teacher) {
      return res.status(401).json({
        success: false,
        message: 'Teacher not found or inactive'
      });
    }

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
    res.status(401).json({
      success: false,
      message: 'Authentication failed',
      error: error.message
    });
  }
};

module.exports = teacherAuth;
