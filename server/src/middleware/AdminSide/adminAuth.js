const jwt = require('jsonwebtoken');
const Admin = require('../../models/Admin');

// Protect routes - verify token
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token (could be admin, teacher, or from general auth)
      req.user = decoded;
      console.log('🔐 Token verified for user:', decoded.email, 'Role:', decoded.role);

      next();
    } catch (error) {
      console.error('⚠️ Auth error:', error.message);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    console.log('⚠️ No token provided');
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Admin only middleware
const adminOnly = async (req, res, next) => {
  try {
    // Check if user exists and has role
    if (!req.user) {
      console.log('❌ No user in request');
      return res.status(401).json({ message: 'Not authenticated' });
    }

    console.log('🔐 Auth check - User role:', req.user.role, 'Required: admin');
    
    // Check if user role is admin (case-insensitive)
    if (req.user.role && req.user.role.toLowerCase() === 'admin') {
      console.log('✅ Admin access granted for:', req.user.email);
      next();
    } else {
      console.log('❌ Access denied. User role:', req.user.role);
      res.status(403).json({ message: 'Access denied. Admin access required.' });
    }
  } catch (error) {
    console.error('Admin auth error:', error);
    res.status(500).json({ message: 'Server error during authorization' });
  }
};

module.exports = { protect, adminOnly };
