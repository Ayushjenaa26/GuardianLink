const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middleware/TeacherSide/auth');
const studentController = require('../../controllers/TeacherSide/StudentController');
const dashboardController = require('../../controllers/TeacherSide/dashboardController');
const { check } = require('express-validator');
const Student = require('../../models/Student');

// Dashboard Route
router.get('/dashboard', authMiddleware, dashboardController.getDashboardData);

// Student Management Routes
router.post('/students', [
    authMiddleware,
    [
        check('name', 'Name is required').notEmpty(),
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password must be at least 6 characters long').isLength({ min: 6 }),
        check('class', 'Class is required').notEmpty(),
        check('section', 'Section is required').notEmpty(),
        check('admissionNumber', 'Admission number is required').notEmpty(),
        check('parentName', 'Parent name is required').notEmpty(),
        check('parentPhone', 'Parent phone number is required').notEmpty()
    ]
], studentController.createStudent);
router.get('/students', authMiddleware, async (req, res) => {
    try {
        const students = await Student.find({}).sort({ createdAt: -1 }).limit(req.query.limit ? parseInt(req.query.limit) : 10);
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
router.get('/students/:id', authMiddleware, async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.json(student);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
router.put('/students/:id', authMiddleware, async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.json(student);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
router.delete('/students/:id', authMiddleware, async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.json({ message: 'Student deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
// Import controllers
const attendanceController = require('../../controllers/TeacherSide/AttendanceController');
const behaviorController = require('../../controllers/TeacherSide/behaviorController');
const marksController = require('../../controllers/TeacherSide/MarksController');

// Attendance routes
router.post('/attendance', [
  authMiddleware,
  [
    check('studentId', 'Student ID is required').not().isEmpty(),
    check('status', 'Status must be present, absent, or late').isIn(['present', 'absent', 'late']),
    check('class', 'Class is required').not().isEmpty()
  ]
], attendanceController.markAttendance);

router.get('/attendance', authMiddleware, attendanceController.getClassAttendance);
router.put('/attendance/:attendanceId', authMiddleware, attendanceController.updateAttendance);
router.get('/attendance/stats', authMiddleware, attendanceController.getAttendanceStats);

// Behavior report routes
router.post('/behavior', [
  authMiddleware,
  [
    check('studentId', 'Student ID is required').not().isEmpty(),
    check('behavior', 'Valid behavior status is required').isIn(['excellent', 'good', 'satisfactory', 'needs_improvement', 'poor']),
    check('category', 'Valid category is required').isIn(['discipline', 'classroom_participation', 'homework', 'social_interaction', 'other']),
    check('description', 'Description is required').not().isEmpty()
  ]
], behaviorController.createBehaviorReport);

router.get('/behavior/student/:studentId', authMiddleware, behaviorController.getStudentBehaviorReports);
router.put('/behavior/:reportId', authMiddleware, behaviorController.updateBehaviorReport);
router.delete('/behavior/:reportId', authMiddleware, behaviorController.deleteBehaviorReport);
router.get('/behavior/stats', authMiddleware, behaviorController.getBehaviorStats);

// Marks routes
router.post('/marks', [
  authMiddleware,
  [
    check('studentId', 'Student ID is required').not().isEmpty(),
    check('subject', 'Subject is required').not().isEmpty(),
    check('examType', 'Valid exam type is required').isIn(['unit_test', 'mid_term', 'final', 'assignment', 'project']),
    check('marksObtained', 'Marks obtained must be a number').isNumeric(),
    check('totalMarks', 'Total marks must be a number').isNumeric(),
    check('semester', 'Semester is required').not().isEmpty()
  ]
], marksController.addMarks);

router.get('/marks/student/:studentId', authMiddleware, marksController.getStudentMarks);
router.put('/marks/:marksId', authMiddleware, marksController.updateMarks);
router.delete('/marks/:marksId', authMiddleware, marksController.deleteMarks);
router.get('/marks/stats', authMiddleware, marksController.getClassStats);

module.exports = router;
