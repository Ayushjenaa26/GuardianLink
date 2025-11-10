import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ParentDashboard.css';
import Reports from './Reports';
import MarksKTS from './MarksKTS';
import FeeStatus from './FeeStatus';


function ParentDashboard({ onSignOut }) {
  const [activeSection, setActiveSection] = useState('dashboard');
  const navigate = useNavigate();

  // Get parent info from localStorage
  const getParentInfo = () => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        return {
          name: user.name || 'Parent',
          email: user.email || '',
          role: user.role || 'parent'
        };
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
    return { name: 'Parent', email: '', role: 'parent' };
  };

  const parentInfo = getParentInfo();

  const handleSignOut = () => {
    // Clear authentication data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Call onSignOut if provided
    if (onSignOut) {
      onSignOut();
    }
    
    // Redirect to auth page
    navigate('/auth');
  };
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
          <button className={activeSection === 'dashboard' ? 'active' : ''} onClick={() => setActiveSection('dashboard')}>Dashboard</button>
          <button className={activeSection === 'notifications' ? 'active' : ''} onClick={() => setActiveSection('notifications')}>Notifications</button>
          <button className={activeSection === 'reports' ? 'active' : ''} onClick={() => setActiveSection('reports')}>Reports</button>
          <button className={activeSection === 'attendance' ? 'active' : ''} onClick={() => setActiveSection('attendance')}>Attendance</button>
          <button className={activeSection === 'marks' ? 'active' : ''} onClick={() => setActiveSection('marks')}>Marks & KTs</button>
          <button className={activeSection === 'fee' ? 'active' : ''} onClick={() => setActiveSection('fee')}>Fee Status</button>
          <button className={activeSection === 'behavior' ? 'active' : ''} onClick={() => setActiveSection('behavior')}>Behavior</button>
        </nav>
        <div className="parent-user">
          <div className="parent-avatar">👤</div>
          <div>
            <div>{parentInfo.name}</div>
            <div className="parent-user-role">{parentInfo.email || 'Parent'}</div>
          </div>
        </div>
        <button className="parent-signout" onClick={handleSignOut}>↩ Sign Out</button>
      </aside>
      <main className="parent-main">
        {activeSection === 'dashboard' && (
          <>
            <header className="parent-header">
              <div>
                <h2>Dashboard</h2>
                <span className="parent-welcome">Welcome back, {parentInfo.name}! Manage your child's progress</span>
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
          <Reports onSignOut={onSignOut} />
        )}
        {activeSection === 'marks' && (
          <MarksKTS onSignOut={onSignOut} />
        )}
        {activeSection === 'fee' && (
          <FeeStatus onSignOut={onSignOut} />
        )}
        {/* You can add similar conditional rendering for other sections if needed */}
      </main>
    </div>
  );
}

export default ParentDashboard;