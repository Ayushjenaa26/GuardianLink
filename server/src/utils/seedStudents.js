const mongoose = require('mongoose');
const path = require('path');
const Student = require('../models/TeacherSide/Student');
const Attendance = require('../models/TeacherSide/Attendance');
const Marks = require('../models/TeacherSide/Marks');
const BehaviorReport = require('../models/TeacherSide/BehaviorReport');
const Teacher = require('../models/TeacherSide/Teacher');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

const students = [
  { id: '16010123071', name: 'ARJJEET PAUL', class: 'B1 - Full Stack Development', section: 'B1', batch: '2024', gender: 'male' },
  { id: '16010123072', name: 'ARNAB BHOWMIP', class: 'B1 - Full Stack Development', section: 'B1', batch: '2024', gender: 'male' },
  { id: '16010123073', name: 'ARNAV WAGHDH', class: 'B2 - Software Engineering', section: 'B2', batch: '2024', gender: 'male' },
  { id: '16010123074', name: 'ARNAV VAVRE', class: 'B2 - Software Engineering', section: 'B2', batch: '2024', gender: 'male' },
  { id: '16010123075', name: 'ARPIT MISHRA', class: 'B3 - Database Systems', section: 'B3', batch: '2024', gender: 'male' },
  { id: '16010123076', name: 'ARYA KADAM', class: 'B3 - Database Systems', section: 'B3', batch: '2024', gender: 'female' },
  { id: '16010123077', name: 'ARYAN OLHA', class: 'A1 - Computer Networks', section: 'A1', batch: '2024', gender: 'male' },
  { id: '16010123078', name: 'ARYAN SINGH', class: 'A1 - Computer Networks', section: 'A1', batch: '2024', gender: 'male' },
  { id: '16010123079', name: 'ARYAN BAGE', class: 'A2 - Cyber Security', section: 'A2', batch: '2024', gender: 'male' },
  { id: '16010123080', name: 'ARYAN RAUT', class: 'A2 - Cyber Security', section: 'A2', batch: '2024', gender: 'male' },
  { id: '16010123081', name: 'ARYAN KARANKI', class: 'B1 - Full Stack Development', section: 'B1', batch: '2024', gender: 'male' },
  { id: '16010123082', name: 'ARYAN INDRA', class: 'B1 - Full Stack Development', section: 'B1', batch: '2024', gender: 'male' },
  { id: '16010123083', name: 'ARYAN RESHAM', class: 'B2 - Software Engineering', section: 'B2', batch: '2024', gender: 'male' },
  { id: '16010123084', name: 'ASHISH KUMAR', class: 'B2 - Software Engineering', section: 'B2', batch: '2024', gender: 'male' },
  { id: '16010123085', name: 'ASHVATHI IOSHI', class: 'B3 - Database Systems', section: 'B3', batch: '2024', gender: 'female' },
  { id: '16010123086', name: 'ASWIN NAMBIAR', class: 'B3 - Database Systems', section: 'B3', batch: '2024', gender: 'male' },
  { id: '16010123087', name: 'ATHARY MULYE', class: 'A1 - Computer Networks', section: 'A1', batch: '2024', gender: 'male' },
  { id: '16010123088', name: 'ATHARY DESHPAN', class: 'A1 - Computer Networks', section: 'A1', batch: '2024', gender: 'male' },
  { id: '16010123089', name: 'ATHARYA RANJAN', class: 'A2 - Cyber Security', section: 'A2', batch: '2024', gender: 'male' },
  { id: '16010123090', name: 'ATHARYA SHAH', class: 'A2 - Cyber Security', section: 'A2', batch: '2024', gender: 'male' },
  { id: '16010123091', name: 'ATHARYA MORE', class: 'B1 - Full Stack Development', section: 'B1', batch: '2024', gender: 'male' },
  { id: '16010123092', name: 'ATUL PANDEY', class: 'B1 - Full Stack Development', section: 'B1', batch: '2024', gender: 'male' },
  { id: '16010123093', name: 'AVANIKA KULKARN', class: 'B2 - Software Engineering', section: 'B2', batch: '2024', gender: 'female' },
  { id: '16010123094', name: 'AYAN TRIPATHI', class: 'B2 - Software Engineering', section: 'B2', batch: '2024', gender: 'male' },
  { id: '16010123095', name: 'AYUSH JENA', class: 'B3 - Database Systems', section: 'B3', batch: '2024', gender: 'male' },
  { id: '16010123096', name: 'AYUSH BACHAL', class: 'B3 - Database Systems', section: 'B3', batch: '2024', gender: 'male' },
  { id: '16010123097', name: 'AYUSH GUPTA', class: 'A1 - Computer Networks', section: 'A1', batch: '2024', gender: 'male' },
  { id: '16010123098', name: 'BALDIRUV POGUL', class: 'A1 - Computer Networks', section: 'A1', batch: '2024', gender: 'male' },
  { id: '16010123099', name: 'BHAV SHAH', class: 'A2 - Cyber Security', section: 'A2', batch: '2024', gender: 'male' },
  { id: '16010123100', name: 'BHOUMISH GROVER', class: 'A2 - Cyber Security', section: 'A2', batch: '2024', gender: 'male' },
  { id: '16010123101', name: 'CHATTANYA DHAMDHI', class: 'B1 - Full Stack Development', section: 'B1', batch: '2024', gender: 'male' },
  { id: '16010123102', name: 'CHAITYA DOSHI', class: 'B1 - Full Stack Development', section: 'B1', batch: '2024', gender: 'male' },
  { id: '16010123103', name: 'CHERYL PINTO', class: 'B2 - Software Engineering', section: 'B2', batch: '2024', gender: 'female' },
  { id: '16010123104', name: 'CHITTANS PANCHOL', class: 'B2 - Software Engineering', section: 'B2', batch: '2024', gender: 'male' },
  { id: '16010123105', name: 'CRAIG ROSARIO', class: 'B3 - Database Systems', section: 'B3', batch: '2024', gender: 'male' },
  { id: '16010123106', name: 'DAKSH MISHRA', class: 'B3 - Database Systems', section: 'B3', batch: '2024', gender: 'male' },
  { id: '16010123107', name: 'DAKSH SHAH', class: 'A1 - Computer Networks', section: 'A1', batch: '2024', gender: 'male' },
  { id: '16010123108', name: 'DEVEN PATIL', class: 'A1 - Computer Networks', section: 'A1', batch: '2024', gender: 'male' },
  { id: '16010123109', name: 'DHANUSH SHETTY', class: 'A2 - Cyber Security', section: 'A2', batch: '2024', gender: 'male' },
  { id: '16010123110', name: 'DHITI WADHWA', class: 'A2 - Cyber Security', section: 'A2', batch: '2024', gender: 'female' },
  { id: '16010123111', name: 'DHRUV SARAF', class: 'B1 - Full Stack Development', section: 'B1', batch: '2024', gender: 'male' },
  { id: '16010123112', name: 'DHRUV SOKYA', class: 'B1 - Full Stack Development', section: 'B1', batch: '2024', gender: 'male' },
  { id: '16010123113', name: 'DHRUV IYER', class: 'B2 - Software Engineering', section: 'B2', batch: '2024', gender: 'male' },
  { id: '16010123114', name: 'DISHITA RUNWAL', class: 'B2 - Software Engineering', section: 'B2', batch: '2024', gender: 'female' },
  { id: '16010123115', name: 'DRASHITH HEGDE', class: 'B3 - Database Systems', section: 'B3', batch: '2024', gender: 'male' },
  { id: '16010123116', name: 'ESHHEET RAKA', class: 'B3 - Database Systems', section: 'B3', batch: '2024', gender: 'male' },
  { id: '16010123117', name: 'FARAAC KHATIB', class: 'A1 - Computer Networks', section: 'A1', batch: '2024', gender: 'male' },
  { id: '16010123118', name: 'FARHAM KHAN', class: 'A1 - Computer Networks', section: 'A1', batch: '2024', gender: 'male' },
  { id: '16010123119', name: 'GANDHARI UGALE', class: 'A2 - Cyber Security', section: 'A2', batch: '2024', gender: 'female' },
  { id: '16010123120', name: 'GAURANG AGRAWA', class: 'A2 - Cyber Security', section: 'A2', batch: '2024', gender: 'male' },
  { id: '16010123121', name: 'GAURAV MATOULA', class: 'B1 - Full Stack Development', section: 'B1', batch: '2024', gender: 'male' },
  { id: '16010123122', name: 'GAURAV ZOPE', class: 'B1 - Full Stack Development', section: 'B1', batch: '2024', gender: 'male' },
  { id: '16010123123', name: 'GAURI BHONSEI', class: 'B2 - Software Engineering', section: 'B2', batch: '2024', gender: 'female' },
  { id: '16010123124', name: 'GAURI DESHMUM', class: 'B2 - Software Engineering', section: 'B2', batch: '2024', gender: 'female' },
  { id: '16010123125', name: 'GIRISH CHAUDHA', class: 'B3 - Database Systems', section: 'B3', batch: '2024', gender: 'male' },
  { id: '16010123126', name: 'GOVING MISHRA', class: 'B3 - Database Systems', section: 'B3', batch: '2024', gender: 'male' },
  { id: '16010123127', name: 'GOVINDRA BORADE', class: 'A1 - Computer Networks', section: 'A1', batch: '2024', gender: 'male' },
  { id: '16010123128', name: 'GUKEESH SIMGH', class: 'A1 - Computer Networks', section: 'A1', batch: '2024', gender: 'male' },
  { id: '16010123129', name: 'GUKRASA AHUJA', class: 'A2 - Cyber Security', section: 'A2', batch: '2024', gender: 'male' },
  { id: '16010123130', name: 'SWAYAM NAKTE', class: 'A2 - Cyber Security', section: 'A2', batch: '2024', gender: 'male' },
  { id: '16010123131', name: 'SWAYAM VERNECK', class: 'B1 - Full Stack Development', section: 'B1', batch: '2024', gender: 'male' },
  { id: '16010123132', name: 'TANISH GUPTA', class: 'B1 - Full Stack Development', section: 'B1', batch: '2024', gender: 'male' },
  { id: '16010123133', name: 'TANISH SHAH', class: 'B2 - Software Engineering', section: 'B2', batch: '2024', gender: 'male' },
  { id: '16010123134', name: 'TANISHA MUKHER', class: 'B2 - Software Engineering', section: 'B2', batch: '2024', gender: 'female' },
  { id: '16010123135', name: 'TANMAY CHINCHO', class: 'B3 - Database Systems', section: 'B3', batch: '2024', gender: 'male' },
  { id: '16010123136', name: 'TANMAY GORAKSI', class: 'B3 - Database Systems', section: 'B3', batch: '2024', gender: 'male' },
  { id: '16010123137', name: 'TANUSH BLU', class: 'A1 - Computer Networks', section: 'A1', batch: '2024', gender: 'male' },
  { id: '16010123138', name: 'TATVA JAIN', class: 'A2 - Cyber Security', section: 'A2', batch: '2024', gender: 'female' }
];

const subjects = ['Mathematics', 'Science', 'English', 'Social Studies', 'Computer Science'];
const examTypes = ['unit_test', 'mid_term', 'final', 'assignment', 'project'];
const behaviorTypes = ['excellent', 'good', 'satisfactory', 'needs_improvement'];
const behaviorCategories = ['discipline', 'classroom_participation', 'homework', 'social_interaction'];

// Helper to get random element from array
const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Helper to get random date in the last 90 days
const getRandomDate = () => {
  const now = new Date();
  const past = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
  return new Date(past.getTime() + Math.random() * (now.getTime() - past.getTime()));
};

const seedData = async () => {
  try {
    await connectDB();

    // Get the first teacher from database
    const teacher = await Teacher.findOne();
    if (!teacher) {
      console.error('❌ No teacher found! Please create a teacher account first.');
      process.exit(1);
    }
    console.log(`✅ Found teacher: ${teacher.name}`);

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await Student.deleteMany({ teacherId: teacher._id });
    await Attendance.deleteMany({ markedBy: teacher._id });
    await Marks.deleteMany({ teacher: teacher._id });
    await BehaviorReport.deleteMany({ teacher: teacher._id });

    // Add students
    console.log('👥 Adding students...');
    const studentDocs = [];
    
    for (const student of students) {
      const [firstName, ...lastNameParts] = student.name.split(' ');
      const lastName = lastNameParts.join(' ') || firstName;
      
      const studentDoc = new Student({
        teacherId: teacher._id,
        firstName: firstName,
        lastName: lastName,
        studentId: student.id,
        dateOfBirth: new Date(2009, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
        gender: student.gender,
        email: `${student.id}@school.edu`,
        phone: `98${Math.floor(10000000 + Math.random() * 90000000)}`,
        address: `${Math.floor(Math.random() * 999) + 1}, Street ${Math.floor(Math.random() * 50) + 1}, Mumbai`,
        batch: student.batch,
        class: student.class,
        section: student.section,
        semester: '1',
        department: 'Computer Science',
        enrollmentDate: new Date(2024, 5, 15),
        parentName: `Parent of ${firstName}`,
        parentEmail: `parent_${student.id}@email.com`,
        parentPhone: `99${Math.floor(10000000 + Math.random() * 90000000)}`,
        emergencyContact: `99${Math.floor(10000000 + Math.random() * 90000000)}`,
        attendance: Math.floor(75 + Math.random() * 25), // 75-100%
        behaviorScore: Math.floor(70 + Math.random() * 30), // 70-100
        specialNeeds: 'None',
        hobbies: getRandom(['Sports', 'Music', 'Reading', 'Art', 'Gaming', 'Coding']),
        strengths: getRandom(['Good at Math', 'Excellent Communication', 'Creative Thinking', 'Problem Solving']),
        improvements: getRandom(['Time Management', 'Focus', 'Homework Submission', 'Class Participation']),
        notes: `Enrolled in class ${student.class}`,
        profileImage: ''
      });

      studentDocs.push(studentDoc);
    }

    await Student.insertMany(studentDocs);
    console.log(`✅ Added ${studentDocs.length} students`);

    // Add attendance records (last 30 days)
    console.log('📅 Adding attendance records...');
    const attendanceRecords = [];
    const last30Days = 30;
    
    // Create a map of student IDs to their class for reference
    const studentClassMap = {};
    students.forEach(s => studentClassMap[s.id] = s.class);
    
    for (let idx = 0; idx < studentDocs.length; idx++) {
      const studentDoc = studentDocs[idx];
      const classInfo = students[idx].class; // Get class from original data
      
      for (let i = 0; i < last30Days; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        // 85% present, 10% late, 5% absent
        const rand = Math.random();
        let status = 'present';
        if (rand > 0.95) status = 'absent';
        else if (rand > 0.85) status = 'late';

        attendanceRecords.push({
          student: studentDoc._id,
          class: classInfo,
          date: date,
          status: status,
          markedBy: teacher._id,
          remarks: status === 'absent' ? 'Sick' : status === 'late' ? 'Traffic' : ''
        });
      }
    }

    await Attendance.insertMany(attendanceRecords);
    console.log(`✅ Added ${attendanceRecords.length} attendance records`);

    // Add marks (multiple subjects and exam types)
    console.log('📊 Adding marks records...');
    const marksRecords = [];
    
    for (const studentDoc of studentDocs) {
      for (const subject of subjects) {
        for (let i = 0; i < 3; i++) { // 3 exams per subject
          const totalMarks = 100;
          const marksObtained = Math.floor(50 + Math.random() * 50); // 50-100

          marksRecords.push({
            student: studentDoc._id,
            subject: subject,
            examType: getRandom(examTypes),
            marksObtained: marksObtained,
            totalMarks: totalMarks,
            date: getRandomDate(),
            teacher: teacher._id,
            remarks: marksObtained > 90 ? 'Excellent' : marksObtained > 75 ? 'Very Good' : marksObtained > 60 ? 'Good' : 'Needs Improvement',
            semester: '1'
          });
        }
      }
    }

    await Marks.insertMany(marksRecords);
    console.log(`✅ Added ${marksRecords.length} marks records`);

    // Add behavior reports (2-4 per student)
    console.log('📝 Adding behavior reports...');
    const behaviorRecords = [];
    
    for (const studentDoc of studentDocs) {
      const numReports = Math.floor(Math.random() * 3) + 2; // 2-4 reports
      
      for (let i = 0; i < numReports; i++) {
        const behavior = getRandom(behaviorTypes);
        const category = getRandom(behaviorCategories);
        
        behaviorRecords.push({
          student: studentDoc._id,
          teacher: teacher._id,
          date: getRandomDate(),
          behavior: behavior,
          category: category,
          description: `${category.replace('_', ' ')} - Student showed ${behavior} behavior during class activities`,
          actionTaken: behavior === 'needs_improvement' ? 'Counseling provided' : 'Positive reinforcement given',
          recommendations: behavior === 'excellent' || behavior === 'good' ? 'Continue current approach' : 'Monitor progress and provide additional support'
        });
      }
    }

    await BehaviorReport.insertMany(behaviorRecords);
    console.log(`✅ Added ${behaviorRecords.length} behavior reports`);

    console.log('\n🎉 Database seeded successfully!');
    console.log(`\nSummary:`);
    console.log(`- Students: ${studentDocs.length}`);
    console.log(`- Attendance Records: ${attendanceRecords.length}`);
    console.log(`- Marks Records: ${marksRecords.length}`);
    console.log(`- Behavior Reports: ${behaviorRecords.length}`);
    console.log(`\nBatches:`);
    console.log(`- B1 - Full Stack Development`);
    console.log(`- B2 - Software Engineering`);
    console.log(`- B3 - Database Systems`);
    console.log(`- A1 - Computer Networks`);
    console.log(`- A2 - Cyber Security`);
    console.log(`\n(Students evenly distributed across all batches)`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
