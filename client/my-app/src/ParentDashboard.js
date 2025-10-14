import React, { useState } from 'react';
import './ParentDashboard.css';
import Reports from './Reports';
import MarksKTS from './MarksKTS';
import FeeStatus from './FeeStatus';


function ParentDashboard() {
  const [activeSection, setActiveSection] = useState('dashboard');
  return (
    <div className="parent-layout">
      <aside className="parent-sidebar">
        <div className="parent-logo">
          <img src="/logo192.png" alt="GuardianLink" />
          <span>GuardianLink</span>
        </div>
        <div className="parent-role">
          <span className="parent-role-badge">parent</span>
          <span>Dashboard</span>
        </div>
        <div className="parent-powered">
          by <a href="https://edutrackers.com" target="_blank" rel="noopener noreferrer">EduTrackers</a>
        </div>
        <nav className="parent-nav">
          <a className={activeSection === 'dashboard' ? 'active' : ''} href="#" onClick={() => setActiveSection('dashboard')}>Dashboard</a>
          <a className={activeSection === 'notifications' ? 'active' : ''} href="#" onClick={() => setActiveSection('notifications')}>Notifications</a>
          <a className={activeSection === 'reports' ? 'active' : ''} href="#" onClick={() => setActiveSection('reports')}>Reports</a>
          <a className={activeSection === 'attendance' ? 'active' : ''} href="#" onClick={() => setActiveSection('attendance')}>Attendance</a>
          <a className={activeSection === 'marks' ? 'active' : ''} href="#" onClick={() => setActiveSection('marks')}>Marks & KTs</a>
          <a className={activeSection === 'fee' ? 'active' : ''} href="#" onClick={() => setActiveSection('fee')}>Fee Status</a>
          <a className={activeSection === 'behavior' ? 'active' : ''} href="#" onClick={() => setActiveSection('behavior')}>Behavior</a>
        </nav>
        <div className="parent-user">
          <div className="parent-avatar">👤</div>
          <div>
            <div>Parent User</div>
            <div className="parent-user-role">Parent</div>
            <div className="parent-user-id">CS-2025-001</div>
          </div>
        </div>
        <button className="parent-signout">↩ Sign Out</button>
      </aside>
      <main className="parent-main">
        {activeSection === 'dashboard' && (
          <>
            <header className="parent-header">
              <div>
                <h2>Dashboard</h2>
                <span className="parent-welcome">Welcome back, manage your parent dashboard</span>
              </div>
              <div className="parent-notifications">
                <span>🔔 Notifications</span>
                <span className="parent-notif-count">3</span>
              </div>
            </header>
            <section className="parent-cards">
              <div className="parent-card card-blue">
                <div>Overall Attendance</div>
                <div className="parent-card-value">91%</div>
                <div className="parent-card-desc">This month</div>
              </div>
              <div className="parent-card card-green">
                <div>Average Grade</div>
                <div className="parent-card-value">A-</div>
                <div className="parent-card-desc">↑ Improved from B+</div>
              </div>
              <div className="parent-card card-purple">
                <div>Fee Status</div>
                <div className="parent-card-value">Paid</div>
                <div className="parent-card-desc">Next due: March 15</div>
              </div>
              <div className="parent-card card-yellow">
                <div>Academic Performance</div>
                <div className="parent-card-value">Excellent</div>
                <div className="parent-card-desc">Faculty verified</div>
              </div>
            </section>
            <section className="parent-activity">
              <div className="parent-activity-title">Recent Activity</div>
              <div className="parent-activity-desc">Stay updated with the latest changes</div>
              <div className="parent-activity-list">
                <div className="parent-activity-item activity-red">
                  <b>Development Fee Reminder:</b>
                  <div>Payment due on January 25, 2025</div>
                </div>
                <div className="parent-activity-item activity-green">
                  <b>Attendance Update:</b>
                  <div>Your child was marked present in Full Stack Development Lab today</div>
                </div>
                <div className="parent-activity-item activity-blue">
                  <b>New Marks Added:</b>
                  <div>Software Engineering assignment results are now available</div>
                </div>
                <div className="parent-activity-item activity-purple">
                  <b>Lab Schedule Update:</b>
                  <div>Computer Networks lab has been rescheduled to 2:00 PM tomorrow</div>
                </div>
              </div>
            </section>
          </>
        )}
        {activeSection === 'reports' && (
          <Reports />
        )}
        {activeSection === 'marks' && (
          <MarksKTS />
        )}
        {activeSection === 'fee' && (
          <FeeStatus />
        )}
        {/* You can add similar conditional rendering for other sections if needed */}
      </main>
    </div>
  );
}

export default ParentDashboard;