import React, { useState } from 'react';
import './MyStudents.css';

const MyStudents = () => {
  const [activeBatch, setActiveBatch] = useState('B1');
  const [searchTerm, setSearchTerm] = useState('');

  // Sample data structure
  const batches = [
    {
      id: 'B1',
      name: 'Batch B1 - Full Stack Development',
      subject: 'Full Stack Development',
      time: '10:00 AM - 11:30 AM',
      totalStudents: 20,
      presentToday: 18,
      averageAttendance: 94,
      performance: 'Excellent',
      teacher: 'Prof. Smith'
    },
    {
      id: 'B2',
      name: 'Batch B2 - Software Engineering',
      subject: 'Software Engineering',
      time: '11:30 AM - 1:00 PM',
      totalStudents: 18,
      presentToday: 16,
      averageAttendance: 89,
      performance: 'Good',
      teacher: 'Prof. Smith'
    },
    {
      id: 'B3',
      name: 'Batch B3 - Database Systems',
      subject: 'Database Systems',
      time: '2:00 PM - 3:30 PM',
      totalStudents: 22,
      presentToday: 21,
      averageAttendance: 96,
      performance: 'Excellent',
      teacher: 'Prof. Smith'
    },
    {
      id: 'A1',
      name: 'Batch A1 - Computer Networks',
      subject: 'Computer Networks',
      time: '3:30 PM - 5:00 PM',
      totalStudents: 25,
      presentToday: 23,
      averageAttendance: 92,
      performance: 'Very Good',
      teacher: 'Prof. Smith'
    }
  ];

  const studentsData = {
    'B1': [
      { id: 'A1001', name: 'Ayush Sharma', attendance: 96, overallScore: 88, status: 'Present', email: 'ayush.sharma@edu.in', phone: '+91 98765 43210', lastActivity: 'Today, 10:15 AM' },
      { id: 'A1002', name: 'Priya Singh', attendance: 92, overallScore: 94, status: 'Present', email: 'priya.singh@edu.in', phone: '+91 98765 43211', lastActivity: 'Today, 10:10 AM' },
      { id: 'A1003', name: 'Rahul Verma', attendance: 88, overallScore: 76, status: 'Present', email: 'rahul.verma@edu.in', phone: '+91 98765 43212', lastActivity: 'Today, 10:20 AM' },
      { id: 'A1004', name: 'Naya Patel', attendance: 100, overallScore: 92, status: 'Present', email: 'naya.patel@edu.in', phone: '+91 98765 43213', lastActivity: 'Today, 10:05 AM' },
      { id: 'A1005', name: 'Aswin Kumar', attendance: 84, overallScore: 82, status: 'Absent', email: 'aswin.kumar@edu.in', phone: '+91 98765 43214', lastActivity: 'Yesterday, 3:45 PM' },
      { id: 'A1006', name: 'Shah Rukh', attendance: 79, overallScore: 68, status: 'Present', email: 'shah.rukh@edu.in', phone: '+91 98765 43215', lastActivity: 'Today, 10:18 AM' },
      { id: 'A1007', name: 'Dhurv Mehta', attendance: 95, overallScore: 89, status: 'Present', email: 'dhurv.mehta@edu.in', phone: '+91 98765 43216', lastActivity: 'Today, 10:12 AM' },
      { id: 'A1008', name: 'Ram Krishnan', attendance: 91, overallScore: 85, status: 'Late', email: 'ram.krishnan@edu.in', phone: '+91 98765 43217', lastActivity: 'Today, 10:25 AM' }
    ],
    'B2': [
      { id: 'B2001', name: 'Karan Johar', attendance: 94, overallScore: 91, status: 'Present', email: 'karan.johar@edu.in', phone: '+91 98765 43218', lastActivity: 'Today, 11:35 AM' },
      { id: 'B2002', name: 'Simran Kaur', attendance: 89, overallScore: 87, status: 'Present', email: 'simran.kaur@edu.in', phone: '+91 98765 43219', lastActivity: 'Today, 11:40 AM' },
      { id: 'B2003', name: 'Vikram Singh', attendance: 86, overallScore: 79, status: 'Absent', email: 'vikram.singh@edu.in', phone: '+91 98765 43220', lastActivity: 'Yesterday, 4:20 PM' },
      { id: 'B2004', name: 'Anjali Sharma', attendance: 97, overallScore: 93, status: 'Present', email: 'anjali.sharma@edu.in', phone: '+91 98765 43221', lastActivity: 'Today, 11:32 AM' }
    ],
    'B3': [
      { id: 'C3001', name: 'Rohan Malhotra', attendance: 98, overallScore: 90, status: 'Present', email: 'rohan.malhotra@edu.in', phone: '+91 98765 43222', lastActivity: 'Today, 2:05 PM' },
      { id: 'C3002', name: 'Sneha Reddy', attendance: 95, overallScore: 88, status: 'Present', email: 'sneha.reddy@edu.in', phone: '+91 98765 43223', lastActivity: 'Today, 2:10 PM' },
      { id: 'C3003', name: 'Arjun Kapoor', attendance: 92, overallScore: 84, status: 'Present', email: 'arjun.kapoor@edu.in', phone: '+91 98765 43224', lastActivity: 'Today, 2:15 PM' }
    ],
    'A1': [
      { id: 'D4001', name: 'Meera Iyer', attendance: 96, overallScore: 92, status: 'Present', email: 'meera.iyer@edu.in', phone: '+91 98765 43225', lastActivity: 'Today, 3:35 PM' },
      { id: 'D4002', name: 'Aditya Rao', attendance: 90, overallScore: 86, status: 'Present', email: 'aditya.rao@edu.in', phone: '+91 98765 43226', lastActivity: 'Today, 3:40 PM' },
      { id: 'D4003', name: 'Pooja Gupta', attendance: 94, overallScore: 89, status: 'Present', email: 'pooja.gupta@edu.in', phone: '+91 98765 43227', lastActivity: 'Today, 3:45 PM' }
    ]
  };

  const currentBatch = batches.find(batch => batch.id === activeBatch);
  const currentStudents = studentsData[activeBatch] || [];

  const filteredStudents = currentStudents.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'Present': return 'getStatusColor-Present';
      case 'Absent': return 'getStatusColor-Absent';
      case 'Late': return 'getStatusColor-Late';
      default: return 'getStatusColor-Present';
    }
  };

  const getPerformanceColor = (score) => {
    if (score >= 90) return 'getPerformanceColor-90';
    if (score >= 75) return 'getPerformanceColor-75';
    return 'getPerformanceColor-low';
  };

  const getAttendanceColor = (attendance) => {
    if (attendance >= 90) return 'getAttendanceColor-90';
    if (attendance >= 80) return 'getAttendanceColor-80';
    return 'getAttendanceColor-low';
  };

  const getAvatarColor = (name) => {
    const colors = [
      'linear-gradient(135deg, #8b5cf6, #06b6d4)',
      'linear-gradient(135deg, #ef4444, #dc2626)',
      'linear-gradient(135deg, #10b981, #059669)',
      'linear-gradient(135deg, #f59e0b, #d97706)',
      'linear-gradient(135deg, #3b82f6, #2563eb)',
      'linear-gradient(135deg, #ec4899, #db2777)',
      'linear-gradient(135deg, #6366f1, #4f46e5)',
      'linear-gradient(135deg, #14b8a6, #0d9488)'
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <div className="my-students-container">
      {/* Header */}
      <div className="students-header">
        <div className="header-content">
          <h1>My Students</h1>
          <p>Manage and monitor all students across your classes</p>
        </div>
        <div className="header-stats">
          <div className="stat-item">
            <div className="stat-value">{batches.reduce((sum, batch) => sum + batch.totalStudents, 0)}</div>
            <div className="stat-label">Total Students</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{batches.reduce((sum, batch) => sum + batch.presentToday, 0)}</div>
            <div className="stat-label">Present Today</div>
          </div>
        </div>
      </div>

      {/* Batch Selection */}
      <div className="batch-selection">
        <h3>Select Batch</h3>
        <div className="batch-grid">
          {batches.map((batch) => (
            <div
              key={batch.id}
              className={`batch-card ${activeBatch === batch.id ? 'active' : ''}`}
              onClick={() => setActiveBatch(batch.id)}
            >
              <div className="batch-header">
                <span className="batch-id">{batch.id}</span>
                <span className="batch-performance" style={{ color: batch.averageAttendance >= 90 ? '#22c55e' : batch.averageAttendance >= 80 ? '#f59e0b' : '#ef4444' }}>
                  {batch.performance}
                </span>
              </div>
              <h4 className="batch-name">{batch.subject}</h4>
              <div className="batch-time">{batch.time}</div>
              <div className="batch-stats">
                <div className="batch-stat">
                  <span className="stat-number">{batch.totalStudents}</span>
                  <span className="stat-label">Students</span>
                </div>
                <div className="batch-stat">
                  <span className="stat-number" style={{ color: getAttendanceColor(batch.averageAttendance) }}>
                    {batch.averageAttendance}%
                  </span>
                  <span className="stat-label">Attendance</span>
                </div>
                <div className="batch-stat">
                  <span className="stat-number">{batch.presentToday}</span>
                  <span className="stat-label">Present</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Batch Details */}
      {currentBatch && (
        <div className="batch-details">
          <div className="batch-info-header">
            <div className="batch-title">
              <h2>{currentBatch.name}</h2>
              <span className="batch-time-badge">{currentBatch.time}</span>
            </div>
            <div className="batch-overview">
              <div className="overview-item">
                <div className="overview-value">{currentBatch.totalStudents}</div>
                <div className="overview-label">Total Students</div>
              </div>
              <div className="overview-item">
                <div className="overview-value" style={{ color: '#22c55e' }}>{currentBatch.presentToday}</div>
                <div className="overview-label">Present Today</div>
              </div>
              <div className="overview-item">
                <div className="overview-value" style={{ color: '#ef4444' }}>
                  {currentBatch.totalStudents - currentBatch.presentToday}
                </div>
                <div className="overview-label">Absent Today</div>
              </div>
              <div className="overview-item">
                <div className="overview-value" style={{ color: getAttendanceColor(currentBatch.averageAttendance) }}>
                  {currentBatch.averageAttendance}%
                </div>
                <div className="overview-label">Average Attendance</div>
              </div>
            </div>
          </div>

          {/* Students List */}
          <div className="students-section">
            <div className="section-header">
              <h3>Students List</h3>
              <div className="section-actions">
                <div className="search-box">
                  <input
                    type="text"
                    placeholder="Search students..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                  <span className="search-icon">🔍</span>
                </div>
                <button className="btn-primary">Add Student</button>
                <button className="btn-secondary">Export List</button>
              </div>
            </div>

            <div className="students-grid">
              {filteredStudents.map((student) => (
                <div key={student.id} className="student-card">
                  <div className="student-header">
                    <div 
                      className="student-avatar"
                      style={{ background: getAvatarColor(student.name) }}
                    >
                      {student.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="student-basic-info">
                      <h4 className="student-name">{student.name}</h4>
                      <span className="student-id">{student.id}</span>
                    </div>
                    <div 
                      className={`status-badge ${getStatusColor(student.status)}`}
                    >
                      {student.status}
                    </div>
                  </div>

                  <div className="student-stats">
                    <div className="student-stat">
                      <span className="stat-label">Attendance</span>
                      <span 
                        className={`stat-value ${getAttendanceColor(student.attendance)}`}
                      >
                        {student.attendance}%
                      </span>
                    </div>
                    <div className="student-stat">
                      <span className="stat-label">Overall Score</span>
                      <span 
                        className={`stat-value ${getPerformanceColor(student.overallScore)}`}
                      >
                        {student.overallScore}%
                      </span>
                    </div>
                  </div>

                  <div className="student-contact">
                    <div className="contact-item">
                      <span className="contact-icon">📧</span>
                      <span className="contact-info">{student.email}</span>
                    </div>
                    <div className="contact-item">
                      <span className="contact-icon">📱</span>
                      <span className="contact-info">{student.phone}</span>
                    </div>
                  </div>

                  <div className="student-actions">
                    <button className="btn-action view">View Profile</button>
                    <button className="btn-action message">Message</button>
                    <button className="btn-action more">⋯</button>
                  </div>

                  <div className="last-activity">
                    Last activity: {student.lastActivity}
                  </div>
                </div>
              ))}
            </div>

            {filteredStudents.length === 0 && (
              <div className="no-students">
                <div className="no-students-icon">👨‍🎓</div>
                <h3>No students found</h3>
                <p>Try adjusting your search terms</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="actions-grid">
          <button className="action-card">
            <span className="action-icon">📝</span>
            <span className="action-text">Mark Attendance</span>
          </button>
          <button className="action-card">
            <span className="action-icon">📊</span>
            <span className="action-text">View Reports</span>
          </button>
          <button className="action-card">
            <span className="action-icon">📧</span>
            <span className="action-text">Send Bulk Message</span>
          </button>
          <button className="action-card">
            <span className="action-icon">👥</span>
            <span className="action-text">Manage Groups</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyStudents;