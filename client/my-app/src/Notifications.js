// Notifications.js
import React from 'react';
import './ParentDashboard.css';

function Notifications({ onSignOut }) {
  return (
    <div className="parent-layout">
      <aside className="parent-sidebar">
        <div className="parent-logo">
          <img src="/logo192.png" alt="GuardianLink" />
          <span>GuardianLink</span>
        </div>
        <div className="parent-role">
          <span className="parent-role-badge">parent</span>
          <span>Notifications</span>
        </div>
        <div className="parent-powered">
          by <a href="https://edutrackers.com" target="_blank" rel="noopener noreferrer">EduTrackers</a>
        </div>
        <nav className="parent-nav">
          <a href="#dashboard">Dashboard</a>
          <a className="active" href="#notifications">Notifications</a>
          <a href="#reports">Reports</a>
          <a href="#attendance">Attendance</a>
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
            <h2>Notifications</h2>
            <span className="parent-welcome">Stay updated with important alerts and announcements</span>
          </div>
          <div className="parent-notifications">
            <span>🔔 Notifications</span>
            <span className="parent-notif-count">5</span>
          </div>
        </header>
        
        <section className="notifications-section">
          <div className="notifications-filters">
            <button className="filter-btn active">All</button>
            <button className="filter-btn">Unread</button>
            <button className="filter-btn">Academic</button>
            <button className="filter-btn">Financial</button>
            <button className="filter-btn">Events</button>
          </div>
          
          <div className="notifications-list">
            <div className="notification-item unread">
              <div className="notification-icon">📚</div>
              <div className="notification-content">
                <div className="notification-title">New Assignment Posted</div>
                <div className="notification-desc">Software Engineering - Assignment 3 has been posted. Due date: March 10, 2025</div>
                <div className="notification-time">2 hours ago</div>
              </div>
              <div className="notification-badge academic">Academic</div>
            </div>
            
            <div className="notification-item unread">
              <div className="notification-icon">💰</div>
              <div className="notification-content">
                <div className="notification-title">Fee Payment Reminder</div>
                <div className="notification-desc">Development fee payment is due on January 25, 2025. Please complete the payment.</div>
                <div className="notification-time">1 day ago</div>
              </div>
              <div className="notification-badge financial">Financial</div>
            </div>
            
            <div className="notification-item">
              <div className="notification-icon">🎓</div>
              <div className="notification-content">
                <div className="notification-title">Parent-Teacher Meeting</div>
                <div className="notification-desc">Quarterly parent-teacher meeting scheduled for February 15, 2025 at 10:00 AM</div>
                <div className="notification-time">3 days ago</div>
              </div>
              <div className="notification-badge event">Event</div>
            </div>
            
            <div className="notification-item">
              <div className="notification-icon">📊</div>
              <div className="notification-content">
                <div className="notification-title">Mid-term Results Published</div>
                <div className="notification-desc">Mid-term examination results are now available for viewing in the Marks section</div>
                <div className="notification-time">1 week ago</div>
              </div>
              <div className="notification-badge academic">Academic</div>
            </div>
            
            <div className="notification-item">
              <div className="notification-icon">🏫</div>
              <div className="notification-content">
                <div className="notification-title">College Holiday</div>
                <div className="notification-desc">College will remain closed on February 26, 2025 for Republic Day celebration</div>
                <div className="notification-time">2 weeks ago</div>
              </div>
              <div className="notification-badge event">Event</div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Notifications;