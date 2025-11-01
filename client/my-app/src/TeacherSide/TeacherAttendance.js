import React, { useState } from 'react';
import './TeacherAttendance.css';

const students = [
  "Naya", "Ayush", "Aswin", "Shah", "Dhurv", "Ram", "Khari", "Ishaan", "Atharv", "Agastya",
  "Dhruv", "Aarna", "Jai", "Kanan", "Amar", "Reyansh", "Ahana", "Ambar", "Nila", "Sahana", "Tenzin"
];

const dates = ["Oct 16", "Oct 17", "Oct 18", "Oct 19", "Oct 20"];

const attendanceData = students.map((name, idx) => ({
  name,
  id: `A10${(idx+1).toString().padStart(2,'0')}`,
  attendance: Array(5).fill("P"),
  absences: 0,
  late: 0
}));

// Update specific student attendance data
attendanceData[3].attendance = ["P", "A", "P", "P", "A"]; // Shah
attendanceData[3].absences = 2;
attendanceData[8].attendance = ["L", "P", "P", "L", "L"]; // Atharv
attendanceData[8].late = 3;

const TeacherAttendance = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedMonth, setSelectedMonth] = useState('October 2023');

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

  const monthlyData = [
    { month: 'October 2023', rate: 94 },
    { month: 'September 2023', rate: 92 },
    { month: 'August 2023', rate: 88 },
    { month: 'July 2023', rate: 91 }
  ];

  const classSections = [
    { name: 'Section A1', teacher: 'Your Class', rate: 94 },
    { name: 'Section A2', teacher: 'Taught by Prof. Johnson', rate: 92 },
    { name: 'Section A3', teacher: 'Taught by Prof. Williams', rate: 88 },
    { name: 'Section A4', teacher: 'Taught by Prof. Davis', rate: 86 }
  ];

  // Today's attendance status for demonstration
  const todaysAttendance = students.map((student, index) => ({
    name: student,
    initials: student.split(' ').map(n => n[0]).join(''),
    status: index === 3 ? 'absent' : index === 8 ? 'late' : 'present'
  }));

  return (
    <div className="teacher-attendance">
      {/* Header Section */}
      <div className="attendance-header">
        <div className="header-content">
          <h1>📊 Class A1 Attendance</h1>
          <p>Track and manage student attendance with real-time insights and analytics</p>
        </div>
        <div className="header-actions">
          <button className="btn-export">📥 Export Report</button>
        </div>
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
          {/* Stats Cards */}
          <div className="stats-grid">
            <div className="stat-card primary">
              <div className="stat-value">94%</div>
              <div className="stat-label">Overall Attendance Rate</div>
              <div className="stat-subtext">Excellent performance this month</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">18</div>
              <div className="stat-label">Students Present Today</div>
              <div className="stat-subtext">Out of 21 total students</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">2</div>
              <div className="stat-label">Students Absent Today</div>
              <div className="stat-subtext">Need to follow up</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">1</div>
              <div className="stat-label">Late Arrivals Today</div>
              <div className="stat-subtext">1 student arrived late</div>
            </div>
          </div>

          {/* Action Button */}
          <div className="action-section">
            <button className="btn-mark-attendance">
              ✅ Mark Today's Attendance
            </button>
          </div>

          <div className="content-grid">
            {/* Class Sections */}
            <div className="content-card">
              <div className="card-header">
                <h3>🏫 Class Sections Summary</h3>
                <span className="view-all">View All →</span>
              </div>
              <div className="sections-list">
                {classSections.map((section, index) => (
                  <div key={index} className="section-item">
                    <div className="section-info">
                      <div className="section-name">{section.name}</div>
                      <div className="section-teacher">{section.teacher}</div>
                    </div>
                    <div className="section-rate">{section.rate}%</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Today's Attendance */}
            <div className="content-card">
              <div className="card-header">
                <h3>📅 Today's Attendance - Class A1</h3>
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
              <h3>📈 Monthly Overview - Class A1</h3>
              <div className="monthly-list">
                {monthlyData.map((monthData, index) => (
                  <div key={index} className="monthly-item">
                    <span>{monthData.month}</span>
                    <span className="monthly-rate">{monthData.rate}%</span>
                  </div>
                ))}
              </div>
              <button className="btn-view-history">📚 View Complete History</button>
            </div>
          </div>
        </div>
      )}

      {/* Detailed Tab Content */}
      {activeTab === 'detailed' && (
        <div className="tab-content">
          <div className="content-card">
            <h3 style={{marginBottom: '20px', color: '#f0f4ff'}}>📋 Detailed Attendance Records</h3>
            <div className="table-container">
              <table className="attendance-table">
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>Student ID</th>
                    {dates.map(date => (
                      <th key={date}>{date}</th>
                    ))}
                    <th>Overall %</th>
                    <th>Absences</th>
                    <th>Late Arrivals</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceData.map(student => {
                    const overall = getOverallAttendance(student.attendance);
                    return (
                      <tr key={student.id}>
                        <td className="student-name-cell">{student.name}</td>
                        <td>{student.id}</td>
                        {student.attendance.map((val, idx) => (
                          <td 
                            key={idx} 
                            className="attendance-cell"
                            style={{ color: getAttendanceColor(val) }}
                            title={`${dates[idx]}: ${getAttendanceLabel(val)}`}
                          >
                            {val}
                          </td>
                        ))}
                        <td className={`overall-cell ${overall >= 95 ? 'perfect' : overall >= 85 ? 'good' : ''}`}>
                          {overall}%
                        </td>
                        <td style={{color: student.absences > 0 ? '#ef4444' : '#10b981', fontWeight: '600'}}>
                          {student.absences}
                        </td>
                        <td style={{color: student.late > 0 ? '#f59e0b' : '#10b981', fontWeight: '600'}}>
                          {student.late}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherAttendance;