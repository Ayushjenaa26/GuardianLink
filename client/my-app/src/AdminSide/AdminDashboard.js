import React, { useState } from 'react';
import './AdminDashboard.css';
import ReportAdmin from './ReportAdmin';
import StudentAdmin from './StudentAdmin';
import Teachers from './TeacherAdmin';
import FeeManagement from './FeeManagement';

function AdminDashboard({ onSignOut }) {
  const [activeSection, setActiveSection] = useState('students');

  // Render the main dashboard content
  const renderDashboardContent = () => {
    return (
      <div className="dashboard-content">
        <header className="parent-header">
          <div>
            <h2>Admin Dashboard</h2>
            <span className="parent-welcome">Welcome back, manage your admin dashboard</span>
          </div>
        </header>

        {/* Dashboard Stats Cards */}
        <section className="parent-cards">
          <div className="parent-card card-blue">
            <div>Yuei Students</div>
            <div className="parent-card-value">1,234</div>
            <div className="parent-card-desc">+1% from last month</div>
          </div>
          <div className="parent-card card-green">
            <div>Yuei Faculty</div>
            <div className="parent-card-value">89</div>
            <div className="parent-card-desc">+2 new this month</div>
          </div>
          <div className="parent-card card-purple">
            <div>Fee Collection</div>
            <div className="parent-card-value">$12.5L</div>
            <div className="parent-card-desc">95% collected</div>
          </div>
          <div className="parent-card card-orange">
            <div>Attendance Rate</div>
            <div className="parent-card-value">92%</div>
            <div className="parent-card-desc">+3% from last week</div>
          </div>
        </section>

        {/* Recent Activity Section */}
        <section className="recent-activity">
          <div className="section-header">
            <h3>Recent Activity</h3>
            <span>Stay updated with the latest changes</span>
          </div>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-icon">💳</div>
              <div className="activity-content">
                <div className="activity-title">Development Fee Reminder</div>
                <div className="activity-desc">Payment due on January 25, 2025</div>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon">✅</div>
              <div className="activity-content">
                <div className="activity-title">Attendance Updates</div>
                <div className="activity-desc">Your child was marked present in Full Stack Development Lab today</div>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon">📊</div>
              <div className="activity-content">
                <div className="activity-title">New Marks Added</div>
                <div className="activity-desc">Software Engineering assignment results are now available</div>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon">🕒</div>
              <div className="activity-content">
                <div className="activity-title">Lab Schedule Updates</div>
                <div className="activity-desc">Computer Networks Lab has been rescheduled to 2:00 PM tomorrow</div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  };

  return (
    <div className="parent-layout">
      <aside className="parent-sidebar">
        <div className="parent-logo">
          <img src="/logo192.png" alt="GuardianLink" />
          <span>GuardianLink</span>
        </div>
        <div className="parent-role">
          <span className="parent-role-badge" style={{background:'#fee2e2', color:'#b91c1c'}}>admin</span>
          <span>Dashboard</span>
        </div>
        <div className="parent-powered">
          by <a href="https://edutrackers.com" target="_blank" rel="noopener noreferrer">EduTrackers</a>
        </div>
        <nav className="parent-nav">
          <button 
            className={activeSection === 'dashboard' ? 'active' : ''} 
            onClick={() => setActiveSection('dashboard')} 
            aria-label="Dashboard"
          >
            <span role="img" aria-label="dashboard">📋</span> Dashboard
          </button>
          <button
            className={activeSection === 'reports' ? 'active' : ''} 
            onClick={() => setActiveSection('reports')} 
            aria-label="Reports"
          >
            <span role="img" aria-label="reports">📄</span> Reports
          </button>
          <button 
            className={activeSection === 'students' ? 'active' : ''} 
            onClick={() => setActiveSection('students')} 
            aria-label="Students"
          >
            <span role="img" aria-label="students">🧑‍🎓</span> Students
          </button>
          <button 
            className={activeSection === 'teachers' ? 'active' : ''} 
            onClick={() => setActiveSection('teachers')} 
            aria-label="Teachers"
          >
            <span role="img" aria-label="teachers">🧑‍🏫</span> Teachers
          </button>
          <button
            className={activeSection === 'fee' ? 'active' : ''}
            onClick={() => setActiveSection('fee')}
            aria-label="Fee Management"
          >
            <span role="img" aria-label="fee">💳</span> Fee Management
          </button>
        </nav>
        <div className="parent-user">
          <div className="parent-avatar" style={{background:'#a855f7'}}> 
            <span role="img" aria-label="admin">🛡️</span>
          </div>
          <div>
            <div>Admin User</div>
            <div className="parent-user-role" style={{color:'#b91c1c'}}>Admin</div>
          </div>
        </div>
        <button className="parent-signout" onClick={onSignOut ? onSignOut : undefined}>↩ Sign Out</button>
      </aside>
      
      <main className="parent-main">
        {/* Render Dashboard, Reports, or Students without duplicate layouts */}
        {activeSection === 'dashboard' && renderDashboardContent()}
        {activeSection === 'reports' && <ReportAdmin embedded={true} />}
        {activeSection === 'students' && <StudentAdmin embedded={true} />}
        {activeSection === 'teachers' && <Teachers embedded={true} />}
        {activeSection === 'fee' && <FeeManagement embedded={true} />}
      </main>
    </div>
  );
}

export default AdminDashboard;