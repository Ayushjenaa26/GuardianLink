const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    // Teacher Reference
    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher',
        required: true
    },
    
    // Personal Information
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    studentId: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    gender: {
        type: String,
        required: true,
        enum: ['male', 'female', 'other']
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },

    // Academic Information
    batch: {
        type: String,
        required: true
    },
    semester: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    enrollmentDate: {
        type: Date,
        required: true
    },

    // Contact Information
    parentName: {
        type: String,
        required: true
    },
    parentEmail: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    parentPhone: {
        type: String,
        required: true
    },
    emergencyContact: {
        type: String,
        required: true
    },

    // Academic Performance
    previousGrades: {
        type: String
    },
    attendance: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    behaviorScore: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    specialNeeds: {
        type: String
    },

    // Additional Information
    hobbies: {
        type: String
    },
    strengths: {
        type: String
    },
    improvements: {
        type: String
    },
    notes: {
        type: String
    },

    // Profile Image
    profileImage: {
        type: String
    },

    // Reference to Teacher
    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher',
        required: true
    },

    // Timestamps
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update timestamp on save
studentSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('TeacherStudent', studentSchema);
