const express = require('express');
const router = express.Router();
const adminController = require('../../controllers/AdminSide/adminController');
const { protect, adminOnly } = require('../../middleware/AdminSide/adminAuth');

// Upload routes - protected by admin authentication
router.post('/upload/students', protect, adminOnly, adminController.uploadStudents);
router.post('/upload/teachers', protect, adminOnly, adminController.uploadTeachers);

// Get all students and teachers
router.get('/students', protect, adminOnly, adminController.getAllStudents);
router.get('/teachers', protect, adminOnly, adminController.getAllTeachers);

// Delete student or teacher
router.delete('/students/:id', protect, adminOnly, adminController.deleteStudent);
router.delete('/teachers/:id', protect, adminOnly, adminController.deleteTeacher);

// Get upload statistics
router.get('/stats', protect, adminOnly, adminController.getStats);

module.exports = router;
