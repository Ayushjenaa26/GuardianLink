import React, { useState } from 'react';
import './BehaviorReports.css';

const BehaviorReports = () => {
  const [activeBatch, setActiveBatch] = useState('B1');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Batch data
  const batches = [
    {
      id: 'B1',
      name: 'Batch B1 - Full Stack Development',
      subject: 'Full Stack Development',
      totalStudents: 20,
      avgBehaviorScore: 4.2,
      issuesThisMonth: 3,
      topPerformers: 15,
      needsAttention: 2
    },
    {
      id: 'B2',
      name: 'Batch B2 - Software Engineering',
      subject: 'Software Engineering',
      totalStudents: 18,
      avgBehaviorScore: 3.8,
      issuesThisMonth: 5,
      topPerformers: 12,
      needsAttention: 3
    },
    {
      id: 'B3',
      name: 'Batch B3 - Database Systems',
      subject: 'Database Systems',
      totalStudents: 22,
      avgBehaviorScore: 4.5,
      issuesThisMonth: 1,
      topPerformers: 18,
      needsAttention: 1
    },
    {
      id: 'A1',
      name: 'Batch A1 - Computer Networks',
      subject: 'Computer Networks',
      totalStudents: 25,
      avgBehaviorScore: 3.9,
      issuesThisMonth: 4,
      topPerformers: 16,
      needsAttention: 4
    }
  ];

  // Behavior data for each batch
  const behaviorData = {
    'B1': [
      {
        id: 'A1001',
        name: 'Ayush Sharma',
        behaviorScore: 4.8,
        attentiveness: 'Excellent',
        participation: 'High',
        issues: [],
        lastIncident: 'None',
        classDisruptions: 0,
        homeworkCompletion: 98,
        overallRating: 'Excellent',
        trends: 'improving',
        strengths: ['Active participation', 'Helps peers', 'Punctual'],
        improvements: ['None']
      },
      {
        id: 'A1002',
        name: 'Priya Singh',
        behaviorScore: 4.5,
        attentiveness: 'Very Good',
        participation: 'High',
        issues: [],
        lastIncident: 'None',
        classDisruptions: 0,
        homeworkCompletion: 95,
        overallRating: 'Very Good',
        trends: 'consistent',
        strengths: ['Good listener', 'Completes work on time'],
        improvements: ['Could speak up more']
      },
      {
        id: 'A1003',
        name: 'Rahul Verma',
        behaviorScore: 3.2,
        attentiveness: 'Average',
        participation: 'Medium',
        issues: ['Late submissions', 'Distracts neighbors'],
        lastIncident: '2 days ago',
        classDisruptions: 3,
        homeworkCompletion: 75,
        overallRating: 'Needs Improvement',
        trends: 'declining',
        strengths: ['Creative thinking'],
        improvements: ['Punctuality', 'Focus in class', 'Respect for peers']
      },
      {
        id: 'A1004',
        name: 'Naya Patel',
        behaviorScore: 4.9,
        attentiveness: 'Excellent',
        participation: 'Very High',
        issues: [],
        lastIncident: 'None',
        classDisruptions: 0,
        homeworkCompletion: 100,
        overallRating: 'Excellent',
        trends: 'improving',
        strengths: ['Leadership', 'Teamwork', 'Creativity'],
        improvements: ['None']
      },
      {
        id: 'A1005',
        name: 'Aswin Kumar',
        behaviorScore: 2.8,
        attentiveness: 'Poor',
        participation: 'Low',
        issues: ['Frequent absences', 'Class disruptions', 'Incomplete work'],
        lastIncident: 'Today',
        classDisruptions: 8,
        homeworkCompletion: 60,
        overallRating: 'Concern',
        trends: 'declining',
        strengths: ['Technical skills'],
        improvements: ['Attendance', 'Class behavior', 'Homework completion']
      }
    ],
    'B2': [
      {
        id: 'B2001',
        name: 'Karan Johar',
        behaviorScore: 4.2,
        attentiveness: 'Good',
        participation: 'Medium',
        issues: ['Occasionally late'],
        lastIncident: '1 week ago',
        classDisruptions: 1,
        homeworkCompletion: 88,
        overallRating: 'Good',
        trends: 'improving',
        strengths: ['Good technical skills'],
        improvements: ['Punctuality']
      }
    ]
  };

  // Recent incidents data
  const recentIncidents = [
    {
      id: 1,
      student: 'Aswin Kumar',
      batch: 'B1',
      type: 'Class Disruption',
      severity: 'Medium',
      date: 'Today, 10:30 AM',
      description: 'Repeatedly talking during lecture, distracting other students',
      actionTaken: 'Verbal warning given',
      status: 'Resolved'
    },
    {
      id: 2,
      student: 'Rahul Verma',
      batch: 'B1',
      type: 'Late Submission',
      severity: 'Low',
      date: '2 days ago',
      description: 'Assignment submitted 3 days after deadline',
      actionTaken: 'Points deducted, parent notified',
      status: 'Resolved'
    },
    {
      id: 3,
      student: 'Vikram Singh',
      batch: 'B2',
      type: 'Absenteeism',
      severity: 'High',
      date: '1 week ago',
      description: 'Missed 3 consecutive classes without notice',
      actionTaken: 'Parent meeting scheduled',
      status: 'Pending'
    }
  ];

  const currentBatch = batches.find(batch => batch.id === activeBatch);
  const currentStudents = behaviorData[activeBatch] || [];
  const selectedStudentData = selectedStudent ? 
    currentStudents.find(student => student.id === selectedStudent) : null;

  const getScoreColor = (score) => {
    if (score >= 4.5) return '#22c55e';
    if (score >= 3.5) return '#f59e0b';
    if (score >= 2.5) return '#fb923c';
    return '#ef4444';
  };

  const getRatingColor = (rating) => {
    switch (rating) {
      case 'Excellent': return '#22c55e';
      case 'Very Good': return '#4ade80';
      case 'Good': return '#f59e0b';
      case 'Needs Improvement': return '#fb923c';
      case 'Concern': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'Low': return '#22c55e';
      case 'Medium': return '#f59e0b';
      case 'High': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'improving': return '📈';
      case 'declining': return '📉';
      case 'consistent': return '➡️';
      default: return '➡️';
    }
  };

  const calculateBehaviorStats = (students) => {
    const total = students.length;
    const excellent = students.filter(s => s.behaviorScore >= 4.5).length;
    const good = students.filter(s => s.behaviorScore >= 3.5 && s.behaviorScore < 4.5).length;
    const needsImprovement = students.filter(s => s.behaviorScore >= 2.5 && s.behaviorScore < 3.5).length;
    const concern = students.filter(s => s.behaviorScore < 2.5).length;

    return { total, excellent, good, needsImprovement, concern };
  };

  const behaviorStats = calculateBehaviorStats(currentStudents);

  return (
    <div className="behavior-reports-container">
      {/* Header */}
      <div className="behavior-header">
        <div className="header-content">
          <h1>Behavior Reports</h1>
          <p>Monitor student behavior, attentiveness, and classroom conduct</p>
        </div>
        <div className="header-actions">
          <button className="btn-primary">📝 Log New Incident</button>
          <button className="btn-secondary">📊 Generate Report</button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="behavior-tabs">
        <button 
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📈 Behavior Overview
        </button>
        <button 
          className={`tab-btn ${activeTab === 'students' ? 'active' : ''}`}
          onClick={() => setActiveTab('students')}
        >
          👨‍🎓 Student Behavior
        </button>
        <button 
          className={`tab-btn ${activeTab === 'incidents' ? 'active' : ''}`}
          onClick={() => setActiveTab('incidents')}
        >
          ⚠️ Recent Incidents
        </button>
        <button 
          className={`tab-btn ${activeTab === 'trends' ? 'active' : ''}`}
          onClick={() => setActiveTab('trends')}
        >
          📊 Behavior Trends
        </button>
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
                <div 
                  className="behavior-score"
                  style={{ color: getScoreColor(batch.avgBehaviorScore) }}
                >
                  {batch.avgBehaviorScore}/5
                </div>
              </div>
              <h4 className="batch-name">{batch.subject}</h4>
              <div className="batch-stats">
                <div className="batch-stat">
                  <span className="stat-number">{batch.totalStudents}</span>
                  <span className="stat-label">Students</span>
                </div>
                <div className="batch-stat">
                  <span className="stat-number" style={{ color: '#ef4444' }}>
                    {batch.issuesThisMonth}
                  </span>
                  <span className="stat-label">Issues</span>
                </div>
                <div className="batch-stat">
                  <span className="stat-number" style={{ color: '#22c55e' }}>
                    {batch.topPerformers}
                  </span>
                  <span className="stat-label">Good</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="tab-content">
          {/* Key Metrics */}
          <div className="metrics-grid">
            <div className="metric-card primary">
              <div className="metric-value">{currentBatch.avgBehaviorScore}/5</div>
              <div className="metric-label">Average Behavior Score</div>
              <div className="metric-trend positive">+0.3 from last month</div>
            </div>
            <div className="metric-card">
              <div className="metric-value" style={{ color: '#ef4444' }}>
                {currentBatch.issuesThisMonth}
              </div>
              <div className="metric-label">Issues This Month</div>
              <div className="metric-trend negative">+2 from last month</div>
            </div>
            <div className="metric-card">
              <div className="metric-value" style={{ color: '#22c55e' }}>
                {currentBatch.topPerformers}
              </div>
              <div className="metric-label">Well-Behaved Students</div>
              <div className="metric-trend positive">85% of class</div>
            </div>
            <div className="metric-card">
              <div className="metric-value" style={{ color: '#f59e0b' }}>
                {currentBatch.needsAttention}
              </div>
              <div className="metric-label">Need Attention</div>
              <div className="metric-trend">Monitor closely</div>
            </div>
          </div>

          {/* Behavior Distribution */}
          <div className="content-grid">
            <div className="content-card">
              <h3>Behavior Distribution - {currentBatch.name}</h3>
              <div className="distribution-chart">
                <div className="dist-bar">
                  <span>Excellent (4.5-5.0)</span>
                  <div className="bar-container">
                    <div 
                      className="bar-fill excellent" 
                      style={{ width: `${(behaviorStats.excellent / behaviorStats.total) * 100}%` }}
                    ></div>
                  </div>
                  <span>{behaviorStats.excellent} students</span>
                </div>
                <div className="dist-bar">
                  <span>Good (3.5-4.4)</span>
                  <div className="bar-container">
                    <div 
                      className="bar-fill good" 
                      style={{ width: `${(behaviorStats.good / behaviorStats.total) * 100}%` }}
                    ></div>
                  </div>
                  <span>{behaviorStats.good} students</span>
                </div>
                <div className="dist-bar">
                  <span>Needs Improvement (2.5-3.4)</span>
                  <div className="bar-container">
                    <div 
                      className="bar-fill average" 
                      style={{ width: `${(behaviorStats.needsImprovement / behaviorStats.total) * 100}%` }}
                    ></div>
                  </div>
                  <span>{behaviorStats.needsImprovement} students</span>
                </div>
                <div className="dist-bar">
                  <span>Concern (&lt;2.5)</span>
                  <div className="bar-container">
                    <div 
                      className="bar-fill poor" 
                      style={{ width: `${(behaviorStats.concern / behaviorStats.total) * 100}%` }}
                    ></div>
                  </div>
                  <span>{behaviorStats.concern} students</span>
                </div>
              </div>
            </div>

            <div className="content-card">
              <h3>Students Needing Immediate Attention</h3>
              <div className="attention-list">
                {currentStudents
                  .filter(student => student.behaviorScore < 3.0)
                  .map((student, index) => (
                    <div key={index} className="attention-item urgent">
                      <div className="student-avatar" style={{ background: '#ef4444' }}>
                        {student.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="student-info">
                        <div className="student-name">{student.name}</div>
                        <div className="student-score" style={{ color: getScoreColor(student.behaviorScore) }}>
                          Score: {student.behaviorScore}/5
                        </div>
                        <div className="student-issues">
                          {student.issues.slice(0, 2).join(', ')}
                          {student.issues.length > 2 && ` +${student.issues.length - 2} more`}
                        </div>
                      </div>
                      <button 
                        className="btn-action"
                        onClick={() => setSelectedStudent(student.id)}
                      >
                        View Details
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Students Tab */}
      {activeTab === 'students' && (
        <div className="tab-content">
          <div className="content-card">
            <div className="table-header">
              <h3>Student Behavior - {currentBatch.name}</h3>
              <div className="table-actions">
                <input type="text" placeholder="Search students..." className="search-input" />
                <select className="filter-select">
                  <option>All Students</option>
                  <option>Excellent Behavior</option>
                  <option>Needs Improvement</option>
                  <option>With Issues</option>
                </select>
              </div>
            </div>
            <div className="table-container">
              <table className="behavior-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Behavior Score</th>
                    <th>Attentiveness</th>
                    <th>Participation</th>
                    <th>Class Disruptions</th>
                    <th>Homework Completion</th>
                    <th>Overall Rating</th>
                    <th>Trend</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentStudents.map((student) => (
                    <tr key={student.id}>
                      <td className="student-cell">
                        <div className="student-avatar-small" style={{ background: '#6366f1' }}>
                          {student.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="student-name">{student.name}</div>
                          <div className="student-id">{student.id}</div>
                        </div>
                      </td>
                      <td>
                        <div 
                          className="score-display"
                          style={{ color: getScoreColor(student.behaviorScore) }}
                        >
                          {student.behaviorScore}/5
                        </div>
                      </td>
                      <td>
                        <span className={`attentiveness-badge ${student.attentiveness.toLowerCase().replace(' ', '-')}`}>
                          {student.attentiveness}
                        </span>
                      </td>
                      <td>
                        <span className={`participation-badge ${student.participation.toLowerCase()}`}>
                          {student.participation}
                        </span>
                      </td>
                      <td>
                        <div className="disruptions-count">
                          {student.classDisruptions}
                        </div>
                      </td>
                      <td>
                        <div 
                          className="homework-score"
                          style={{ color: getScoreColor(student.homeworkCompletion / 20) }}
                        >
                          {student.homeworkCompletion}%
                        </div>
                      </td>
                      <td>
                        <span 
                          className="rating-badge"
                          style={{ background: getRatingColor(student.overallRating) }}
                        >
                          {student.overallRating}
                        </span>
                      </td>
                      <td>
                        <span className="trend-indicator">
                          {getTrendIcon(student.trends)}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            className="btn-small"
                            onClick={() => setSelectedStudent(student.id)}
                          >
                            View
                          </button>
                          <button className="btn-small warning">⚠️ Report</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Student Detail Modal */}
      {selectedStudentData && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{selectedStudentData.name} - Behavior Details</h2>
              <button className="close-btn" onClick={() => setSelectedStudent(null)}>×</button>
            </div>
            <div className="modal-body">
              <div className="student-summary">
                <div className="summary-card">
                  <h4>Behavior Score</h4>
                  <div 
                    className="summary-value"
                    style={{ color: getScoreColor(selectedStudentData.behaviorScore) }}
                  >
                    {selectedStudentData.behaviorScore}/5
                  </div>
                </div>
                <div className="summary-card">
                  <h4>Attentiveness</h4>
                  <div className="summary-value">{selectedStudentData.attentiveness}</div>
                </div>
                <div className="summary-card">
                  <h4>Participation</h4>
                  <div className="summary-value">{selectedStudentData.participation}</div>
                </div>
                <div className="summary-card">
                  <h4>Class Disruptions</h4>
                  <div className="summary-value">{selectedStudentData.classDisruptions}</div>
                </div>
              </div>

              <div className="details-grid">
                <div className="detail-section">
                  <h4>Strengths</h4>
                  <div className="tags-list">
                    {selectedStudentData.strengths.map((strength, index) => (
                      <span key={index} className="tag positive">{strength}</span>
                    ))}
                  </div>
                </div>

                <div className="detail-section">
                  <h4>Areas for Improvement</h4>
                  <div className="tags-list">
                    {selectedStudentData.improvements.map((improvement, index) => (
                      <span key={index} className="tag negative">{improvement}</span>
                    ))}
                  </div>
                </div>

                {selectedStudentData.issues.length > 0 && (
                  <div className="detail-section">
                    <h4>Recent Issues</h4>
                    <ul className="issues-list">
                      {selectedStudentData.issues.map((issue, index) => (
                        <li key={index}>⚠️ {issue}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="detail-section">
                  <h4>Last Incident</h4>
                  <p>{selectedStudentData.lastIncident}</p>
                </div>
              </div>

              <div className="modal-actions">
                <button className="btn-primary">Add Behavior Note</button>
                <button className="btn-secondary">Contact Parent</button>
                <button className="btn-warning">Schedule Meeting</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Incidents Tab */}
      {activeTab === 'incidents' && (
        <div className="tab-content">
          <div className="content-card">
            <div className="table-header">
              <h3>Recent Behavior Incidents</h3>
              <button className="btn-primary">+ Log New Incident</button>
            </div>
            <div className="incidents-list">
              {recentIncidents.map((incident) => (
                <div key={incident.id} className="incident-item">
                  <div className="incident-header">
                    <div className="incident-student">
                      <span className="student-name">{incident.student}</span>
                      <span className="batch-badge">{incident.batch}</span>
                    </div>
                    <div className="incident-meta">
                      <span 
                        className="severity-badge"
                        style={{ background: getSeverityColor(incident.severity) }}
                      >
                        {incident.severity}
                      </span>
                      <span className="incident-date">{incident.date}</span>
                    </div>
                  </div>
                  <div className="incident-details">
                    <div className="incident-type">Type: {incident.type}</div>
                    <p className="incident-description">{incident.description}</p>
                    <div className="incident-actions">
                      <span>Action Taken: {incident.actionTaken}</span>
                      <span 
                        className={`status-badge ${incident.status.toLowerCase()}`}
                      >
                        {incident.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Trends Tab */}
      {activeTab === 'trends' && (
        <div className="tab-content">
          <div className="content-grid">
            <div className="content-card">
              <h3>Monthly Behavior Trends</h3>
              <div className="trend-chart">
                <div className="trend-bars">
                  {[
                    { month: 'Jul', score: 3.8 },
                    { month: 'Aug', score: 4.0 },
                    { month: 'Sep', score: 3.9 },
                    { month: 'Oct', score: 4.2 },
                    { month: 'Nov', score: 4.1 },
                    { month: 'Dec', score: 4.3 }
                  ].map((data, index) => (
                    <div key={index} className="trend-bar">
                      <div 
                        className="trend-value"
                        style={{
                          height: `${data.score * 20}%`,
                          background: getScoreColor(data.score)
                        }}
                      ></div>
                      <span className="month-label">{data.month}</span>
                      <span className="score-label">{data.score}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="content-card">
              <h3>Behavior Comparison by Batch</h3>
              <div className="comparison-chart">
                {batches.map((batch, index) => (
                  <div key={index} className="comparison-item">
                    <div className="batch-comparison">
                      <span className="batch-name">{batch.id}</span>
                      <span className="batch-average">{batch.avgBehaviorScore}/5</span>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{
                          width: `${(batch.avgBehaviorScore / 5) * 100}%`,
                          background: getScoreColor(batch.avgBehaviorScore)
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BehaviorReports;