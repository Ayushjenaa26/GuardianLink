import React, { useState, useEffect } from 'react';
import '../TeacherSide/TeacherDashboard.css';
import TeacherReports from './TeacherReports';
import TeacherAttendance from './TeacherAttendance';
import MyStudents from './MyStudents';
import MarksKT from './MarksKt';
import BehaviorReports from './BehaviorReports';
import StudentDataInput from './StudentDataInput';
import { API_URL } from '../config';

function TeacherDashboard() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [dashboardData, setDashboardData] = useState({
    totalStudents: 0,
    totalClasses: 0,
    pendingReviews: 0,
    averageAttendance: 0,
    nextClass: '',
    nextClassTime: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch(`${API_URL}/teacher/dashboard`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data');
        }

        const data = await response.json();
        setDashboardData(data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (activeSection === 'dashboard') {
      fetchDashboardData();
    }
  }, [activeSection]);

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
              {loading ? (
                <div className="loading-message">Loading dashboard data...</div>
              ) : error ? (
                <div className="error-message">{error}</div>
              ) : (
                <>
                  <div className="parent-card card-blue">
                    <div>📚 My Classes</div>
                    <div className="parent-card-value">{dashboardData.totalClasses}</div>
                    <div className="parent-card-desc">Total students: {dashboardData.totalStudents} across all sections</div>
                  </div>
                  <div className="parent-card card-yellow">
                    <div>🕒 Today's Schedule</div>
                    <div className="parent-card-value">{dashboardData.totalClasses}</div>
                    <div className="parent-card-desc">Next: {dashboardData.nextClass} at {dashboardData.nextClassTime}</div>
                  </div>
                  <div className="parent-card card-red">
                    <div>📝 Pending Reviews</div>
                    <div className="parent-card-value">{dashboardData.pendingReviews}</div>
                    <div className="parent-card-desc">Assignments awaiting review</div>
                  </div>
                  <div className="parent-card card-green">
                    <div>✅ Average Attendance</div>
                    <div className="parent-card-value">{dashboardData.averageAttendance}%</div>
                    <div className="parent-card-desc">Class participation rate</div>
                  </div>
                </>
              )}
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