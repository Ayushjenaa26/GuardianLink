const Student = require('../../models/TeacherSide/Student');
const BehaviorReport = require('../../models/TeacherSide/BehaviorReport');
const Attendance = require('../../models/TeacherSide/Attendance');

exports.getDashboardData = async (req, res) => {
    try {
        // Get teacher ID from auth middleware
        const teacherId = req.user.id;

        // Get total students count
        const totalStudents = await Student.countDocuments({ teacherId });

        // Get unique classes/batches count
        const uniqueClasses = await Student.distinct('batch', { teacherId });
        const totalClasses = uniqueClasses.length;

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
        const nextClass = uniqueClasses[0] || 'No classes scheduled';
        const nextClassTime = '10:00 AM';

        res.json({
            totalStudents,
            totalClasses,
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
