import React, { useState } from 'react';
import '../ParentSide/ParentDashboard.css';
import TeacherReports from './TeacherReports';
import TeacherAttendance from './TeacherAttendance';
import MyStudents from '../MyStudents';
import MarksKT from './MarksKt';
import BehaviorReports from './BehaviorReports';

function TeacherDashboard() {
  const [activeSection, setActiveSection] = useState('dashboard');

  return (
    <div className="parent-layout">
      <aside className="parent-sidebar">
        <div className="parent-logo">
          <img src="/logo192.png" alt="GuardianLink" />
          <span>GuardianLink</span>
        </div>
        <div className="parent-role">
          <span className="parent-role-badge" style={{background:'#e6fff2', color:'#22c55e'}}>teacher</span>
          <span>Dashboard</span>
        </div>
        <div className="parent-powered">
          by <a href="https://edutrackers.com" target="_blank" rel="noopener noreferrer">EduTrackers</a>
        </div>
        <nav className="parent-nav">
          <button className={activeSection === 'dashboard' ? 'active' : ''} type="button" onClick={() => setActiveSection('dashboard')}>
            <span role="img" aria-label="dashboard">📋</span> Dashboard
          </button>
          <button className={activeSection === 'reports' ? 'active' : ''} type="button" onClick={() => setActiveSection('reports')}>
            <span role="img" aria-label="reports">📄</span> Reports
          </button>
          <button className={activeSection === 'attendance' ? 'active' : ''} type="button" onClick={() => setActiveSection('attendance')}>
            <span role="img" aria-label="attendance">🗓️</span> Attendance
          </button>
          <button className={activeSection === 'marks' ? 'active' : ''} type="button" onClick={() => setActiveSection('marks')}>
            <span role="img" aria-label="marks">📊</span> Marks & KTs
          </button>
          <button className={activeSection === 'students' ? 'active' : ''} type="button" onClick={() => setActiveSection('students')}>
            <span role="img" aria-label="students">👨‍🎓</span> My Students
          </button>
          <button className={activeSection === 'behavior' ? 'active' : ''} type="button" onClick={() => setActiveSection('behavior')}>
            <span role="img" aria-label="behavior">📈</span> Behavior Reports
          </button>
        </nav>
        <div className="parent-user">
          <div className="parent-avatar" style={{background:'#6a4cf7'}}> 
            <span role="img" aria-label="teacher">🧑‍🏫</span>
          </div>
          <div>
            <div>Prof. Swapnil P</div>
            <div className="parent-user-role" style={{color:'#22c55e'}}>Teacher</div>
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
                <span className="parent-welcome">Welcome back, manage your teacher dashboard</span>
              </div>
              <div className="parent-notifications">
                <span>🔔 Notifications</span>
                <span className="parent-notif-count">3</span>
              </div>
            </header>
            <section className="parent-cards">
              <div className="parent-card card-blue">
                <div>My Classes</div>
                <div className="parent-card-value">6</div>
                <div className="parent-card-desc">Total students: 180</div>
              </div>
              <div className="parent-card card-yellow">
                <div>Today's Classes</div>
                <div className="parent-card-value">4</div>
                <div className="parent-card-desc">Next: Full Stack Lab at 10:00 AM</div>
              </div>
              <div className="parent-card card-red">
                <div>Pending Reviews</div>
                <div className="parent-card-value">12</div>
                <div className="parent-card-desc">Lab reports to grade</div>
              </div>
              <div className="parent-card card-green">
                <div>Average Attendance</div>
                <div className="parent-card-value">94%</div>
                <div className="parent-card-desc">In my classes</div>
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
          <TeacherReports />
        )}
        {activeSection === 'attendance' && (
          <TeacherAttendance />
        )}
        {activeSection === 'marks' && (
          <MarksKT />
        )}
        {activeSection === 'students' && (
          <MyStudents />
        )}
        {activeSection === 'behavior' && (
          <BehaviorReports />
        )}
      </main>
    </div>
  );
}

export default TeacherDashboard;