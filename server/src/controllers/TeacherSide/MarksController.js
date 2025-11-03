const Marks = require('../../models/TeacherSide/Marks');
const { validationResult } = require('express-validator');

// Add marks for a student
exports.addMarks = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { studentId, subject, examType, marksObtained, totalMarks, remarks, semester } = req.body;
    const teacherId = req.user.id;

    const marks = new Marks({
      student: studentId,
      subject,
      examType,
      marksObtained,
      totalMarks,
      remarks,
      teacher: teacherId,
      semester
    });

    await marks.save();
    res.status(201).json({ success: true, data: marks });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding marks',
      error: error.message
    });
  }
};

// Get marks for a student
exports.getStudentMarks = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { subject, examType, semester } = req.query;
    const teacherId = req.user.id;

    const query = {
      student: studentId,
      teacher: teacherId
    };

    if (subject) query.subject = subject;
    if (examType) query.examType = examType;
    if (semester) query.semester = semester;

    const marks = await Marks.find(query)
      .populate('student', 'name rollNumber')
      .sort({ date: -1 });

    res.json({ success: true, data: marks });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching marks',
      error: error.message
    });
  }
};

// Update marks
exports.updateMarks = async (req, res) => {
  try {
    const { marksId } = req.params;
    const teacherId = req.user.id;
    const updateData = req.body;

    const marks = await Marks.findOneAndUpdate(
      { _id: marksId, teacher: teacherId },
      updateData,
      { new: true }
    );

    if (!marks) {
      return res.status(404).json({
        success: false,
        message: 'Marks record not found or unauthorized'
      });
    }

    res.json({ success: true, data: marks });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating marks',
      error: error.message
    });
  }
};

// Delete marks
exports.deleteMarks = async (req, res) => {
  try {
    const { marksId } = req.params;
    const teacherId = req.user.id;

    const marks = await Marks.findOneAndDelete({
      _id: marksId,
      teacher: teacherId
    });

    if (!marks) {
      return res.status(404).json({
        success: false,
        message: 'Marks record not found or unauthorized'
      });
    }

    res.json({
      success: true,
      message: 'Marks deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting marks',
      error: error.message
    });
  }
};

// Get class performance statistics
exports.getClassStats = async (req, res) => {
  try {
    const { subject, examType, semester } = req.query;
    const teacherId = req.user.id;

    const query = { teacher: teacherId };
    if (subject) query.subject = subject;
    if (examType) query.examType = examType;
    if (semester) query.semester = semester;

    const stats = await Marks.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          avgMarks: { $avg: '$marksObtained' },
          maxMarks: { $max: '$marksObtained' },
          minMarks: { $min: '$marksObtained' },
          totalStudents: { $sum: 1 },
          passCount: {
            $sum: {
              $cond: [
                { $gte: [{ $divide: ['$marksObtained', '$totalMarks'] }, 0.4] },
                1,
                0
              ]
            }
          }
        }
      }
    ]);

    res.json({ success: true, data: stats[0] });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching class statistics',
      error: error.message
    });
  }
};
