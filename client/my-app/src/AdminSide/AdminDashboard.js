import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';
import ReportAdmin from './ReportAdmin';
import StudentAdmin from './StudentAdmin';
import Teachers from './TeacherAdmin';
import FeeManagement from './FeeManagement';
import DataUpload from './DataUpload';
import { API_URL } from '../config';

function AdminDashboard({ onSignOut }) {
  const [activeSection, setActiveSection] = useState('students');
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    activeStudents: 0,
    activeTeachers: 0
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch dashboard stats from database
  const fetchStats = useCallback(async () => {
    try {
      setStatsLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/admin/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStats({
          totalStudents: data.totalStudents || 0,
          totalTeachers: data.totalTeachers || 0,
          activeStudents: data.activeStudents || 0,
          activeTeachers: data.activeTeachers || 0
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Get admin info from localStorage
  const getAdminInfo = () => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        return {
          name: user.name || 'Administrator',
          email: user.email || '',
          role: user.role || 'admin'
        };
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
    return { name: 'Administrator', email: '', role: 'admin' };
  };

  const adminInfo = getAdminInfo();

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

  // Render the main dashboard content
  const renderDashboardContent = () => {
    return (
      <div className="dashboard-content">
        <header className="parent-header">
          <div>
            <h2>Admin Dashboard</h2>
            <span className="parent-welcome">Welcome back, {adminInfo.name}! Manage school operations</span>
          </div>
        </header>

        {/* Dashboard Stats Cards */}
        <section className="parent-cards">
          <div className="parent-card card-blue">
            <div>Total Students</div>
            <div className="parent-card-value">{statsLoading ? '...' : stats.totalStudents}</div>
            <div className="parent-card-desc">{stats.activeStudents} active</div>
          </div>
          <div className="parent-card card-green">
            <div>Total Faculty</div>
            <div className="parent-card-value">{statsLoading ? '...' : stats.totalTeachers}</div>
            <div className="parent-card-desc">{stats.activeTeachers} active</div>
          </div>
          <div className="parent-card card-purple">
            <div>Fee Collection</div>
            <div className="parent-card-value">Rs 0</div>
            <div className="parent-card-desc">Coming soon</div>
          </div>
          <div className="parent-card card-orange">
            <div>Attendance Rate</div>
            <div className="parent-card-value">--</div>
            <div className="parent-card-desc">Coming soon</div>
          </div>
        </section>

        {/* Quick Actions Section */}
        <section className="recent-activity">
          <div className="section-header">
            <h3>Quick Actions</h3>
            <span>Manage your institution</span>
          </div>
          <div className="activity-list">
            <div className="activity-item" onClick={() => setActiveSection('upload')} style={{cursor: 'pointer'}}>
              <div className="activity-icon">📤</div>
              <div className="activity-content">
                <div className="activity-title">Upload Data</div>
                <div className="activity-desc">Import students and teachers from Excel</div>
              </div>
            </div>
            <div className="activity-item" onClick={() => setActiveSection('students')} style={{cursor: 'pointer'}}>
              <div className="activity-icon">🧑‍🎓</div>
              <div className="activity-content">
                <div className="activity-title">Manage Students</div>
                <div className="activity-desc">View and manage student records</div>
              </div>
            </div>
            <div className="activity-item" onClick={() => setActiveSection('teachers')} style={{cursor: 'pointer'}}>
              <div className="activity-icon">🧑‍🏫</div>
              <div className="activity-content">
                <div className="activity-title">Manage Teachers</div>
                <div className="activity-desc">View and manage faculty records</div>
              </div>
            </div>
            <div className="activity-item" onClick={() => setActiveSection('reports')} style={{cursor: 'pointer'}}>
              <div className="activity-icon">📊</div>
              <div className="activity-content">
                <div className="activity-title">View Reports</div>
                <div className="activity-desc">Generate and view analytical reports</div>
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
          <button
            className={activeSection === 'upload' ? 'active' : ''}
            onClick={() => setActiveSection('upload')}
            aria-label="Data Upload"
          >
            <span role="img" aria-label="upload">📤</span> Data Upload
          </button>
        </nav>
        <div className="parent-user">
          <div className="parent-avatar" style={{background:'#a855f7'}}> 
            <span role="img" aria-label="admin">🛡️</span>
          </div>
          <div>
            <div>{adminInfo.name}</div>
            <div className="parent-user-role" style={{color:'#b91c1c'}}>{adminInfo.email || 'Administrator'}</div>
          </div>
        </div>
        <button className="parent-signout" onClick={handleSignOut}>↩ Sign Out</button>
      </aside>
      
      <main className="parent-main">
        {/* Render Dashboard, Reports, or Students without duplicate layouts */}
        {activeSection === 'dashboard' && renderDashboardContent()}
        {activeSection === 'reports' && <ReportAdmin embedded={true} />}
        {activeSection === 'students' && <StudentAdmin embedded={true} />}
        {activeSection === 'teachers' && <Teachers embedded={true} />}
        {activeSection === 'fee' && <FeeManagement embedded={true} />}
        {activeSection === 'upload' && <DataUpload embedded={true} />}
      </main>
    </div>
  );
}

export default AdminDashboard;