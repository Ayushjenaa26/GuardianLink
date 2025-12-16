const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminTeacherSchema = new mongoose.Schema({
  teacherName: {
    type: String,
    required: [true, 'Teacher name is required'],
    trim: true
  },
  employeeId: {
    type: String,
    required: [true, 'Employee ID is required'],
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    default: function() {
      // Default password is employee ID
      return this.employeeId;
    }
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true
  },
  branches: {
    type: String,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  department: {
    type: String,
    trim: true
  },
  experience: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'On Leave', 'Resigned'],
    default: 'Active'
  },
  // Assigned branches and subjects by admin
  assignedBranches: [{
    type: String,
    trim: true
  }],
  assignedSubjects: [{
    type: String,
    trim: true
  }],
  semester: {
    type: String,
    trim: true
  },
  lastAssignedAt: {
    type: Date
  },
  assignedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Hash password before saving
adminTeacherSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to check password
adminTeacherSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Index for faster queries
adminTeacherSchema.index({ employeeId: 1 });
adminTeacherSchema.index({ email: 1 });
adminTeacherSchema.index({ department: 1 });

module.exports = mongoose.model('AdminTeacher', adminTeacherSchema);
