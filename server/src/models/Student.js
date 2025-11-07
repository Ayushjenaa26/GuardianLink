const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
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
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long']
    },
    role: {
        type: String,
        default: 'student',
        enum: ['student']
    },
    class: {
        type: String,
        required: [true, 'Class is required']
    },
    section: {
        type: String,
        required: [true, 'Section is required']
    },
    admissionNumber: {
        type: String,
        required: [true, 'Admission number is required'],
        unique: true
    },
    parentName: {
        type: String,
        required: [true, 'Parent name is required'],
        trim: true
    },
    parentPhone: {
        type: String,
        required: [true, 'Parent phone number is required'],
        trim: true
    },
    healthInfo: {
        type: String,
        trim: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher',
        required: true
    }
}, {
    timestamps: true
});

// Hash password before saving
studentSchema.pre('save', async function(next) {
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
studentSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Student', studentSchema);