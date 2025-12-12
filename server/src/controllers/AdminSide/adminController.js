const AdminStudent = require('../../models/AdminSide/AdminStudent');
const AdminTeacher = require('../../models/AdminSide/AdminTeacher');

// Upload Students from Excel
exports.uploadStudents = async (req, res) => {
  try {
    console.log('📥 Upload students request received');
    console.log('👤 User:', req.user?.email, 'Role:', req.user?.role);
    
    const { data } = req.body;

    if (!data || !Array.isArray(data) || data.length === 0) {
      console.log('❌ No data provided');
      return res.status(400).json({ 
        message: 'No data provided. Please upload a valid Excel file.' 
      });
    }

    // Limit to 500 records per upload
    if (data.length > 500) {
      return res.status(400).json({ 
        message: 'Maximum 500 records allowed per upload. Please split your file.' 
      });
    }

    console.log(`📤 Processing ${data.length} student records...`);

    const results = {
      inserted: 0,
      skipped: 0,
      errors: []
    };

    for (const record of data) {
      try {
        // Map Excel columns to database fields (case-insensitive)
        const studentData = {
          studentName: record['Student Name'] || record['studentName'] || record['STUDENT NAME'] || '',
          rollNo: record['Roll No'] || record['rollNo'] || record['Roll Number'] || record['ROLL NO'] || '',
          email: record['Email'] || record['email'] || record['EMAIL'] || '',
          class: record['Class'] || record['class'] || record['CLASS'] || '',
          year: record['Year'] || record['year'] || record['YEAR'] || '',
          batch: record['Batch'] || record['batch'] || record['BATCH'] || '',
          attendance: parseFloat(record['Attendance'] || record['attendance'] || record['ATTENDANCE']) || 0,
          gpa: parseFloat(record['GPA'] || record['gpa'] || record['Gpa']) || 0,
          status: record['Status'] || record['status'] || record['STATUS'] || 'Active',
          uploadedBy: req.user?.id
        };

        console.log('📝 Student record:', { rollNo: studentData.rollNo, name: studentData.studentName });

        // Validate required fields
        if (!studentData.studentName || !studentData.rollNo || !studentData.email) {
          results.errors.push({
            record: studentData.rollNo || 'Unknown',
            error: 'Missing required fields (Name, Roll No, or Email)'
          });
          results.skipped++;
          continue;
        }

        // Check for existing student by roll number or email
        const existingStudent = await AdminStudent.findOne({
          $or: [
            { rollNo: studentData.rollNo },
            { email: studentData.email.toLowerCase() }
          ]
        });

        if (existingStudent) {
          results.errors.push({
            record: studentData.rollNo,
            error: 'Student with this Roll No or Email already exists'
          });
          results.skipped++;
          continue;
        }

        // Set default password to roll number
        studentData.password = studentData.rollNo;

        // Create new student
        const createdStudent = await AdminStudent.create(studentData);
        console.log('✅ Student created:', createdStudent._id);
        results.inserted++;

      } catch (error) {
        console.error('Error inserting student:', error);
        results.errors.push({
          record: record['Roll No'] || 'Unknown',
          error: error.message
        });
        results.skipped++;
      }
    }

    console.log(`✅ Upload complete: ${results.inserted} inserted, ${results.skipped} skipped`);

    res.status(200).json({
      message: `Successfully uploaded ${results.inserted} students`,
      inserted: results.inserted,
      skipped: results.skipped,
      errors: results.errors.slice(0, 10) // Return first 10 errors only
    });

  } catch (error) {
    console.error('❌ Upload students error:', error);
    res.status(500).json({ 
      message: 'Server error during upload',
      error: error.message 
    });
  }
};

// Upload Teachers from Excel
exports.uploadTeachers = async (req, res) => {
  try {
    console.log('📥 Upload teachers request received');
    console.log('👤 User:', req.user?.email, 'Role:', req.user?.role);
    
    const { data } = req.body;

    if (!data || !Array.isArray(data) || data.length === 0) {
      console.log('❌ No data provided');
      return res.status(400).json({ 
        message: 'No data provided. Please upload a valid Excel file.' 
      });
    }

    // Limit to 500 records per upload
    if (data.length > 500) {
      return res.status(400).json({ 
        message: 'Maximum 500 records allowed per upload. Please split your file.' 
      });
    }

    console.log(`📤 Processing ${data.length} teacher records...`);

    const results = {
      inserted: 0,
      skipped: 0,
      errors: []
    };

    for (const record of data) {
      try {
        // Map Excel columns to database fields (case-insensitive)
        const teacherData = {
          teacherName: record['Teacher Name'] || record['teacherName'] || record['Name'] || record['TEACHER NAME'] || '',
          employeeId: record['Employee ID'] || record['employeeId'] || record['Employee Id'] || record['EMPLOYEE ID'] || '',
          email: record['Email'] || record['email'] || record['EMAIL'] || '',
          subject: record['Subject'] || record['subject'] || record['SUBJECT'] || '',
          phone: record['Phone'] || record['phone'] || record['PHONE'] || '',
          department: record['Department'] || record['department'] || record['DEPARTMENT'] || '',
          experience: record['Experience'] || record['experience'] || record['EXPERIENCE'] || '',
          status: record['Status'] || record['status'] || record['STATUS'] || 'Active',
          uploadedBy: req.user?.id
        };

        console.log('📝 Processing teacher record:', { 
          employeeId: teacherData.employeeId, 
          name: teacherData.teacherName,
          email: teacherData.email,
          subject: teacherData.subject
        });

        // Validate required fields
        if (!teacherData.teacherName || !teacherData.employeeId || !teacherData.email) {
          console.log('❌ Validation failed:', {
            hasName: !!teacherData.teacherName,
            hasEmployeeId: !!teacherData.employeeId,
            hasEmail: !!teacherData.email
          });
          results.errors.push({
            record: teacherData.employeeId || 'Unknown',
            error: 'Missing required fields (Name, Employee ID, or Email)'
          });
          results.skipped++;
          continue;
        }

        // Check for existing teacher by employee ID or email
        const existingTeacher = await AdminTeacher.findOne({
          $or: [
            { employeeId: teacherData.employeeId },
            { email: teacherData.email.toLowerCase() }
          ]
        });

        if (existingTeacher) {
          console.log('⚠️ Duplicate teacher found:', existingTeacher.employeeId);
          results.errors.push({
            record: teacherData.employeeId,
            error: 'Teacher with this Employee ID or Email already exists'
          });
          results.skipped++;
          continue;
        }

        // Set default password to employee ID
        teacherData.password = teacherData.employeeId;
        console.log('🔐 Password set to:', teacherData.password);

        // Create new teacher
        const createdTeacher = await AdminTeacher.create(teacherData);
        console.log('✅ Teacher created successfully:', {
          id: createdTeacher._id,
          name: createdTeacher.teacherName,
          email: createdTeacher.email
        });
        results.inserted++;

      } catch (error) {
        console.error('❌ Error inserting teacher:', {
          message: error.message,
          name: error.name,
          code: error.code
        });
        if (error.code === 11000) {
          const field = Object.keys(error.keyPattern)[0];
          console.error('   Duplicate key on field:', field);
        }
        results.errors.push({
          record: record['Employee ID'] || 'Unknown',
          error: error.message
        });
        results.skipped++;
      }
    }

    console.log(`✅ Upload complete: ${results.inserted} inserted, ${results.skipped} skipped`);

    res.status(200).json({
      message: `Successfully uploaded ${results.inserted} teachers`,
      inserted: results.inserted,
      skipped: results.skipped,
      errors: results.errors.slice(0, 10) // Return first 10 errors only
    });

  } catch (error) {
    console.error('❌ Upload teachers error:', error);
    res.status(500).json({ 
      message: 'Server error during upload',
      error: error.message 
    });
  }
};

// Get all students
exports.getAllStudents = async (req, res) => {
  try {
    const { page = 1, limit = 50, class: className, batch, status } = req.query;
    
    const query = {};
    if (className) query.class = className;
    if (batch) query.batch = batch;
    if (status) query.status = status;

    const students = await AdminStudent.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await AdminStudent.countDocuments(query);

    res.status(200).json({
      students,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit)
    });

  } catch (error) {
    console.error('❌ Get students error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all teachers
exports.getAllTeachers = async (req, res) => {
  try {
    const { page = 1, limit = 50, department, status } = req.query;
    
    const query = {};
    if (department) query.department = department;
    if (status) query.status = status;

    const teachers = await AdminTeacher.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await AdminTeacher.countDocuments(query);

    res.status(200).json({
      teachers,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit)
    });

  } catch (error) {
    console.error('❌ Get teachers error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete student
exports.deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    
    const student = await AdminStudent.findByIdAndDelete(id);
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json({ message: 'Student deleted successfully' });

  } catch (error) {
    console.error('❌ Delete student error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete teacher
exports.deleteTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    
    const teacher = await AdminTeacher.findByIdAndDelete(id);
    
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    res.status(200).json({ message: 'Teacher deleted successfully' });

  } catch (error) {
    console.error('❌ Delete teacher error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get statistics
exports.getStats = async (req, res) => {
  try {
    const totalStudents = await AdminStudent.countDocuments();
    const totalTeachers = await AdminTeacher.countDocuments();
    const activeStudents = await AdminStudent.countDocuments({ status: 'Active' });
    const activeTeachers = await AdminTeacher.countDocuments({ status: 'Active' });

    // Get students by class
    const studentsByClass = await AdminStudent.aggregate([
      { $group: { _id: '$class', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    // Get teachers by department
    const teachersByDept = await AdminTeacher.aggregate([
      { $group: { _id: '$department', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.status(200).json({
      totalStudents,
      totalTeachers,
      activeStudents,
      activeTeachers,
      studentsByClass,
      teachersByDept
    });

  } catch (error) {
    console.error('❌ Get stats error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Assign classes and subjects to a teacher
exports.assignToTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const { classes, subjects } = req.body;

    console.log(`📝 Assigning to teacher ${id}:`, { classes, subjects });

    // Find and update the teacher
    const teacher = await AdminTeacher.findById(id);
    
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    // Update teacher's assigned classes and subjects
    teacher.assignedClasses = classes || [];
    teacher.assignedSubjects = subjects || [];
    teacher.lastAssignedAt = new Date();
    teacher.assignedBy = req.user?.id;

    await teacher.save();

    console.log(`✅ Successfully assigned to teacher: ${teacher.teacherName}`);

    res.status(200).json({
      message: 'Successfully assigned classes and subjects to teacher',
      teacher: {
        _id: teacher._id,
        teacherName: teacher.teacherName,
        employeeId: teacher.employeeId,
        email: teacher.email,
        assignedClasses: teacher.assignedClasses,
        assignedSubjects: teacher.assignedSubjects
      }
    });

  } catch (error) {
    console.error('❌ Assign to teacher error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all available classes
exports.getAvailableClasses = async (req, res) => {
  try {
    // Get unique classes from students
    const classes = await AdminStudent.distinct('class');
    
    // Filter out empty values and sort
    const filteredClasses = classes
      .filter(c => c && c.trim() !== '')
      .sort();

    res.status(200).json({
      classes: filteredClasses
    });

  } catch (error) {
    console.error('❌ Get available classes error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all available subjects
exports.getAvailableSubjects = async (req, res) => {
  try {
    // Get unique subjects from teachers
    const subjects = await AdminTeacher.distinct('subject');
    
    // Filter out empty values and sort
    const filteredSubjects = subjects
      .filter(s => s && s.trim() !== '')
      .sort();

    // Default subjects if none exist
    const defaultSubjects = [
      'Mathematics', 'English', 'Science', 'Social Studies', 
      'Hindi', 'Computer Science', 'Physics', 'Chemistry', 
      'Biology', 'History', 'Geography', 'Economics'
    ];

    const allSubjects = [...new Set([...filteredSubjects, ...defaultSubjects])].sort();

    res.status(200).json({
      subjects: allSubjects
    });

  } catch (error) {
    console.error('❌ Get available subjects error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
