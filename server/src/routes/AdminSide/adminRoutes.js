const express = require('express');
const router = express.Router();
const adminController = require('../../controllers/AdminSide/adminController');
const roleRequestController = require('../../controllers/AdminSide/roleRequestController');
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

// Assign roles/classes to teachers
router.put('/teachers/:id/assign', protect, adminOnly, adminController.assignToTeacher);
router.get('/classes', protect, adminOnly, adminController.getAvailableClasses);
router.get('/subjects', protect, adminOnly, adminController.getAvailableSubjects);

// Role request routes (admin side)
router.get('/role-requests', protect, adminOnly, roleRequestController.getAllRoleRequests);
router.put('/role-requests/:id/approve', protect, adminOnly, roleRequestController.approveRoleRequest);
router.put('/role-requests/:id/reject', protect, adminOnly, roleRequestController.rejectRoleRequest);
router.delete('/role-requests/:id', protect, adminOnly, roleRequestController.deleteRoleRequest);

module.exports = router;
