const mongoose = require('mongoose');

const roleRequestSchema = new mongoose.Schema({
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AdminTeacher',
    required: true
  },
  teacherName: {
    type: String,
    required: true
  },
  teacherEmail: {
    type: String,
    required: true
  },
  employeeId: {
    type: String,
    required: true
  },
  department: {
    type: String,
    enum: ['CSE', 'ECE', 'EEE', 'ME', 'CE', 'ChE'],
    required: true
  },
  requestedBranches: [{
    type: String,
    trim: true
  }],
  requestedSubjects: [{
    type: String,
    trim: true
  }],
  requestMessage: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  adminResponse: {
    type: String,
    trim: true
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },
  reviewedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for faster queries
roleRequestSchema.index({ teacher: 1, status: 1 });
roleRequestSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('RoleRequest', roleRequestSchema);
