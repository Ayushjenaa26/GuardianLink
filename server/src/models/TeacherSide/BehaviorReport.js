const mongoose = require('mongoose');

const behaviorReportSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  behavior: {
    type: String,
    enum: ['excellent', 'good', 'satisfactory', 'needs_improvement', 'poor'],
    required: true
  },
  category: {
    type: String,
    enum: ['discipline', 'classroom_participation', 'homework', 'social_interaction', 'other'],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  actionTaken: String,
  recommendations: String
});

module.exports = mongoose.model('BehaviorReport', behaviorReportSchema);
