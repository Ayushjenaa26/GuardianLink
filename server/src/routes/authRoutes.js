const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

// @route   POST /api/auth/register
// @desc    Register a user (student/teacher/admin)
// @access  Public
router.post(
    '/register',
    [
        check('name', 'Name is required').not().isEmpty(),
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
        check('role', 'Role is required').isIn(['student', 'teacher', 'admin'])
    ],
    authController.register
);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post(
    '/login',
    [
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password is required').exists(),
        check('role', 'Role is required').isIn(['student', 'teacher', 'admin'])
    ],
    authController.login
);

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', auth, authController.getCurrentUser);

// @route   GET /api/auth/verify
// @desc    Verify token and return basic user info
// @access  Private
router.get('/verify', auth, (req, res) => {
    res.json({ success: true, user: req.user });
});

module.exports = router;