const AdminStudent = require('../../models/AdminSide/AdminStudent');
const AdminTeacher = require('../../models/AdminSide/AdminTeacher');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

// Add a new student
exports.createStudent = async (req, res) => {
    try {
        console.log('📝 Received student creation request');
        console.log('📝 Request body:', req.body);
        console.log('📝 Authenticated user:', req.user);
        
        // Validate request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log('❌ Validation errors:', errors.array());
            return res.status(400).json({ 
                success: false,
                message: 'Validation failed',
                errors: errors.array() 
            });
        }

        // Get teacher ID from auth middleware
        const teacherId = req.user.id;
        console.log('👨‍🏫 Teacher ID:', teacherId);

        // Extract student data from request body
        const {
            name,
            email,
            password,
            branch,
            section,
            admissionNumber,
            parentName,
            parentPhone,
            healthInfo
        } = req.body;

        // Check if student already exists
        const existingStudent = await AdminStudent.findOne({
            $or: [
                { email: email.toLowerCase() },
                { rollNo: admissionNumber }
            ]
        });

        if (existingStudent) {
            console.log('❌ Student already exists');
            return res.status(400).json({
                success: false,
                message: existingStudent.email === email.toLowerCase() 
                    ? 'Student with this email already exists'
                    : 'Student with this admission number already exists'
            });
        }

        console.log('✅ Creating new student...');
        
        // Create new student
        const student = new AdminStudent({
            studentName: name,
            email: email.toLowerCase(),
            password, // Password will be hashed by the pre-save hook
            branch,
            // section, // Not in AdminStudent schema
            rollNo: admissionNumber,
            // parentName, // Not in AdminStudent schema
            // parentPhone, // Not in AdminStudent schema
            // healthInfo, // Not in AdminStudent schema
            uploadedBy: teacherId,
            year: '1', // Default
            batch: new Date().getFullYear().toString() // Default
        });

        // Save the student to database
        console.log('💾 Saving student to database...');
        await student.save();
        console.log('✅ Student saved successfully!');

        // Remove password from response
        const studentResponse = student.toObject();
        delete studentResponse.password;

        // Send success response
        res.status(201).json({
            success: true,
            message: 'Student created successfully',
            student: studentResponse
        });

    } catch (error) {
        console.error('❌ Error creating student:', error);
        console.error('❌ Error stack:', error.stack);
        res.status(500).json({ 
            success: false,
            message: 'Error creating student',
            error: error.message
        });
    }
};

// Get all students
exports.getAllStudents = async (req, res) => {
    try {
        const students = await Student.find()
            .select('-password')
            .sort({ createdAt: -1 });
            
        res.json(students);
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({
            message: 'Error fetching students',
            error: error.message
        });
    }
};

// Get student by ID
exports.getStudentById = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id)
            .select('-password');
            
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        
        res.json(student);
    } catch (error) {
        console.error('Error fetching student:', error);
        res.status(500).json({
            message: 'Error fetching student',
            error: error.message
        });
    }
};

// Update student
exports.updateStudent = async (req, res) => {
    try {
        const updates = { ...req.body };
        delete updates.password; // Remove password from updates

        const student = await Student.findByIdAndUpdate(
            req.params.id,
            { $set: updates },
            { new: true, runValidators: true }
        ).select('-password');

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        res.json({
            message: 'Student updated successfully',
            student
        });
    } catch (error) {
        console.error('Error updating student:', error);
        res.status(500).json({ 
            message: 'Error updating student',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Delete student
exports.deleteStudent = async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        res.json({ message: 'Student deleted successfully' });
    } catch (error) {
        console.error('Error deleting student:', error);
        res.status(500).json({ 
            message: 'Error deleting student',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};