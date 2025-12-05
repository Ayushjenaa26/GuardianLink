const AdminStudent = require('../../models/AdminSide/AdminStudent');
const AdminTeacher = require('../../models/AdminSide/AdminTeacher');

// Upload Students from Excel
exports.uploadStudents = async (req, res) => {
  try {
    const { data } = req.body;

    if (!data || !Array.isArray(data) || data.length === 0) {
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
        // Map Excel columns to database fields
        const studentData = {
          studentName: record['Student Name'] || record['studentName'] || '',
          rollNo: record['Roll No'] || record['rollNo'] || record['Roll Number'] || '',
          email: record['Email'] || record['email'] || '',
          class: record['Class'] || record['class'] || '',
          year: record['Year'] || record['year'] || '',
          batch: record['Batch'] || record['batch'] || '',
          attendance: parseFloat(record['Attendance'] || record['attendance']) || 0,
          gpa: parseFloat(record['GPA'] || record['gpa']) || 0,
          status: record['Status'] || record['status'] || 'Active',
          uploadedBy: req.user?.id
        };

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
        await AdminStudent.create(studentData);
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
    const { data } = req.body;

    if (!data || !Array.isArray(data) || data.length === 0) {
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
        // Map Excel columns to database fields
        const teacherData = {
          teacherName: record['Teacher Name'] || record['teacherName'] || record['Name'] || '',
          employeeId: record['Employee ID'] || record['employeeId'] || record['Employee Id'] || '',
          email: record['Email'] || record['email'] || '',
          subject: record['Subject'] || record['subject'] || '',
          classes: record['Classes'] || record['classes'] || '',
          phone: record['Phone'] || record['phone'] || '',
          department: record['Department'] || record['department'] || '',
          experience: record['Experience'] || record['experience'] || '',
          status: record['Status'] || record['status'] || 'Active',
          uploadedBy: req.user?.id
        };

        // Validate required fields
        if (!teacherData.teacherName || !teacherData.employeeId || !teacherData.email) {
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
          results.errors.push({
            record: teacherData.employeeId,
            error: 'Teacher with this Employee ID or Email already exists'
          });
          results.skipped++;
          continue;
        }

        // Set default password to employee ID
        teacherData.password = teacherData.employeeId;

        // Create new teacher
        await AdminTeacher.create(teacherData);
        results.inserted++;

      } catch (error) {
        console.error('Error inserting teacher:', error);
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
