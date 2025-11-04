const mongoose = require('mongoose');

const gradeSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  class: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  term: {
    type: String,
    enum: ['First Term', 'Mid Term', 'Final Term'],
    required: true
  },
  marks: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  grade: {
    type: String,
    required: true,
    enum: ['A+', 'A', 'B+', 'B', 'C+', 'C', 'D', 'F']
  },
  remarks: String,
  issuedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true
  },
  issuedDate: {
    type: Date,
    default: Date.now
  }
});

// Create index for faster queries
gradeSchema.index({ student: 1, subject: 1, term: 1 });

module.exports = mongoose.model('Grade', gradeSchema);
