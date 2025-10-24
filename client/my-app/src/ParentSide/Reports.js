// Reports.js
import React from 'react';
import './ParentDashboard.css';

function Reports({ onSignOut }) {
  return (
    <div className="parent-layout">
      <aside className="parent-sidebar">
        <div className="parent-logo">
          <img src="/logo192.png" alt="GuardianLink" />
          <span>GuardianLink</span>
        </div>
        <div className="parent-role">
          <span className="parent-role-badge">parent</span>
          <span>Reports</span>
        </div>
        <div className="parent-powered">
          by <a href="https://edutrackers.com" target="_blank" rel="noopener noreferrer">EduTrackers</a>
        </div>
        <nav className="parent-nav">
          <button onClick={() => {}} aria-label="Go to Dashboard">Dashboard</button>
          <button onClick={() => {}} aria-label="Go to Notifications">Notifications</button>
          <button className="active" onClick={() => {}} aria-label="Current Reports">Reports</button>
          <button onClick={() => {}} aria-label="Go to Attendance">Attendance</button>
          <button onClick={() => {}} aria-label="Go to Marks">Marks & KTs</button>
          <button onClick={() => {}} aria-label="Go to Fee Status">Fee Status</button>
          <button onClick={() => {}} aria-label="Go to Behavior">Behavior</button>
        </nav>
        <div className="parent-user">
          <div className="parent-avatar">👤</div>
          <div>
            <div>Parent User</div>
            <div className="parent-user-role">Parent</div>
            <div className="parent-user-id">CS-2025-001</div>
          </div>
        </div>
        <button className="parent-signout" onClick={onSignOut}>↩ Sign Out</button>
      </aside>
      <main className="parent-main">
        <header className="parent-header">
          <div>
            <h2>Academic Reports</h2>
            <span className="parent-welcome">Comprehensive academic performance analysis</span>
          </div>
          <div className="parent-notifications">
            <span>🔔 Notifications</span>
            <span className="parent-notif-count">2</span>
          </div>
        </header>
        
        <section className="reports-section">
          <div className="reports-filters">
            <div className="filter-group">
              <label>Select Report Type:</label>
              <select className="report-select">
                <option>Progress Report</option>
                <option>Term-wise Report</option>
                <option>Annual Report</option>
                <option>Subject-wise Analysis</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Time Period:</label>
              <select className="report-select">
                <option>Current Semester</option>
                <option>Last 6 Months</option>
                <option>Academic Year 2024-25</option>
                <option>Custom Range</option>
              </select>
            </div>
            <button className="generate-report-btn">📄 Generate Report</button>
          </div>
          
          <div className="reports-grid">
            <div className="report-card">
              <div className="report-card-header">
                <h3>Academic Progress</h3>
                <span className="report-date">Jan 2025</span>
              </div>
              <div className="report-metrics">
                <div className="metric">
                  <span className="metric-label">Overall Grade</span>
                  <span className="metric-value">A-</span>
                </div>
                <div className="metric">
                  <span className="metric-label">Attendance</span>
                  <span className="metric-value">91%</span>
                </div>
                <div className="metric">
                  <span className="metric-label">Assignments</span>
                  <span className="metric-value">8/10</span>
                </div>
              </div>
              <div className="report-download">
                <button className="download-btn">📥 Download PDF</button>
              </div>
            </div>
            
            <div className="report-card">
              <div className="report-card-header">
                <h3>Subject-wise Performance</h3>
                <span className="report-date">Semester 4</span>
              </div>
              <div className="subject-list">
                <div className="subject-item">
                  <span>Software Engineering</span>
                  <span className="subject-grade">A</span>
                </div>
                <div className="subject-item">
                  <span>Computer Networks</span>
                  <span className="subject-grade">B+</span>
                </div>
                <div className="subject-item">
                  <span>Database Systems</span>
                  <span className="subject-grade">A-</span>
                </div>
                <div className="subject-item">
                  <span>Web Development</span>
                  <span className="subject-grade">A</span>
                </div>
              </div>
              <div className="report-download">
                <button className="download-btn">📥 Download PDF</button>
              </div>
            </div>
            
            <div className="report-card full-width">
              <div className="report-card-header">
                <h3>Performance Trend</h3>
                <span className="report-date">Last 4 Semesters</span>
              </div>
              <div className="performance-chart">
                <div className="chart-placeholder">
                  📈 Performance Chart Visualization
                  <div className="chart-note">Graph showing academic progress over time</div>
                </div>
              </div>
              <div className="report-download">
                <button className="download-btn">📥 Download Detailed Report</button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Reports;