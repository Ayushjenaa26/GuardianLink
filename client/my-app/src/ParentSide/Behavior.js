// Behavior.js
import React from 'react';
import './ParentDashboard.css';

function Behavior({ onSignOut }) {
  return (
    <div className="parent-layout">
      <aside className="parent-sidebar">
        <div className="parent-logo">
          <img src="/logo192.png" alt="GuardianLink" />
          <span>GuardianLink</span>
        </div>
        <div className="parent-role">
          <span className="parent-role-badge">parent</span>
          <span>Behavior</span>
        </div>
        <div className="parent-powered">
          by <a href="https://edutrackers.com" target="_blank" rel="noopener noreferrer">EduTrackers</a>
        </div>
        <nav className="parent-nav">
          <a href="#dashboard">Dashboard</a>
          <a href="#notifications">Notifications</a>
          <a href="#reports">Reports</a>
          <a href="#attendance">Attendance</a>
          <a href="#marks">Marks & KTs</a>
          <a href="#fees">Fee Status</a>
          <a className="active" href="#behavior">Behavior</a>
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
            <h2>Behavior & Conduct</h2>
            <span className="parent-welcome">Monitor your child's conduct and behavior reports</span>
          </div>
          <div className="parent-notifications">
            <span>🔔 Notifications</span>
            <span className="parent-notif-count">0</span>
          </div>
        </header>
        
        <section className="behavior-section">
          <div className="behavior-overview">
            <div className="behavior-score">
              <div className="score-circle">
                <div className="score-value">8.5/10</div>
                <div className="score-label">Conduct Score</div>
              </div>
            </div>
            <div className="behavior-stats">
              <div className="behavior-stat positive">
                <div className="stat-value">12</div>
                <div className="stat-label">Positive Points</div>
              </div>
              <div className="behavior-stat neutral">
                <div className="stat-value">3</div>
                <div className="stat-label">Neutral Points</div>
              </div>
              <div className="behavior-stat negative">
                <div className="stat-value">1</div>
                <div className="stat-label">Areas to Improve</div>
              </div>
            </div>
          </div>
          
          <div className="behavior-categories">
            <h3>Behavior Categories</h3>
            <div className="category-grid">
              <div className="category-card excellent">
                <div className="category-icon">⭐</div>
                <div className="category-content">
                  <div className="category-title">Academic Integrity</div>
                  <div className="category-rating">Excellent</div>
                  <div className="category-desc">Consistently follows academic guidelines</div>
                </div>
              </div>
              <div className="category-card good">
                <div className="category-icon">🤝</div>
                <div className="category-content">
                  <div className="category-title">Class Participation</div>
                  <div className="category-rating">Good</div>
                  <div className="category-desc">Active in classroom discussions</div>
                </div>
              </div>
              <div className="category-card excellent">
                <div className="category-icon">📚</div>
                <div className="category-content">
                  <div className="category-title">Assignment Submission</div>
                  <div className="category-rating">Excellent</div>
                  <div className="category-desc">Timely submission of all assignments</div>
                </div>
              </div>
              <div className="category-card needs-improvement">
                <div className="category-icon">⏰</div>
                <div className="category-content">
                  <div className="category-title">Punctuality</div>
                  <div className="category-rating">Needs Improvement</div>
                  <div className="category-desc">Occasionally late to morning classes</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="behavior-timeline">
            <h3>Recent Behavior Records</h3>
            <div className="timeline">
              <div className="timeline-item positive">
                <div className="timeline-date">Jan 15, 2025</div>
                <div className="timeline-content">
                  <div className="timeline-title">Excellent Project Work</div>
                  <div className="timeline-desc">Received appreciation for outstanding Software Engineering project presentation</div>
                  <div className="timeline-teacher">By: Prof. Sharma</div>
                </div>
              </div>
              <div className="timeline-item positive">
                <div className="timeline-date">Jan 10, 2025</div>
                <div className="timeline-content">
                  <div className="timeline-title">Helpful in Lab</div>
                  <div className="timeline-desc">Assisted classmates during computer networks lab session</div>
                  <div className="timeline-teacher">By: Lab Assistant</div>
                </div>
              </div>
              <div className="timeline-item neutral">
                <div className="timeline-date">Jan 8, 2025</div>
                <div className="timeline-content">
                  <div className="timeline-title">Library Book Return</div>
                  <div className="timeline-desc">Reminded to return overdue library books</div>
                  <div className="timeline-teacher">By: Librarian</div>
                </div>
              </div>
              <div className="timeline-item negative">
                <div className="timeline-date">Jan 5, 2025</div>
                <div className="timeline-content">
                  <div className="timeline-title">Late Submission</div>
                  <div className="timeline-desc">Submitted Database assignment after deadline</div>
                  <div className="timeline-teacher">By: Prof. Gupta</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="behavior-recommendations">
            <h3>Recommendations for Improvement</h3>
            <div className="recommendation-list">
              <div className="recommendation-item">
                <div className="rec-icon">🎯</div>
                <div className="rec-content">
                  <div className="rec-title">Improve Punctuality</div>
                  <div className="rec-desc">Try to reach college 15 minutes before first lecture</div>
                </div>
              </div>
              <div className="recommendation-item">
                <div className="rec-icon">📝</div>
                <div className="rec-content">
                  <div className="rec-title">Time Management</div>
                  <div className="rec-desc">Plan assignment submissions at least 2 days before deadline</div>
                </div>
              </div>
              <div className="recommendation-item">
                <div className="rec-icon">🏆</div>
                <div className="rec-content">
                  <div className="rec-title">Continue Good Work</div>
                  <div className="rec-desc">Maintain current level of academic performance and participation</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Behavior;