import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../TeacherSide/TeacherDashboard.css';
import TeacherReports from './TeacherReports';
import TeacherAttendance from './TeacherAttendance';
import MyStudents from './MyStudents';
import MarksKT from './MarksKt';
import BehaviorReports from './BehaviorReports';
import StudentDataInput from './StudentDataInput';
import RequestRoles from './RequestRoles';
import { API_URL } from '../config';

function TeacherDashboard() {
  const navigate = useNavigate();
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

  // Get teacher info from localStorage
  const getTeacherInfo = () => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        return {
          name: user.name || 'Professor',
          email: user.email || '',
          role: user.role || 'teacher'
        };
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
    return { name: 'Professor', email: '', role: 'teacher' };
  };

  const teacherInfo = getTeacherInfo();

  const handleSignOut = () => {
    // Clear authentication data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Redirect to auth page
    navigate('/auth');
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch(`${API_URL}/api/teacher/dashboard`, {
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
                <span className="parent-welcome">Welcome back, {teacherInfo.name}! Manage your classes and track student progress</span>
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
                    <div className="parent-card-value">0</div>
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
              <div className="parent-activity-header">
                <div>
                  <div className="parent-activity-title">📈 Recent Activity</div>
                  <div className="parent-activity-desc">Stay updated with the latest classroom activities and updates</div>
                </div>
                <span className="activity-badge">{dashboardData.totalStudents} Students Active</span>
              </div>
              <div className="parent-activity-list">
                <div className="parent-activity-item activity-success">
                  <div className="activity-icon">✅</div>
                  <div className="activity-content">
                    <div className="activity-header">
                      <b>Attendance Recorded</b>
                      <span className="activity-time">2 hours ago</span>
                    </div>
                    <div className="activity-description">Class 10A - All 23 students marked present for Computer Science lecture</div>
                  </div>
                </div>

                <div className="parent-activity-item activity-info">
                  <div className="activity-icon">📊</div>
                  <div className="activity-content">
                    <div className="activity-header">
                      <b>Grades Updated</b>
                      <span className="activity-time">5 hours ago</span>
                    </div>
                    <div className="activity-description">Mathematics Unit Test results published for Class 10B (23 students)</div>
                  </div>
                </div>

                <div className="parent-activity-item activity-warning">
                  <div className="activity-icon">⚠️</div>
                  <div className="activity-content">
                    <div className="activity-header">
                      <b>Assignment Deadline</b>
                      <span className="activity-time">Tomorrow</span>
                    </div>
                    <div className="activity-description">Science project submission due for all sections - 15 students pending</div>
                  </div>
                </div>

                <div className="parent-activity-item activity-success">
                  <div className="activity-icon">🎯</div>
                  <div className="activity-content">
                    <div className="activity-header">
                      <b>Behavior Report Added</b>
                      <span className="activity-time">Yesterday</span>
                    </div>
                    <div className="activity-description">Excellent participation noted for AYUSH JENA in Class 10A</div>
                  </div>
                </div>

                <div className="parent-activity-item activity-info">
                  <div className="activity-icon">📝</div>
                  <div className="activity-content">
                    <div className="activity-header">
                      <b>New Student Added</b>
                      <span className="activity-time">2 days ago</span>
                    </div>
                    <div className="activity-description">TATVA JAIN successfully enrolled in Class 10A, Section A</div>
                  </div>
                </div>

                <div className="parent-activity-item activity-purple">
                  <div className="activity-icon">🔔</div>
                  <div className="activity-content">
                    <div className="activity-header">
                      <b>Class Schedule Update</b>
                      <span className="activity-time">3 days ago</span>
                    </div>
                    <div className="activity-description">English Literature class rescheduled to 2:00 PM for all sections</div>
                  </div>
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
      case 'request-roles':
        return (
          <div className="content-container">
            <RequestRoles />
          </div>
        );
      default:
        return (
          <div className="content-container">
            <header className="parent-header">
              <div>
                <h2>🎯 Teacher Dashboard</h2>
                <span className="parent-welcome">Welcome back, {teacherInfo.name}!</span>
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
            <button 
              className={activeSection === 'request-roles' ? 'active' : ''} 
              onClick={() => setActiveSection('request-roles')}
            >
              <span>📋</span> Request Roles
            </button>
          </nav>

          {/* Bottom Section */}
          <div className="sidebar-bottom">
            <div className="parent-user">
              <div className="parent-avatar">
                <span>👨‍🏫</span>
              </div>
              <div>
                <div>{teacherInfo.name}</div>
                <div className="parent-user-role">{teacherInfo.email || 'Teacher'}</div>
              </div>
            </div>
            
            <button className="parent-signout" onClick={handleSignOut}>🚪 Sign Out</button>
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