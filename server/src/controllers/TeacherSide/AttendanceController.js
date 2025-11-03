const Attendance = require('../../models/TeacherSide/Attendance');
const { validationResult } = require('express-validator');

// Mark attendance for a student
exports.markAttendance = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { studentId, status, remarks } = req.body;
    const teacherId = req.user.id; // From auth middleware

    const attendance = new Attendance({
      student: studentId,
      status,
      remarks,
      markedBy: teacherId,
      class: req.body.class
    });

    await attendance.save();
    res.status(201).json({ success: true, data: attendance });
  } catch (error) {
    if (error.code === 11000) { // Duplicate attendance entry
      return res.status(400).json({
        success: false,
        message: 'Attendance already marked for this student today'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error marking attendance',
      error: error.message
    });
  }
};

// Get attendance for a class
exports.getClassAttendance = async (req, res) => {
  try {
    const { date, class: className } = req.query;
    const teacherId = req.user.id;

    const query = { 
      markedBy: teacherId,
      class: className
    };

    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0,0,0,0);
      const endDate = new Date(date);
      endDate.setHours(23,59,59,999);
      query.date = { $gte: startDate, $lte: endDate };
    }

    const attendance = await Attendance.find(query)
      .populate('student', 'name rollNumber')
      .sort({ date: -1 });

    res.json({ success: true, data: attendance });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching attendance',
      error: error.message
    });
  }
};

// Update attendance
exports.updateAttendance = async (req, res) => {
  try {
    const { attendanceId } = req.params;
    const { status, remarks } = req.body;
    const teacherId = req.user.id;

    const attendance = await Attendance.findOneAndUpdate(
      { _id: attendanceId, markedBy: teacherId },
      { status, remarks },
      { new: true }
    );

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: 'Attendance record not found or unauthorized'
      });
    }

    res.json({ success: true, data: attendance });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating attendance',
      error: error.message
    });
  }
};

// Get attendance statistics
exports.getAttendanceStats = async (req, res) => {
  try {
    const { startDate, endDate, class: className } = req.query;
    const teacherId = req.user.id;

    const query = {
      markedBy: teacherId,
      class: className
    };

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const stats = await Attendance.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching attendance statistics',
      error: error.message
    });
  }
};
