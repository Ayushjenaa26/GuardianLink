import React, { useState } from 'react';
import './MarksKt.css';

const MarksKT = () => {
  const [activeSubject, setActiveSubject] = useState('Full Stack Development');
  const [activeTab, setActiveTab] = useState('overview');

  // Sample data structure
  const subjects = [
    {
      name: 'Full Stack Development',
      code: 'CS501',
      students: 30,
      assignments: 5,
      exams: 2
    },
    {
      name: 'Software Engineering',
      code: 'CS502',
      students: 28,
      assignments: 4,
      exams: 2
    },
    {
      name: 'Database Systems',
      code: 'CS503',
      students: 32,
      assignments: 3,
      exams: 1
    }
  ];

  const studentsData = [
    {
      id: 'A1001',
      name: 'Naya',
      attendance: 95,
      assignments: [85, 92, 78, 88, 90],
      exams: [82, 85],
      ktStatus: 'Clear',
      overall: 86,
      trend: 'improving'
    },
    {
      id: 'A1002',
      name: 'Ayush',
      attendance: 88,
      assignments: [92, 95, 90, 88, 94],
      exams: [89, 92],
      ktStatus: 'Clear',
      overall: 91,
      trend: 'consistent'
    },
    {
      id: 'A1003',
      name: 'Aswin',
      attendance: 92,
      assignments: [78, 82, 75, 80, 85],
      exams: [72, 78],
      ktStatus: 'Clear',
      overall: 78,
      trend: 'improving'
    },
    {
      id: 'A1004',
      name: 'Shah',
      attendance: 76,
      assignments: [45, 52, 58, 48, 55],
      exams: [42, 48],
      ktStatus: 'KT Pending',
      overall: 49,
      trend: 'declining'
    },
    {
      id: 'A1005',
      name: 'Dhurv',
      attendance: 94,
      assignments: [88, 85, 90, 87, 89],
      exams: [84, 86],
      ktStatus: 'Clear',
      overall: 87,
      trend: 'consistent'
    },
    {
      id: 'A1006',
      name: 'Ram',
      attendance: 89,
      assignments: [65, 68, 72, 70, 75],
      exams: [62, 65],
      ktStatus: 'At Risk',
      overall: 68,
      trend: 'improving'
    },
    {
      id: 'A1007',
      name: 'Khari',
      attendance: 91,
      assignments: [92, 94, 90, 93, 95],
      exams: [91, 94],
      ktStatus: 'Clear',
      overall: 93,
      trend: 'consistent'
    },
    {
      id: 'A1008',
      name: 'Ishaan',
      attendance: 83,
      assignments: [55, 58, 52, 60, 56],
      exams: [48, 52],
      ktStatus: 'KT Pending',
      overall: 54,
      trend: 'declining'
    }
  ];

  const performanceTrends = {
    'Full Stack Development': {
      averageScore: 76,
      topPerformer: 'Khari (93%)',
      needsAttention: ['Shah', 'Ishaan', 'Ram'],
      improvementRate: '+8%',
      ktStudents: 2,
      assignmentCompletion: 94
    },
    'Software Engineering': {
      averageScore: 72,
      topPerformer: 'Ayush (88%)',
      needsAttention: ['Rahul', 'Priya', 'Ankit'],
      improvementRate: '+5%',
      ktStudents: 3,
      assignmentCompletion: 91
    },
    'Database Systems': {
      averageScore: 79,
      topPerformer: 'Naya (92%)',
      needsAttention: ['Vikram', 'Sneha'],
      improvementRate: '+12%',
      ktStudents: 1,
      assignmentCompletion: 96
    }
  };

  const getPerformanceColor = (score) => {
    if (score >= 80) return '#22c55e';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'improving': return '📈';
      case 'declining': return '📉';
      case 'consistent': return '➡️';
      default: return '➡️';
    }
  };

  const getKTStatusColor = (status) => {
    switch (status) {
      case 'Clear': return 'getKTStatusColor-Clear';
      case 'At Risk': return 'getKTStatusColor-Risk';
      case 'KT Pending': return 'getKTStatusColor-Pending';
      default: return '#6b7280';
    }
  };

  const getPerformanceColorClass = (score) => {
    if (score >= 80) return 'getPerformanceColor-80';
    if (score >= 60) return 'getPerformanceColor-60';
    return 'getPerformanceColor-low';
  };

  const currentTrends = performanceTrends[activeSubject];

  // Function to generate random color for avatars
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
    <div className="marks-kt-container">
      {/* Header */}
      <div className="marks-header">
        <div className="header-content">
          <h1>Marks & KT Management</h1>
          <p>Track student performance and manage KT records</p>
        </div>
        <div className="header-actions">
          <button className="btn-primary">Add New Marks</button>
          <button className="btn-secondary">Export Report</button>
        </div>
      </div>

      {/* Subject Selection */}
      <div className="subject-selector">
        {subjects.map((subject, index) => (
          <button
            key={index}
            className={`subject-btn ${activeSubject === subject.name ? 'active' : ''}`}
            onClick={() => setActiveSubject(subject.name)}
          >
            <span className="subject-name">{subject.name}</span>
            <span className="subject-code">{subject.code}</span>
            <span className="student-count">{subject.students} students</span>
          </button>
        ))}
      </div>

      {/* Navigation Tabs */}
      <div className="marks-tabs">
        <button 
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Performance Overview
        </button>
        <button 
          className={`tab-btn ${activeTab === 'students' ? 'active' : ''}`}
          onClick={() => setActiveTab('students')}
        >
          👨‍🎓 Student Details
        </button>
        <button 
          className={`tab-btn ${activeTab === 'trends' ? 'active' : ''}`}
          onClick={() => setActiveTab('trends')}
        >
          📈 Performance Trends
        </button>
        <button 
          className={`tab-btn ${activeTab === 'kt' ? 'active' : ''}`}
          onClick={() => setActiveTab('kt')}
        >
          ⚠️ KT Management
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="tab-content">
          {/* Key Metrics */}
          <div className="metrics-grid">
            <div className="metric-card primary">
              <div className="metric-value">{currentTrends.averageScore}%</div>
              <div className="metric-label">Class Average</div>
              <div className="metric-trend positive">+2.1% from last month</div>
            </div>
            <div className="metric-card">
              <div className="metric-value">{currentTrends.ktStudents}</div>
              <div className="metric-label">KT Students</div>
              <div className="metric-trend">Need attention</div>
            </div>
            <div className="metric-card">
              <div className="metric-value">{currentTrends.assignmentCompletion}%</div>
              <div className="metric-label">Assignment Completion</div>
              <div className="metric-trend positive">+5% improvement</div>
            </div>
            <div className="metric-card">
              <div className="metric-value">{currentTrends.improvementRate}</div>
              <div className="metric-label">Overall Improvement</div>
              <div className="metric-trend positive">This semester</div>
            </div>
          </div>

          {/* Performance Distribution */}
          <div className="content-grid">
            <div className="content-card">
              <h3>Performance Distribution</h3>
              <div className="distribution-chart">
                <div className="dist-bar">
                  <span>Excellent (80-100%)</span>
                  <div className="bar-container">
                    <div className="bar-fill excellent" style={{width: '40%'}}></div>
                  </div>
                  <span>40%</span>
                </div>
                <div className="dist-bar">
                  <span>Good (60-79%)</span>
                  <div className="bar-container">
                    <div className="bar-fill good" style={{width: '35%'}}></div>
                  </div>
                  <span>35%</span>
                </div>
                <div className="dist-bar">
                  <span>Needs Improvement (&lt;60%)</span>
                  <div className="bar-container">
                    <div className="bar-fill poor" style={{width: '25%'}}></div>
                  </div>
                  <span>25%</span>
                </div>
              </div>
            </div>

            <div className="content-card">
              <h3>Students Needing Attention</h3>
              <div className="attention-list">
                {currentTrends.needsAttention.map((student, index) => (
                  <div key={index} className="attention-item">
                    <div 
                      className="student-avatar" 
                      style={{background: getAvatarColor(student)}}
                    >
                      {student.charAt(0)}
                    </div>
                    <div className="student-info">
                      <div className="student-name">{student}</div>
                      <div className="student-status">Low performance</div>
                    </div>
                    <button className="btn-action">Contact</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Student Details Tab */}
      {activeTab === 'students' && (
        <div className="tab-content">
          <div className="content-card">
            <div className="table-header">
              <h3>Student Performance - {activeSubject}</h3>
              <div className="table-actions">
                <input type="text" placeholder="Search students..." className="search-input" />
                <select className="filter-select">
                  <option>All Students</option>
                  <option>KT Students</option>
                  <option>Top Performers</option>
                </select>
              </div>
            </div>
            <div className="table-container">
              <table className="performance-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Attendance</th>
                    <th>Assignments Avg</th>
                    <th>Exam Scores</th>
                    <th>Overall %</th>
                    <th>KT Status</th>
                    <th>Trend</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {studentsData.map((student) => {
                    const assignmentsAvg = Math.round(student.assignments.reduce((a, b) => a + b, 0) / student.assignments.length);
                    const examAvg = Math.round(student.exams.reduce((a, b) => a + b, 0) / student.exams.length);
                    
                    return (
                      <tr key={student.id}>
                        <td className="student-cell">
                          <div 
                            className="student-avatar-small" 
                            style={{background: getAvatarColor(student.name)}}
                          >
                            {student.name.charAt(0)}
                          </div>
                          <div>
                            <div className="student-name">{student.name}</div>
                            <div className="student-id">{student.id}</div>
                          </div>
                        </td>
                        <td>
                          <div className="attendance-display">
                            {student.attendance}%
                          </div>
                        </td>
                        <td>
                          <div 
                            className={`score-display ${getPerformanceColorClass(assignmentsAvg)}`}
                          >
                            {assignmentsAvg}%
                          </div>
                        </td>
                        <td>
                          <div className="exam-scores">
                            {student.exams.map((score, idx) => (
                              <span 
                                key={idx}
                                className={`exam-score ${getPerformanceColorClass(score)}`}
                              >
                                {score}%
                              </span>
                            ))}
                          </div>
                        </td>
                        <td>
                          <div 
                            className={`overall-score ${getPerformanceColorClass(student.overall)}`}
                          >
                            {student.overall}%
                          </div>
                        </td>
                        <td>
                          <span 
                            className={`kt-badge ${getKTStatusColor(student.ktStatus)}`}
                          >
                            {student.ktStatus}
                          </span>
                        </td>
                        <td>
                          <span className="trend-indicator">
                            {getTrendIcon(student.trend)}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button className="btn-small">Edit</button>
                            <button className="btn-small">Message</button>
                          </div>
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

      {/* Trends Tab */}
      {activeTab === 'trends' && (
        <div className="tab-content">
          <div className="content-grid">
            <div className="content-card">
              <h3>Subject-wise Comparison</h3>
              <div className="comparison-chart">
                {subjects.map((subject, index) => {
                  const trend = performanceTrends[subject.name];
                  return (
                    <div key={index} className="comparison-item">
                      <div className="subject-comparison">
                        <span className="subject-name">{subject.name}</span>
                        <span className="subject-average">{trend.averageScore}%</span>
                      </div>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill"
                          style={{
                            width: `${trend.averageScore}%`,
                            background: getPerformanceColor(trend.averageScore)
                          }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="content-card">
              <h3>Monthly Performance Trend</h3>
              <div className="monthly-trend">
                <div className="trend-bars">
                  {[65, 72, 68, 76, 74, 79].map((score, index) => (
                    <div key={index} className="trend-bar">
                      <div 
                        className="trend-value"
                        style={{
                          height: `${score}%`,
                          background: getPerformanceColor(score)
                        }}
                      ></div>
                      <span className="month-label">{['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][index]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="content-card">
            <h3>Assignment Completion Rates</h3>
            <div className="assignment-grid">
              {[1, 2, 3, 4, 5].map((assignment) => (
                <div key={assignment} className="assignment-card">
                  <h4>Assignment {assignment}</h4>
                  <div className="completion-rate">92%</div>
                  <div className="avg-score">Avg: 78%</div>
                  <div className="submission-stats">
                    <span>28/30 Submitted</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* KT Management Tab */}
      {activeTab === 'kt' && (
        <div className="tab-content">
          <div className="content-grid">
            <div className="content-card">
              <h3>KT Students - Immediate Action Required</h3>
              <div className="kt-list">
                {studentsData
                  .filter(student => student.ktStatus === 'KT Pending')
                  .map((student, index) => (
                    <div key={index} className="kt-item urgent">
                      <div className="kt-student-info">
                        <div 
                          className="student-avatar" 
                          style={{background: getAvatarColor(student.name)}}
                        >
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <div className="student-name">{student.name} ({student.id})</div>
                          <div className="kt-reason">Multiple assignment failures</div>
                        </div>
                      </div>
                      <div className="kt-details">
                        <span>Overall: {student.overall}%</span>
                        <span>Attendance: {student.attendance}%</span>
                      </div>
                      <div className="kt-actions">
                        <button className="btn-warning">Schedule Remedial</button>
                        <button className="btn-secondary">Contact Parent</button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="content-card">
              <h3>At-Risk Students</h3>
              <div className="kt-list">
                {studentsData
                  .filter(student => student.ktStatus === 'At Risk')
                  .map((student, index) => (
                    <div key={index} className="kt-item warning">
                      <div className="kt-student-info">
                        <div 
                          className="student-avatar" 
                          style={{background: getAvatarColor(student.name)}}
                        >
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <div className="student-name">{student.name} ({student.id})</div>
                          <div className="kt-reason">Borderline scores</div>
                        </div>
                      </div>
                      <div className="kt-details">
                        <span>Overall: {student.overall}%</span>
                        <span>Need: +5% to clear</span>
                      </div>
                      <div className="kt-actions">
                        <button className="btn-action">Extra Classes</button>
                        <button className="btn-secondary">Monitor</button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          <div className="content-card">
            <h3>KT Clearance Progress</h3>
            <div className="clearance-stats">
              <div className="clearance-item">
                <span>Total KT Students</span>
                <span className="stat-value">3</span>
              </div>
              <div className="clearance-item">
                <span>Cleared This Month</span>
                <span className="stat-value positive">2</span>
              </div>
              <div className="clearance-item">
                <span>Pending Clearance</span>
                <span className="stat-value warning">1</span>
              </div>
              <div className="clearance-item">
                <span>Success Rate</span>
                <span className="stat-value positive">85%</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarksKT;