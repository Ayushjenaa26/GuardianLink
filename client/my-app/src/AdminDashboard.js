import React from 'react';
import './ParentDashboard.css';

function AdminDashboard() {
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
          <a className="active" href="#"><span role="img" aria-label="dashboard">📋</span> Dashboard</a>
          <a href="#"><span role="img" aria-label="notifications">🔔</span> Notifications</a>
          <a href="#"><span role="img" aria-label="reports">📄</span> Reports</a>
          <a href="#"><span role="img" aria-label="students">🧑‍🎓</span> Students</a>
          <a href="#"><span role="img" aria-label="teachers">🧑‍🏫</span> Teachers</a>
          <a href="#"><span role="img" aria-label="fee">💳</span> Fee Management</a>
          <a href="#"><span role="img" aria-label="security">🛡️</span> Security & Audit</a>
          <a href="#"><span role="img" aria-label="settings">⚙️</span> Settings</a>
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
        <button className="parent-signout">↩ Sign Out</button>
      </aside>
      <main className="parent-main">
        <header className="parent-header">
          <div>
            <h2>Dashboard</h2>
            <span className="parent-welcome">Welcome back, manage your admin dashboard</span>
          </div>
          <div className="parent-notifications">
            <span>🔔 Notifications</span>
            <span className="parent-notif-count">3</span>
          </div>
        </header>
        <section className="parent-cards">
          <div className="parent-card card-blue">
            <div>Total Students</div>
            <div className="parent-card-value">1,234</div>
            <div className="parent-card-desc">+10% from last month</div>
          </div>
          <div className="parent-card card-green">
            <div>Total Faculty</div>
            <div className="parent-card-value">89</div>
            <div className="parent-card-desc">+2 new this month</div>
          </div>
          <div className="parent-card card-purple">
            <div>Fee Collection</div>
            <div className="parent-card-value">₹12.5L</div>
            <div className="parent-card-desc">85% collected</div>
            <div style={{marginTop: 6, width: '100%', background: '#e9d5ff', borderRadius: 6, height: 6}}>
              <div style={{width: '85%', background: '#a855f7', height: 6, borderRadius: 6}}></div>
            </div>
          </div>
          <div className="parent-card card-green">
            <div>Attendance Rate</div>
            <div className="parent-card-value">92%</div>
            <div className="parent-card-desc">+3% from last week</div>
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
      </main>
    </div>
  );
}

export default AdminDashboard;