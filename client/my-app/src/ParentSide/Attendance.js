// Attendance.js
import React from 'react';
import './ParentDashboard.css';

function Attendance({ onSignOut }) {
  return (
    <div className="parent-layout">
      <aside className="parent-sidebar">
        <div className="parent-logo">
          <img src="/logo192.png" alt="GuardianLink" />
          <span>GuardianLink</span>
        </div>
        <div className="parent-role">
          <span className="parent-role-badge">parent</span>
          <span>Attendance</span>
        </div>
        <div className="parent-powered">
          by <a href="https://edutrackers.com" target="_blank" rel="noopener noreferrer">EduTrackers</a>
        </div>
        <nav className="parent-nav">
          <a href="#dashboard">Dashboard</a>
          <a href="#notifications">Notifications</a>
          <a href="#reports">Reports</a>
          <a className="active" href="#attendance">Attendance</a>
          <a href="#marks">Marks & KTs</a>
          <a href="#fees">Fee Status</a>
          <a href="#behavior">Behavior</a>
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
            <h2>Attendance Tracking</h2>
            <span className="parent-welcome">Monitor your child's attendance records</span>
          </div>
          <div className="parent-notifications">
            <span>🔔 Notifications</span>
            <span className="parent-notif-count">1</span>
          </div>
        </header>
        
        <section className="attendance-section">
          <div className="attendance-overview">
            <div className="attendance-stats">
              <div className="attendance-stat">
                <div className="stat-value">91%</div>
                <div className="stat-label">Overall Attendance</div>
              </div>
              <div className="attendance-stat">
                <div className="stat-value">45</div>
                <div className="stat-label">Present Days</div>
              </div>
              <div className="attendance-stat">
                <div className="stat-value">4</div>
                <div className="stat-label">Absent Days</div>
              </div>
              <div className="attendance-stat">
                <div className="stat-value">2</div>
                <div className="stat-label">Leave Days</div>
              </div>
            </div>
          </div>
          
          <div className="attendance-filters">
            <select className="month-filter">
              <option>January 2025</option>
              <option>December 2024</option>
              <option>November 2024</option>
              <option>October 2024</option>
            </select>
            <select className="subject-filter">
              <option>All Subjects</option>
              <option>Software Engineering</option>
              <option>Computer Networks</option>
              <option>Database Systems</option>
              <option>Web Development</option>
            </select>
          </div>
          
          <div className="attendance-calendar">
            <div className="calendar-header">
              <div>Mon</div>
              <div>Tue</div>
              <div>Wed</div>
              <div>Thu</div>
              <div>Fri</div>
              <div>Sat</div>
              <div>Sun</div>
            </div>
            <div className="calendar-grid">
              {Array.from({ length: 31 }, (_, i) => {
                const day = i + 1;
                const status = day % 7 === 0 ? 'absent' : day % 6 === 0 ? 'leave' : 'present';
                return (
                  <div key={day} className={`calendar-day ${status}`}>
                    <span>{day}</span>
                    <div className={`status-dot ${status}`}></div>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="attendance-legend">
            <div className="legend-item">
              <div className="legend-color present"></div>
              <span>Present</span>
            </div>
            <div className="legend-item">
              <div className="legend-color absent"></div>
              <span>Absent</span>
            </div>
            <div className="legend-item">
              <div className="legend-color leave"></div>
              <span>On Leave</span>
            </div>
            <div className="legend-item">
              <div className="legend-color holiday"></div>
              <span>Holiday</span>
            </div>
          </div>
          
          <div className="attendance-details">
            <h3>Subject-wise Attendance</h3>
            <div className="subject-attendance">
              <div className="subject-attendance-item">
                <span>Software Engineering</span>
                <div className="attendance-bar">
                  <div className="attendance-fill" style={{width: '95%'}}></div>
                </div>
                <span className="attendance-percent">95%</span>
              </div>
              <div className="subject-attendance-item">
                <span>Computer Networks</span>
                <div className="attendance-bar">
                  <div className="attendance-fill" style={{width: '88%'}}></div>
                </div>
                <span className="attendance-percent">88%</span>
              </div>
              <div className="subject-attendance-item">
                <span>Database Systems</span>
                <div className="attendance-bar">
                  <div className="attendance-fill" style={{width: '92%'}}></div>
                </div>
                <span className="attendance-percent">92%</span>
              </div>
              <div className="subject-attendance-item">
                <span>Web Development</span>
                <div className="attendance-bar">
                  <div className="attendance-fill" style={{width: '90%'}}></div>
                </div>
                <span className="attendance-percent">90%</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Attendance;