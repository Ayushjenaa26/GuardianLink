import React, { useState } from 'react';
import '../TeacherSide/TeacherDashboard.css';
import TeacherReports from './TeacherReports';
import TeacherAttendance from './TeacherAttendance';
import MyStudents from './MyStudents';
import MarksKT from './MarksKt';
import BehaviorReports from './BehaviorReports';
import StudentDataInput from './StudentDataInput';

function TeacherDashboard() {
  const [activeSection, setActiveSection] = useState('dashboard');

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="content-container">
            <header className="parent-header">
              <div>
                <h2>🎯 Teacher Dashboard</h2>
                <span className="parent-welcome">Welcome back, Professor! Manage your classes and track student progress</span>
              </div>
              <div className="parent-notifications">
                <span>🔔 Notifications</span>
                <span className="parent-notif-count">3</span>
              </div>
            </header>
            
            <section className="parent-cards">
              <div className="parent-card card-blue">
                <div>📚 My Classes</div>
                <div className="parent-card-value">6</div>
                <div className="parent-card-desc">Total students: 180 across all sections</div>
              </div>
              <div className="parent-card card-yellow">
                <div>🕒 Today's Schedule</div>
                <div className="parent-card-value">4</div>
                <div className="parent-card-desc">Next: Full Stack Lab at 10:00 AM</div>
              </div>
              <div className="parent-card card-red">
                <div>📝 Pending Reviews</div>
                <div className="parent-card-value">12</div>
                <div className="parent-card-desc">Lab reports awaiting grading</div>
              </div>
              <div className="parent-card card-green">
                <div>✅ Average Attendance</div>
                <div className="parent-card-value">94%</div>
                <div className="parent-card-desc">Excellent class participation</div>
              </div>
            </section>
            
            <section className="parent-activity">
              <div className="parent-activity-title">📈 Recent Activity</div>
              <div className="parent-activity-desc">Stay updated with the latest classroom activities and updates</div>
              <div className="parent-activity-list">
                <div className="parent-activity-item activity-red">
                  <b>⚠️ Assignment Deadline:</b>
                  <div>Software Engineering project submission due on January 25, 2025</div>
                </div>
                <div className="parent-activity-item activity-green">
                  <b>✅ Attendance Recorded:</b>
                  <div>Full Stack Development Lab - All students marked present today</div>
                </div>
                <div className="parent-activity-item activity-blue">
                  <b>📊 Grades Published:</b>
                  <div>Database Management assignment results are now available to students</div>
                </div>
                <div className="parent-activity-item activity-purple">
                  <b>🔄 Schedule Update:</b>
                  <div>Computer Networks lab rescheduled to 2:00 PM tomorrow</div>
                </div>
              </div>
            </section>
          </div>
        );
      case 'reports':
        return (
          <div className="content-container">
            <TeacherReports />
          </div>
        );
      case 'attendance':
        return (
          <div className="content-container">
            <TeacherAttendance />
          </div>
        );
      case 'marks':
        return (
          <div className="content-container">
            <MarksKT />
          </div>
        );
      case 'students':
        return (
          <div className="content-container">
            <MyStudents />
          </div>
        );
      case 'behavior':
        return (
          <div className="content-container">
            <BehaviorReports />
          </div>
        );
      case 'add-student':
        return (
          <div className="content-container">
            <StudentDataInput />
          </div>
        );
      default:
        return (
          <div className="content-container">
            <header className="parent-header">
              <div>
                <h2>🎯 Teacher Dashboard</h2>
                <span className="parent-welcome">Welcome back, Professor!</span>
              </div>
            </header>
          </div>
        );
    }
  };

  return (
    <div className="parent-layout">
      <aside className="parent-sidebar">
        <div className="sidebar-content">
          {/* Top Section */}
          <div>
            <div className="parent-logo">
              <img src="/logo192.png" alt="GuardianLink" />
              <span>GuardianLink</span>
            </div>
            
            <div className="parent-role">
              <span className="parent-role-badge">Teacher</span>
              <span>Professional Dashboard</span>
            </div>
            
            <div className="parent-powered">
              Powered by <a href="https://edutrackers.com" target="_blank" rel="noopener noreferrer">EduTrackers</a>
            </div>
          </div>

          {/* Navigation */}
          <nav className="parent-nav">
            <button 
              className={activeSection === 'dashboard' ? 'active' : ''} 
              onClick={() => setActiveSection('dashboard')}
            >
              <span>📊</span> Dashboard
            </button>
            <button 
              className={activeSection === 'reports' ? 'active' : ''} 
              onClick={() => setActiveSection('reports')}
            >
              <span>📄</span> Analytics Reports
            </button>
            <button 
              className={activeSection === 'attendance' ? 'active' : ''} 
              onClick={() => setActiveSection('attendance')}
            >
              <span>🗓️</span> Attendance
            </button>
            <button 
              className={activeSection === 'marks' ? 'active' : ''} 
              onClick={() => setActiveSection('marks')}
            >
              <span>🎯</span> Marks & Grades
            </button>
            <button 
              className={activeSection === 'students' ? 'active' : ''} 
              onClick={() => setActiveSection('students')}
            >
              <span>👨‍🎓</span> My Students
            </button>
            <button 
              className={activeSection === 'add-student' ? 'active' : ''} 
              onClick={() => setActiveSection('add-student')}
            >
              <span>➕</span> Add Student
            </button>
            <button 
              className={activeSection === 'behavior' ? 'active' : ''} 
              onClick={() => setActiveSection('behavior')}
            >
              <span>📈</span> Behavior Analytics
            </button>
          </nav>

          {/* Bottom Section */}
          <div className="sidebar-bottom">
            <div className="parent-user">
              <div className="parent-avatar">
                <span>👨‍🏫</span>
              </div>
              <div>
                <div>Prof. Swapnil P</div>
                <div className="parent-user-role">Senior Faculty</div>
              </div>
            </div>
            
            <button className="parent-signout">🚪 Sign Out</button>
          </div>
        </div>
      </aside>
      
      <main className="parent-main">
        {renderSectionContent()}
      </main>
    </div>
  );
}

export default TeacherDashboard;