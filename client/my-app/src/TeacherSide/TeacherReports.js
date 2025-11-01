import React from 'react';
import './TeacherReports.css';

const students = [
  {
    name: "Emily Johnson", id: "S1001", grades: { fsd: "A", se: "A", cn: "A", db: "A" }, overall: "A (98%)", attendance: "98%", behavior: "Excellent"
  },
  {
    name: "Michael Rodriguez", id: "S1002", grades: { fsd: "A", se: "A", cn: "A", db: "B" }, overall: "A (96%)", attendance: "96%", behavior: "Good"
  },
  {
    name: "Sarah Chen", id: "S1003", grades: { fsd: "A", se: "A", cn: "B", db: "A" }, overall: "A (95%)", attendance: "97%", behavior: "Good"
  },
  {
    name: "David Wilson", id: "S1004", grades: { fsd: "A", se: "B", cn: "A", db: "A" }, overall: "A (94%)", attendance: "95%", behavior: "Good"
  },
  {
    name: "Amanda Patel", id: "S1005", grades: { fsd: "B", se: "A", cn: "A", db: "B" }, overall: "A (93%)", attendance: "96%", behavior: "Good"
  },
  {
    name: "Thomas Brown", id: "S1006", grades: { fsd: "C", se: "B", cn: "C", db: "B" }, overall: "C (75%)", attendance: "82%", behavior: "Needs Improvement"
  }
];

const behaviorList = [
  { initials: "EJ", name: "Emily Johnson", status: "Excellent" },
  { initials: "MR", name: "Michael Rodriguez", status: "Good" },
  { initials: "TB", name: "Thomas Brown", status: "Needs Improvement" },
  { initials: "JK", name: "Jessica Kim", status: "Good" },
  { initials: "RW", name: "Robert Williams", status: "Concerns" }
];

const subjectPerformance = [
  { icon: "💻", name: "Full Stack Development", percent: "92%" },
  { icon: "🖧", name: "Computer Networks", percent: "88%" },
  { icon: "⚙️", name: "Software Engineering", percent: "85%" },
  { icon: "🗄️", name: "Database Systems", percent: "83%" },
  { icon: "🛡️", name: "Cyber Security", percent: "90%" }
];

const gradeDist = [
  { color: "#22c55e", label: "Grade A (90-100%)", count: 42 },
  { color: "#2563eb", label: "Grade B (80-89%)", count: 65 },
  { color: "#fbbf24", label: "Grade C (70-79%)", count: 48 },
  { color: "#ef4444", label: "Grade D (Below 70%)", count: 25 }
];

const topPerformers = [
  { initials: "EJ", name: "Emily Johnson", percent: "98%" },
  { initials: "MR", name: "Michael Rodriguez", percent: "96%" },
  { initials: "SC", name: "Sarah Chen", percent: "95%" },
  { initials: "DW", name: "David Wilson", percent: "94%" },
  { initials: "AP", name: "Amanda Patel", percent: "93%" }
];

function getGradeColor(grade) {
  if (grade === "A") return "grade-A";
  if (grade === "B") return "grade-B";
  if (grade === "C") return "grade-C";
  return "grade-D";
}

function getBehaviorClass(status) {
  if (status === "Excellent") return "behavior-excellent";
  if (status === "Good") return "behavior-good";
  if (status === "Needs Improvement") return "behavior-improve";
  return "behavior-concern";
}

export default function TeacherReports() {
  return (
    <div className="teacher-reports">
      <div className="reports-container">
        <div className="reports-header">
          <h2>Student Reports</h2>
          <div className="reports-subtitle">Comprehensive overview of student performance and behavior</div>
        </div>

        <h3 className="section-title">Academic Reports</h3>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">🎓</div>
            <div className="stat-value">180</div>
            <div className="stat-label">Total Students</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📈</div>
            <div className="stat-value">87%</div>
            <div className="stat-label">Average Performance</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📋</div>
            <div className="stat-value">12</div>
            <div className="stat-label">Pending Reviews</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">❗</div>
            <div className="stat-value">5</div>
            <div className="stat-label">At-Risk Students</div>
          </div>
        </div>

        <div className="content-grid">
          <div className="content-card">
            <div className="card-header">
              <h4 className="card-title">Grade Distribution</h4>
              <span className="view-link">View Details</span>
            </div>
            <ul className="grade-list">
              {gradeDist.map(g => (
                <li key={g.label} className="grade-item">
                  <span className="grade-color" style={{background: g.color}}></span>
                  <span className="grade-label">{g.label}</span>
                  <span className="grade-count">{g.count} students</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="content-card">
            <div className="card-header">
              <h4 className="card-title">Top Performers</h4>
              <span className="view-link">View All</span>
            </div>
            <ul className="performer-list">
              {topPerformers.map(s => (
                <li key={s.name} className="performer-item">
                  <span className="initials">{s.initials}</span>
                  <span className="student-name">{s.name}</span>
                  <span className="performance-value">{s.percent}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="detailed-reports">
          <div className="card-header">
            <h4 className="card-title">Detailed Student Reports</h4>
            <span className="view-link">Export Full Report</span>
          </div>
          <div className="table-container">
            <table className="reports-table">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Student ID</th>
                  <th>Full Stack Dev</th>
                  <th>Software Eng</th>
                  <th>Computer Networks</th>
                  <th>Database Systems</th>
                  <th>Overall Grade</th>
                  <th>Attendance</th>
                  <th>Behavior</th>
                </tr>
              </thead>
              <tbody>
                {students.map(s => (
                  <tr key={s.id}>
                    <td className="student-name-cell">{s.name}</td>
                    <td>{s.id}</td>
                    <td className={getGradeColor(s.grades.fsd)}>{s.grades.fsd}</td>
                    <td className={getGradeColor(s.grades.se)}>{s.grades.se}</td>
                    <td className={getGradeColor(s.grades.cn)}>{s.grades.cn}</td>
                    <td className={getGradeColor(s.grades.db)}>{s.grades.db}</td>
                    <td className={s.overall.startsWith('A') ? 'grade-A' : 'grade-C'}>{s.overall}</td>
                    <td>{s.attendance}</td>
                    <td>
                      <span className={`behavior-status ${getBehaviorClass(s.behavior)}`}>
                        {s.behavior}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="content-grid">
          <div className="content-card">
            <div className="card-header">
              <h4 className="card-title">Behavior Reports</h4>
              <span className="view-link">View All</span>
            </div>
            <ul className="behavior-list">
              {behaviorList.map(b => (
                <li key={b.name} className="behavior-item">
                  <span className="initials">{b.initials}</span>
                  <span className="student-name">{b.name}</span>
                  <span className={`behavior-status ${getBehaviorClass(b.status)}`}>
                    {b.status}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="content-card">
            <div className="card-header">
              <h4 className="card-title">Subject Performance</h4>
              <span className="view-link">View Details</span>
            </div>
            <ul className="subject-list">
              {subjectPerformance.map(s => (
                <li key={s.name} className="subject-item">
                  <span className="subject-icon">{s.icon}</span>
                  <span className="subject-name">{s.name}</span>
                  <span className="subject-percent">{s.percent}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="academic-summary">
          <div className="card-header">
            <h4 className="card-title">Academic Reports</h4>
            <span className="view-link">Export Data</span>
          </div>
          <div className="summary-grid">
            <div className="summary-item">
              <div className="summary-label">Total Students</div>
              <div className="summary-value summary-students">180</div>
            </div>
            <div className="summary-item">
              <div className="summary-label">Average Performance</div>
              <div className="summary-value summary-performance">87%</div>
            </div>
            <div className="summary-item">
              <div className="summary-label">Pending Reviews</div>
              <div className="summary-value summary-reviews">12</div>
            </div>
            <div className="summary-item">
              <div className="summary-label">At-Risk Students</div>
              <div className="summary-value summary-risk">5</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}