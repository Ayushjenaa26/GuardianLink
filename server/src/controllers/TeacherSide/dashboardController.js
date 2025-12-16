const AdminStudent = require('../../models/AdminSide/AdminStudent');
const AdminTeacher = require('../../models/AdminSide/AdminTeacher');
const BehaviorReport = require('../../models/TeacherSide/BehaviorReport');
const Attendance = require('../../models/TeacherSide/Attendance');

exports.getDashboardData = async (req, res) => {
    try {
        // Get teacher ID from auth middleware
        const teacherId = req.user.id;
        
        // Get teacher details to find branches
        const teacher = await AdminTeacher.findById(teacherId);
        const teacherBranches = teacher ? (Array.isArray(teacher.branches) ? teacher.branches : teacher.branches.split(',')) : [];

        // Get total students count (students in teacher's branches)
        const totalStudents = await AdminStudent.countDocuments({ branch: { $in: teacherBranches } });

        // Get unique branches count
        const totalBranches = teacherBranches.length;

        // Calculate average attendance
        const attendanceData = await Attendance.aggregate([
            { $match: { teacherId } },
            { $group: {
                _id: null,
                averageAttendance: { $avg: '$percentage' }
            }}
        ]);
        const averageAttendance = Math.round(attendanceData[0]?.averageAttendance || 0);

        // Get pending behavior reports count
        const pendingReviews = await BehaviorReport.countDocuments({
            teacherId,
            status: 'pending'
        });

        // Get next scheduled class (you'll need to implement your schedule model)
        // For now returning placeholder data
        const nextClass = teacherBranches[0] || 'No sessions scheduled';
        const nextClassTime = '10:00 AM';

        res.json({
            totalStudents,
            totalBranches,
            pendingReviews,
            averageAttendance,
            nextClass,
            nextClassTime
        });
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).json({ 
            message: 'Error fetching dashboard data',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};
