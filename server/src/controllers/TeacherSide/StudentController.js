const Student = require('../../models/Student');
const Teacher = require('../../models/TeacherSide/Teacher');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

// Add a new student
exports.createStudent = async (req, res) => {
    try {
        console.log('Received student creation request:', req.body);
        
        // Validate request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Get teacher ID from auth middleware
        const teacherId = req.user.id;

        // Extract student data from request body
        const {
            name,
            email,
            password,
            class: studentClass,
            section,
            admissionNumber,
            parentName,
            parentPhone,
            healthInfo
        } = req.body;

        // Check if student already exists
        const existingStudent = await Student.findOne({
            $or: [
                { email: email.toLowerCase() },
                { admissionNumber }
            ]
        });

        if (existingStudent) {
            return res.status(400).json({
                message: existingStudent.email === email.toLowerCase() 
                    ? 'Student with this email already exists'
                    : 'Student with this admission number already exists'
            });
        }

        // Create new student
        const student = new Student({
            name,
            email: email.toLowerCase(),
            password, // Password will be hashed by the pre-save hook
            class: studentClass,
            section,
            admissionNumber,
            parentName,
            parentPhone,
            healthInfo,
            createdBy: teacherId
        });

        // Save the student to database
        await student.save();

        // Remove password from response
        const studentResponse = student.toObject();
        delete studentResponse.password;

        // Send success response
        res.status(201).json({
            message: 'Student created successfully',
            student: studentResponse
        });

    } catch (error) {
        console.error('Error creating student:', error);
        res.status(500).json({ 
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