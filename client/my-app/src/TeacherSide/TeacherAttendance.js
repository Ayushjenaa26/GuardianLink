import React, { useState, useEffect, useCallback } from 'react';
import './TeacherAttendance.css';
import { API_URL } from '../config';

const TeacherAttendance = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [attendanceData, setAttendanceData] = useState([]);
  const [classSections, setClassSections] = useState([]);
  const [overviewStats, setOverviewStats] = useState({
    overallRate: 0,
    presentToday: 0,
    absentToday: 0,
    lateToday: 0,
    totalStudents: 0
  });
  const [todaysAttendance, setTodaysAttendance] = useState([]);
  const [detailedAttendanceByDate, setDetailedAttendanceByDate] = useState([]);

  // Hardcoded student data from database
  const allStudents = [
    // B1 - Full Stack Development
    { id: '16010123071', firstName: 'ARJJEET', lastName: 'PAUL', class: 'B1 - Full Stack Development' },
    { id: '16010123072', firstName: 'ARNAB', lastName: 'BHOWMIH', class: 'B1 - Full Stack Development' },
    { id: '16010123073', firstName: 'ARNAV', lastName: 'WAGHDH', class: 'B1 - Full Stack Development' },
    { id: '16010123074', firstName: 'ARNAV', lastName: 'VAVRE', class: 'B1 - Full Stack Development' },
    { id: '16010123075', firstName: 'ARPIT', lastName: 'MISHRA', class: 'B1 - Full Stack Development' },
    { id: '16010123076', firstName: 'ARYA', lastName: 'KADAM', class: 'B1 - Full Stack Development' },
    { id: '16010123077', firstName: 'ARYAN', lastName: 'OJHA', class: 'B1 - Full Stack Development' },
    { id: '16010123078', firstName: 'ARYAN', lastName: 'SINGH', class: 'B1 - Full Stack Development' },
    { id: '16010123079', firstName: 'ARYAN', lastName: 'BAGE', class: 'B1 - Full Stack Development' },
    { id: '16010123080', firstName: 'ARYAN', lastName: 'RAUT', class: 'B1 - Full Stack Development' },
    { id: '16010123081', firstName: 'ARYAN', lastName: 'KARANKI', class: 'B1 - Full Stack Development' },
    { id: '16010123082', firstName: 'ARYAN', lastName: 'INDRA', class: 'B1 - Full Stack Development' },
    { id: '16010123083', firstName: 'ARYAN', lastName: 'RESHAMV', class: 'B1 - Full Stack Development' },
    { id: '16010123084', firstName: 'ASHISH', lastName: 'KUMAR', class: 'B1 - Full Stack Development' },
    
    // B2 - Software Engineering
    { id: '16010123085', firstName: 'ASHVATH', lastName: 'JOSHI', class: 'B2 - Software Engineering' },
    { id: '16010123086', firstName: 'ASWIN', lastName: 'NAMBIAR', class: 'B2 - Software Engineering' },
    { id: '16010123087', firstName: 'ATHARV', lastName: 'MULYE', class: 'B2 - Software Engineering' },
    { id: '16010123088', firstName: 'ATHARV', lastName: 'DESHPAN', class: 'B2 - Software Engineering' },
    { id: '16010123089', firstName: 'ATHARVA', lastName: 'RANJAN', class: 'B2 - Software Engineering' },
    { id: '16010123090', firstName: 'ATHARVA', lastName: 'SHAH', class: 'B2 - Software Engineering' },
    { id: '16010123091', firstName: 'ATHARVA', lastName: 'MORE', class: 'B2 - Software Engineering' },
    { id: '16010123092', firstName: 'ATUL', lastName: 'PANDEY', class: 'B2 - Software Engineering' },
    { id: '16010123093', firstName: 'AVANIKA', lastName: 'KULKARN', class: 'B2 - Software Engineering' },
    { id: '16010123094', firstName: 'AYAN', lastName: 'TRIPATHI', class: 'B2 - Software Engineering' },
    { id: '16010123095', firstName: 'AYUSH', lastName: 'JENA', class: 'B2 - Software Engineering' },
    { id: '16010123096', firstName: 'AYUSH', lastName: 'BACHAL', class: 'B2 - Software Engineering' },
    { id: '16010123097', firstName: 'AYUSH', lastName: 'GUPTA', class: 'B2 - Software Engineering' },
    { id: '16010123098', firstName: 'BALDHI', lastName: 'POGUL', class: 'B2 - Software Engineering' },
    
    // B3 - Database Systems
    { id: '16010123099', firstName: 'BHAV', lastName: 'SHAH', class: 'B3 - Database Systems' },
    { id: '16010123100', firstName: 'BHOUMISH', lastName: 'GROVER', class: 'B3 - Database Systems' },
    { id: '16010123101', firstName: 'CHAITANYA', lastName: 'DHAMDHI', class: 'B3 - Database Systems' },
    { id: '16010123102', firstName: 'CHAITYA', lastName: 'DOSHI', class: 'B3 - Database Systems' },
    { id: '16010123103', firstName: 'CHERYL', lastName: 'PINTO', class: 'B3 - Database Systems' },
    { id: '16010123104', firstName: 'CHITTANSH', lastName: 'PANCHOL', class: 'B3 - Database Systems' },
    { id: '16010123105', firstName: 'CRAIG', lastName: 'ROSARIO', class: 'B3 - Database Systems' },
    { id: '16010123106', firstName: 'DAKSH', lastName: 'MISHRA', class: 'B3 - Database Systems' },
    { id: '16010123107', firstName: 'DAKSH', lastName: 'SHAH', class: 'B3 - Database Systems' },
    { id: '16010123108', firstName: 'DEVEN', lastName: 'PATIL', class: 'B3 - Database Systems' },
    { id: '16010123109', firstName: 'DHANUSH', lastName: 'SHETTY', class: 'B3 - Database Systems' },
    { id: '16010123110', firstName: 'DHITI', lastName: 'WADHWA', class: 'B3 - Database Systems' },
    { id: '16010123111', firstName: 'DHRUV', lastName: 'SARAF', class: 'B3 - Database Systems' },
    { id: '16010123112', firstName: 'DHRUV', lastName: 'SOKIYA', class: 'B3 - Database Systems' },
    
    // A1 - Computer Networks
    { id: '16010123113', firstName: 'DHRUV', lastName: 'IYER', class: 'A1 - Computer Networks' },
    { id: '16010123114', firstName: 'DISHITA', lastName: 'RUNWAL', class: 'A1 - Computer Networks' },
    { id: '16010123115', firstName: 'DRASHITH', lastName: 'HEGDE', class: 'A1 - Computer Networks' },
    { id: '16010123116', firstName: 'ESHEET', lastName: 'RAKA', class: 'A1 - Computer Networks' },
    { id: '16010123117', firstName: 'FARAAZ', lastName: 'KHATIB', class: 'A1 - Computer Networks' },
    { id: '16010123118', firstName: 'FARHAAN', lastName: 'KHAN', class: 'A1 - Computer Networks' },
    { id: '16010123119', firstName: 'GANDHAR', lastName: 'UGALE', class: 'A1 - Computer Networks' },
    { id: '16010123120', firstName: 'GAURANG', lastName: 'AGRAWA', class: 'A1 - Computer Networks' },
    { id: '16010123121', firstName: 'GAURAV', lastName: 'MATOLIA', class: 'A1 - Computer Networks' },
    { id: '16010123122', firstName: 'GAURAV', lastName: 'ZOPE', class: 'A1 - Computer Networks' },
    { id: '16010123123', firstName: 'GAURI', lastName: 'BHONSLE', class: 'A1 - Computer Networks' },
    { id: '16010123124', firstName: 'GAURI', lastName: 'DESHMUI', class: 'A1 - Computer Networks' },
    { id: '16010123125', firstName: 'GIRISH', lastName: 'CHAUDHA', class: 'A1 - Computer Networks' },
    { id: '16010123126', firstName: 'GOVIND', lastName: 'MISHRA', class: 'A1 - Computer Networks' },
    
    // A2 - Cyber Security
    { id: '16010123127', firstName: 'GOVINDRA', lastName: 'BORADE', class: 'A2 - Cyber Security' },
    { id: '16010123128', firstName: 'GUNEESH', lastName: 'SINGH', class: 'A2 - Cyber Security' },
    { id: '16010123129', firstName: 'GURKARAN', lastName: 'AHUJA', class: 'A2 - Cyber Security' },
    { id: '16010123130', firstName: 'SWAYAM', lastName: 'NAKTE', class: 'A2 - Cyber Security' },
    { id: '16010123131', firstName: 'SWAYAM', lastName: 'VERNECK', class: 'A2 - Cyber Security' },
    { id: '16010123132', firstName: 'TANISH', lastName: 'GUPTA', class: 'A2 - Cyber Security' },
    { id: '16010123133', firstName: 'TANISH', lastName: 'SHAH', class: 'A2 - Cyber Security' },
    { id: '16010123134', firstName: 'TANISHA', lastName: 'MUKHER', class: 'A2 - Cyber Security' },
    { id: '16010123135', firstName: 'TANMAY', lastName: 'CHINCHO', class: 'A2 - Cyber Security' },
    { id: '16010123136', firstName: 'TANMAY', lastName: 'GORAKSH', class: 'A2 - Cyber Security' },
    { id: '16010123137', firstName: 'TANUSH', lastName: 'BIJU', class: 'A2 - Cyber Security' },
    { id: '16010123138', firstName: 'TATVA', lastName: 'JAIN', class: 'A2 - Cyber Security' }
  ];

  const fetchAttendanceData = useCallback(async () => {
    try {
      setLoading(true);
      
      console.log('🔍 Using hardcoded student data');
      const studentsData = allStudents;
      console.log('✅ Students loaded:', studentsData.length, 'students');
      
      // Filter by selected class if needed
      let filteredStudents = studentsData;
      if (selectedClass !== 'all') {
        filteredStudents = studentsData.filter(s => s.class === selectedClass);
      }

      // Get unique classes for sections
      const uniqueClasses = [...new Set(studentsData.map(s => s.class))];
      const sectionsData = uniqueClasses.map(className => {
        const classStudents = studentsData.filter(s => s.class === className);
        const avgAttendance = classStudents.reduce((sum, s) => sum + (s.attendance || 0), 0) / classStudents.length;
        return {
          name: className,
          count: classStudents.length,
          rate: Math.round(avgAttendance || 0)
        };
      });
      setClassSections(sectionsData);

      // Calculate overview stats
      const totalStudents = filteredStudents.length;
      const avgAttendance = filteredStudents.reduce((sum, s) => sum + (s.attendance || 0), 0) / totalStudents;
      
      // Simulate today's attendance (randomly distributed)
      const presentCount = Math.floor(totalStudents * 0.85);
      const lateCount = Math.floor(totalStudents * 0.05);
      const absentCount = totalStudents - presentCount - lateCount;

      setOverviewStats({
        overallRate: Math.round(avgAttendance || 0),
        presentToday: presentCount,
        absentToday: absentCount,
        lateToday: lateCount,
        totalStudents: totalStudents
      });

      // Create today's attendance list
      const todaysList = filteredStudents.map((student, index) => {
        let status = 'present';
        if (index < absentCount) status = 'absent';
        else if (index < absentCount + lateCount) status = 'late';
        
        return {
          name: `${student.firstName} ${student.lastName}`,
          initials: `${student.firstName[0]}${student.lastName[0]}`,
          status: status,
          studentId: student.studentId
        };
      });
      setTodaysAttendance(todaysList);

      // Get last 5 days for detailed records
      const last5Days = [];
      for (let i = 4; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        last5Days.push({
          date: date,
          label: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        });
      }

      // Create detailed attendance data
      const detailedData = filteredStudents.map((student, studentIndex) => {
        const attendanceRecord = last5Days.map(() => {
          const rand = Math.random();
          if (rand > 0.95) return 'A'; // 5% absent
          if (rand > 0.85) return 'L'; // 10% late
          return 'P'; // 85% present
        });

        const absences = attendanceRecord.filter(a => a === 'A').length;
        const lateArrivals = attendanceRecord.filter(a => a === 'L').length;

        return {
          name: `${student.firstName} ${student.lastName}`,
          id: student.studentId,
          class: student.class,
          attendance: attendanceRecord,
          absences: absences,
          late: lateArrivals,
          overall: student.attendance || 0
        };
      });

      // Create date-wise detailed attendance for the detailed records tab
      const dateWiseAttendance = last5Days.map((dateObj, dateIndex) => {
        return {
          date: dateObj.date,
          label: dateObj.label,
          students: detailedData.map(student => ({
            name: student.name,
            id: student.id,
            class: student.class,
            status: student.attendance[dateIndex]
          }))
        };
      });

      console.log('📊 Detailed data created:', detailedData.length, 'students');
      console.log('📅 Date-wise attendance:', dateWiseAttendance.length, 'dates');
      
      setAttendanceData({ students: detailedData, dates: last5Days });
      setDetailedAttendanceByDate(dateWiseAttendance);
      
      // Set selected date to today (last date in the array) if not already set
      if (!selectedDate && dateWiseAttendance.length > 0) {
        const todayDate = dateWiseAttendance[dateWiseAttendance.length - 1].date;
        console.log('📆 Setting selected date to:', todayDate);
        setSelectedDate(todayDate);
      }
      
      console.log('✅ Attendance data loaded successfully');
      setLoading(false);
    } catch (error) {
      console.error('❌ Error fetching attendance data:', error);
      setLoading(false);
    }
  }, [selectedClass, selectedDate]);

  useEffect(() => {
    fetchAttendanceData();
  }, [fetchAttendanceData]);

  const getAttendanceColor = (val) => {
    if (val === "P") return "#10b981"; // Green for present
    if (val === "A") return "#ef4444"; // Red for absent
    if (val === "L") return "#f59e0b"; // Amber for late
    return "#94a3b8";
  };

  const getAttendanceLabel = (val) => {
    if (val === "P") return "Present";
    if (val === "A") return "Absent";
    if (val === "L") return "Late";
    return "Unknown";
  };

  const getOverallAttendance = (attArr) => {
    const total = attArr.length;
    const present = attArr.filter(a => a === "P" || a === "L").length;
    return Math.round((present / total) * 100);
  };

  const handleClassSectionClick = (className) => {
    setSelectedClass(className);
  };

  // Function to export attendance data to CSV
  const exportToCSV = () => {
    try {
      // Prepare data based on active tab
      let csvContent = '';
      let filename = '';

      if (activeTab === 'detailed' && detailedAttendanceByDate.length > 0 && selectedDate) {
        // Export detailed records for selected date
        const dateData = detailedAttendanceByDate.find(d => d.date.toDateString() === selectedDate.toDateString());
        if (!dateData) return;

        filename = `Attendance_${selectedClass === 'all' ? 'All_Classes' : selectedClass}_${selectedDate.toLocaleDateString('en-US').replace(/\//g, '-')}.csv`;
        
        // CSV Header
        csvContent = 'Student Name,Student ID,Class,Status,Date\n';
        
        // CSV Rows
        dateData.students.forEach(student => {
          const statusLabel = student.status === 'P' ? 'Present' : student.status === 'A' ? 'Absent' : 'Late';
          csvContent += `"${student.name}","${student.id}","${student.class}","${statusLabel}","${selectedDate.toLocaleDateString('en-US')}"\n`;
        });
      } else {
        // Export overview/summary data
        filename = `Attendance_Summary_${selectedClass === 'all' ? 'All_Classes' : selectedClass}_${new Date().toLocaleDateString('en-US').replace(/\//g, '-')}.csv`;
        
        // CSV Header
        csvContent = 'Student Name,Student ID,Class,Overall Attendance %,Status Today\n';
        
        // CSV Rows
        todaysAttendance.forEach(student => {
          const statusLabel = student.status === 'present' ? 'Present' : student.status === 'absent' ? 'Absent' : 'Late';
          csvContent += `"${student.name}","${student.studentId || 'N/A'}","${selectedClass === 'all' ? 'All' : selectedClass}","${overviewStats.overallRate}%","${statusLabel}"\n`;
        });
      }

      // Create blob and download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      console.log('✅ CSV exported successfully:', filename);
    } catch (error) {
      console.error('❌ Error exporting CSV:', error);
      alert('Failed to export report. Please try again.');
    }
  };

  return (
    <div className="teacher-attendance">
      {/* Header Section */}
      <div className="attendance-header">
        <div className="header-content">
          <h1>📊 {selectedClass === 'all' ? 'All Classes' : `Class ${selectedClass}`} Attendance</h1>
          <p>Track and manage student attendance with real-time insights and analytics</p>
        </div>
        <div className="header-actions">
          <button className="btn-export" onClick={exportToCSV}>📥 Export Report</button>
        </div>
      </div>

      {/* Batch Filter Buttons */}
      <div className="batch-filters">
        <button 
          className={`batch-btn ${selectedClass === 'all' ? 'active' : ''}`}
          onClick={() => handleClassSectionClick('all')}
        >
          All Batches
        </button>
        {classSections.map((section, index) => (
          <button 
            key={index}
            className={`batch-btn ${selectedClass === section.name ? 'active' : ''}`}
            onClick={() => handleClassSectionClick(section.name)}
          >
            {section.name}
          </button>
        ))}
      </div>

      {/* Navigation Tabs */}
      <div className="attendance-tabs">
        <button 
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          🏠 Class Overview
        </button>
        <button 
          className={`tab-btn ${activeTab === 'trends' ? 'active' : ''}`}
          onClick={() => setActiveTab('trends')}
        >
          📈 Attendance Trends
        </button>
        <button 
          className={`tab-btn ${activeTab === 'detailed' ? 'active' : ''}`}
          onClick={() => setActiveTab('detailed')}
        >
          📋 Detailed Records
        </button>
      </div>

      {/* Overview Tab Content */}
      {activeTab === 'overview' && (
        <div className="tab-content">
          {loading ? (
            <div className="loading-message">Loading attendance data...</div>
          ) : (
            <>
              {/* Stats Cards */}
              <div className="stats-grid">
                <div className="stat-card primary">
                  <div className="stat-value">{overviewStats.overallRate}%</div>
                  <div className="stat-label">Overall Attendance Rate</div>
                  <div className="stat-subtext">
                    {overviewStats.overallRate >= 90 ? 'Excellent performance' : 
                     overviewStats.overallRate >= 75 ? 'Good performance' : 
                     'Needs improvement'}
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{overviewStats.presentToday}</div>
                  <div className="stat-label">Students Present Today</div>
                  <div className="stat-subtext">Out of {overviewStats.totalStudents} total students</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{overviewStats.absentToday}</div>
                  <div className="stat-label">Students Absent Today</div>
                  <div className="stat-subtext">
                    {overviewStats.absentToday > 0 ? 'Need to follow up' : 'Perfect attendance'}
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{overviewStats.lateToday}</div>
                  <div className="stat-label">Late Arrivals Today</div>
                  <div className="stat-subtext">
                    {overviewStats.lateToday === 1 ? '1 student arrived late' : 
                     overviewStats.lateToday > 1 ? `${overviewStats.lateToday} students arrived late` : 
                     'No late arrivals'}
                  </div>
                </div>
              </div>
            </>
          )}

          {!loading && (
            <>
              <div className="content-grid">
                {/* Class Sections */}
                <div className="content-card">
                  <div className="card-header">
                    <h3>🏫 Class Sections Summary</h3>
                    <button 
                      className="view-all"
                      onClick={() => handleClassSectionClick('all')}
                      style={{ cursor: 'pointer', background: 'none', border: 'none', color: '#8b5cf6' }}
                    >
                      View All →
                    </button>
                  </div>
                  <div className="sections-list">
                    {classSections.map((section, index) => (
                      <div 
                        key={index} 
                        className={`section-item ${selectedClass === section.name ? 'active' : ''}`}
                        onClick={() => handleClassSectionClick(section.name)}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className="section-info">
                          <div className="section-name">Section {section.name}</div>
                          <div className="section-teacher">{section.count} students</div>
                        </div>
                        <div className="section-rate">{section.rate}%</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Today's Attendance */}
                <div className="content-card">
                  <div className="card-header">
                    <h3>📅 Today's Attendance - {selectedClass === 'all' ? 'All Classes' : `Class ${selectedClass}`}</h3>
                    <span className="view-all">View All →</span>
                  </div>
                  <div className="attendance-list">
                    {todaysAttendance.slice(0, 9).map((student, index) => (
                      <div key={index} className="attendance-item">
                        <div className="student-initials">
                          {student.initials}
                        </div>
                        <div className="student-name">{student.name}</div>
                        <div className={`attendance-status ${student.status}`}>
                          {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Trends Tab Content */}
      {activeTab === 'trends' && (
        <div className="tab-content">
          <div className="content-grid">
            <div className="content-card">
              <h3>📊 Weekly Performance Trends</h3>
              <div className="trend-item">
                <div className="trend-value positive">+2.1%</div>
                <span className="view-report">View Detailed Report →</span>
              </div>
              <div className="trend-stats">
                <div className="trend-stat">
                  <span>Absenteeism Rate</span>
                  <span className="negative">-1.5%</span>
                </div>
                <div className="trend-stat">
                  <span>Late Arrivals</span>
                  <span>No Change</span>
                </div>
                <div className="trend-stat">
                  <span>Perfect Attendance</span>
                  <span className="positive">+3 Students</span>
                </div>
                <div className="trend-stat">
                  <span>Class Participation</span>
                  <span className="positive">+8%</span>
                </div>
              </div>
            </div>

            <div className="content-card">
              <h3>📈 Monthly Overview - {selectedClass === 'all' ? 'All Classes' : `Class ${selectedClass}`}</h3>
              <div className="monthly-list">
                <div className="monthly-item">
                  <span>Current Month</span>
                  <span className="monthly-rate">{overviewStats.overallRate}%</span>
                </div>
                <div className="monthly-item">
                  <span>Total Students</span>
                  <span className="monthly-rate">{overviewStats.totalStudents}</span>
                </div>
                <div className="monthly-item">
                  <span>Present Today</span>
                  <span className="monthly-rate">{overviewStats.presentToday}</span>
                </div>
                <div className="monthly-item">
                  <span>Absent Today</span>
                  <span className="monthly-rate">{overviewStats.absentToday}</span>
                </div>
              </div>
              <button className="btn-view-history">📚 View Complete History</button>
            </div>
          </div>
        </div>
      )}

      {/* Detailed Tab Content */}
      {activeTab === 'detailed' && (
        <div className="tab-content">
          {loading ? (
            <div className="loading-message">Loading detailed records...</div>
          ) : detailedAttendanceByDate && detailedAttendanceByDate.length > 0 && selectedDate ? (
            <div className="content-card">
              <div className="detailed-header">
                <h3 style={{marginBottom: '20px', color: '#f0f4ff'}}>📋 Detailed Attendance Records - {selectedClass === 'all' ? 'All Classes' : selectedClass}</h3>
                
                {/* Date Selector */}
                <div className="date-selector">
                  <label style={{color: '#94a3b8', marginRight: '12px', fontWeight: '600'}}>Select Date:</label>
                  <div className="date-buttons">
                    {detailedAttendanceByDate.map((dateData, index) => (
                      <button
                        key={index}
                        className={`date-btn ${selectedDate && selectedDate.toDateString() === dateData.date.toDateString() ? 'active' : ''}`}
                        onClick={() => setSelectedDate(dateData.date)}
                      >
                        {dateData.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Student List with Present/Absent */}
              <div className="student-attendance-list">
                {selectedDate && detailedAttendanceByDate
                  .find(d => d.date.toDateString() === selectedDate.toDateString())
                  ?.students.map((student, index) => {
                    const statusClass = student.status === 'P' ? 'present' : student.status === 'A' ? 'absent' : 'late';
                    const statusLabel = student.status === 'P' ? 'Present' : student.status === 'A' ? 'Absent' : 'Late';
                    const statusIcon = student.status === 'P' ? '✅' : student.status === 'A' ? '❌' : '⏰';
                    
                    return (
                      <div key={index} className={`student-attendance-card ${statusClass}`}>
                        <div className="student-attendance-info">
                          <div className="student-avatar">
                            {student.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </div>
                          <div className="student-details">
                            <div className="student-name-detail">{student.name}</div>
                            <div className="student-id-detail">ID: {student.id}</div>
                            <div className="student-class-detail">Class: {student.class}</div>
                          </div>
                        </div>
                        <div className={`attendance-status-badge ${statusClass}`}>
                          <span className="status-icon">{statusIcon}</span>
                          <span className="status-text">{statusLabel}</span>
                        </div>
                      </div>
                    );
                  })}
              </div>

              {/* Summary Stats for Selected Date */}
              {selectedDate && (
                <div className="date-summary">
                  <div className="summary-stat success">
                    <span className="summary-label">Present:</span>
                    <span className="summary-value">
                      {detailedAttendanceByDate
                        .find(d => d.date.toDateString() === selectedDate.toDateString())
                        ?.students.filter(s => s.status === 'P').length || 0}
                    </span>
                  </div>
                  <div className="summary-stat warning">
                    <span className="summary-label">Late:</span>
                    <span className="summary-value">
                      {detailedAttendanceByDate
                        .find(d => d.date.toDateString() === selectedDate.toDateString())
                        ?.students.filter(s => s.status === 'L').length || 0}
                    </span>
                  </div>
                  <div className="summary-stat danger">
                    <span className="summary-label">Absent:</span>
                    <span className="summary-value">
                      {detailedAttendanceByDate
                        .find(d => d.date.toDateString() === selectedDate.toDateString())
                        ?.students.filter(s => s.status === 'A').length || 0}
                    </span>
                  </div>
                  <div className="summary-stat info">
                    <span className="summary-label">Total Students:</span>
                    <span className="summary-value">
                      {detailedAttendanceByDate
                        .find(d => d.date.toDateString() === selectedDate.toDateString())
                        ?.students.length || 0}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="content-card">
              <p style={{textAlign: 'center', color: '#94a3b8', padding: '40px'}}>
                No attendance records found.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TeacherAttendance;