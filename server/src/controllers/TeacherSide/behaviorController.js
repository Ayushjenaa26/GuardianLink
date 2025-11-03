const BehaviorReport = require('../../models/TeacherSide/BehaviorReport');
const { validationResult } = require('express-validator');

// Create a new behavior report
exports.createBehaviorReport = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { studentId, behavior, category, description, actionTaken, recommendations } = req.body;
    const teacherId = req.user.id; // From auth middleware

    const report = new BehaviorReport({
      student: studentId,
      teacher: teacherId,
      behavior,
      category,
      description,
      actionTaken,
      recommendations
    });

    await report.save();
    res.status(201).json({ success: true, data: report });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating behavior report',
      error: error.message
    });
  }
};

// Get behavior reports for a student
exports.getStudentBehaviorReports = async (req, res) => {
  try {
    const { studentId } = req.params;
    const teacherId = req.user.id;

    const reports = await BehaviorReport.find({
      student: studentId,
      teacher: teacherId
    })
      .sort({ date: -1 })
      .populate('student', 'name rollNumber');

    res.json({ success: true, data: reports });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching behavior reports',
      error: error.message
    });
  }
};

// Update a behavior report
exports.updateBehaviorReport = async (req, res) => {
  try {
    const { reportId } = req.params;
    const teacherId = req.user.id;
    const updateData = req.body;

    const report = await BehaviorReport.findOneAndUpdate(
      { _id: reportId, teacher: teacherId },
      updateData,
      { new: true }
    );

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Behavior report not found or unauthorized'
      });
    }

    res.json({ success: true, data: report });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating behavior report',
      error: error.message
    });
  }
};

// Delete a behavior report
exports.deleteBehaviorReport = async (req, res) => {
  try {
    const { reportId } = req.params;
    const teacherId = req.user.id;

    const report = await BehaviorReport.findOneAndDelete({
      _id: reportId,
      teacher: teacherId
    });

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Behavior report not found or unauthorized'
      });
    }

    res.json({
      success: true,
      message: 'Behavior report deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting behavior report',
      error: error.message
    });
  }
};

// Get behavior statistics
exports.getBehaviorStats = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const { startDate, endDate } = req.query;

    const query = { teacher: teacherId };

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const stats = await BehaviorReport.aggregate([
      { $match: query },
      {
        $group: {
          _id: {
            behavior: '$behavior',
            category: '$category'
          },
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching behavior statistics',
      error: error.message
    });
  }
};
