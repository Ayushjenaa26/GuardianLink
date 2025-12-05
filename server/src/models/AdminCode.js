const mongoose = require('mongoose');

const adminCodeSchema = new mongoose.Schema({
    code: {
        type: String,
        required: [true, 'Admin code is required'],
        unique: true,
        trim: true
    },
    isUsed: {
        type: Boolean,
        default: false
    },
    usedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        default: null
    },
    usedAt: {
        type: Date,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    expiresAt: {
        type: Date,
        default: null  // null means never expires
    },
    description: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

// Generate a unique admin code
adminCodeSchema.statics.generateCode = function() {
    const prefix = 'ADM';
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
};

// Check if a code is valid and unused
adminCodeSchema.statics.isValidCode = async function(code) {
    const adminCode = await this.findOne({ 
        code: code.trim().toUpperCase(),
        isUsed: false
    });
    
    if (!adminCode) return { valid: false, message: 'Invalid or already used Admin ID' };
    
    // Check expiration
    if (adminCode.expiresAt && new Date() > adminCode.expiresAt) {
        return { valid: false, message: 'Admin ID has expired' };
    }
    
    return { valid: true, adminCode };
};

// Mark code as used
adminCodeSchema.statics.markAsUsed = async function(code, adminUserId) {
    return await this.findOneAndUpdate(
        { code: code.trim().toUpperCase() },
        { 
            isUsed: true, 
            usedBy: adminUserId,
            usedAt: new Date()
        },
        { new: true }
    );
};

module.exports = mongoose.model('AdminCode', adminCodeSchema);
