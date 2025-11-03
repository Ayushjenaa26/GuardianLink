const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const teacherAuth = require('../../middleware/TeacherSide/auth');

// Import controllers
const attendanceController = require('../../controllers/TeacherSide/AttendanceController');
const behaviorController = require('../../controllers/TeacherSide/behaviorController');
const marksController = require('../../controllers/TeacherSide/MarksController');

// Attendance routes
router.post('/attendance', [
  teacherAuth,
  [
    check('studentId', 'Student ID is required').not().isEmpty(),
    check('status', 'Status must be present, absent, or late').isIn(['present', 'absent', 'late']),
    check('class', 'Class is required').not().isEmpty()
  ]
], attendanceController.markAttendance);

router.get('/attendance', teacherAuth, attendanceController.getClassAttendance);
router.put('/attendance/:attendanceId', teacherAuth, attendanceController.updateAttendance);
router.get('/attendance/stats', teacherAuth, attendanceController.getAttendanceStats);

// Behavior report routes
router.post('/behavior', [
  teacherAuth,
  [
    check('studentId', 'Student ID is required').not().isEmpty(),
    check('behavior', 'Valid behavior status is required').isIn(['excellent', 'good', 'satisfactory', 'needs_improvement', 'poor']),
    check('category', 'Valid category is required').isIn(['discipline', 'classroom_participation', 'homework', 'social_interaction', 'other']),
    check('description', 'Description is required').not().isEmpty()
  ]
], behaviorController.createBehaviorReport);

router.get('/behavior/student/:studentId', teacherAuth, behaviorController.getStudentBehaviorReports);
router.put('/behavior/:reportId', teacherAuth, behaviorController.updateBehaviorReport);
router.delete('/behavior/:reportId', teacherAuth, behaviorController.deleteBehaviorReport);
router.get('/behavior/stats', teacherAuth, behaviorController.getBehaviorStats);

// Marks routes
router.post('/marks', [
  teacherAuth,
  [
    check('studentId', 'Student ID is required').not().isEmpty(),
    check('subject', 'Subject is required').not().isEmpty(),
    check('examType', 'Valid exam type is required').isIn(['unit_test', 'mid_term', 'final', 'assignment', 'project']),
    check('marksObtained', 'Marks obtained must be a number').isNumeric(),
    check('totalMarks', 'Total marks must be a number').isNumeric(),
    check('semester', 'Semester is required').not().isEmpty()
  ]
], marksController.addMarks);

router.get('/marks/student/:studentId', teacherAuth, marksController.getStudentMarks);
router.put('/marks/:marksId', teacherAuth, marksController.updateMarks);
router.delete('/marks/:marksId', teacherAuth, marksController.deleteMarks);
router.get('/marks/stats', teacherAuth, marksController.getClassStats);

module.exports = router;
