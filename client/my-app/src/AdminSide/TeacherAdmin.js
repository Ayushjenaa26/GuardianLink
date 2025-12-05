// Teachers.js (Admin Dashboard)
import React, { useState, useEffect, useCallback } from 'react';
import './TeacherAdmin.css';
import { API_URL } from '../config';

function Teachers({ embedded = false }) {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [filters, setFilters] = useState({
    department: '',
    designation: '',
    status: '',
    search: ''
  });

  // Fetch teachers from database
  const fetchTeachers = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Please log in to view teachers.');
        setLoading(false);
        return;
      }
      
      const response = await fetch(`${API_URL}/api/admin/teachers`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 401 || response.status === 403) {
        setError('Not authorized. Please log in as admin.');
        setLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch teachers');
      }

      const data = await response.json();
      
      // Map database fields to component fields
      const mappedTeachers = (data.teachers || []).map(teacher => ({
        id: teacher._id,
        name: teacher.teacherName,
        employeeId: teacher.employeeId,
        department: teacher.department || '',
        designation: teacher.designation || 'Teacher',
        email: teacher.email,
        phone: teacher.phone || '',
        subjects: teacher.subject ? [teacher.subject] : [],
        experience: teacher.experience || '0 years',
        qualification: teacher.qualification || '',
        classes: teacher.classes ? (Array.isArray(teacher.classes) ? teacher.classes.length : teacher.classes.split(',').length) : 0,
        students: 0, // Calculate based on classes if needed
        joinDate: teacher.createdAt,
        status: teacher.status || 'Active',
        attendance: teacher.attendance || 95
      }));

      setTeachers(mappedTeachers);
      setError(''); // Clear any previous errors
    } catch (err) {
      console.error('Error fetching teachers:', err);
      setError('Failed to load teachers. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);

  // Filter teachers based on filters
  const filteredTeachers = teachers.filter(teacher => {
    return (
      (filters.department === '' || teacher.department === filters.department) &&
      (filters.designation === '' || teacher.designation === filters.designation) &&
      (filters.status === '' || teacher.status === filters.status) &&
      (filters.search === '' || 
        teacher.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        teacher.email.toLowerCase().includes(filters.search.toLowerCase()) ||
        teacher.employeeId.toLowerCase().includes(filters.search.toLowerCase()))
    );
  });

  // Get unique values for filters
  const departments = [...new Set(teachers.map(teacher => teacher.department))];
  const designations = [...new Set(teachers.map(teacher => teacher.designation))];
  const statuses = [...new Set(teachers.map(teacher => teacher.status))];

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleAddTeacher = () => {
    // Add teacher functionality
    console.log('Add new teacher');
  };

  const handleEditTeacher = (teacher) => {
    // Edit teacher functionality
    console.log('Edit teacher:', teacher);
  };

  const handleDeleteTeacher = async (teacher) => {
    // Delete teacher functionality
    if (window.confirm(`Are you sure you want to delete ${teacher.name}?`)) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/api/admin/teachers/${teacher.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          // Refresh the teacher list
          fetchTeachers();
        } else {
          const data = await response.json();
          alert(data.message || 'Failed to delete teacher');
        }
      } catch (err) {
        console.error('Delete error:', err);
        alert('Failed to delete teacher. Please try again.');
      }
    }
  };

  const handleViewDetails = (teacher) => {
    // View teacher details functionality
    console.log('View teacher details:', teacher);
  };

  if (loading) return <div className="loading">Loading teachers...</div>;
  if (error) return <div className="error-message">{error} <button onClick={fetchTeachers}>Retry</button></div>;

  // Show empty state if no teachers
  if (teachers.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">🧑‍🏫</div>
        <h3>No Teachers Found</h3>
        <p>No teacher records in the database yet.</p>
        <p>Use the <strong>Data Upload</strong> feature to import teachers from an Excel file.</p>
      </div>
    );
  }

  // Main content that will be rendered in both embedded and full modes
  const teachersContent = (
    <>
      <header className="parent-header">
        <div>
          <h2>Teacher Management</h2>
          <span className="parent-welcome">Manage faculty information and records</span>
        </div>
        <div className="parent-actions">
          <button className="export-btn" onClick={handleAddTeacher}>➕ Add Teacher</button>
        </div>
      </header>

      {/* Tabs Section */}
      <section className="students-tabs">
        <div className="tabs-container">
          <button 
            className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`tab ${activeTab === 'details' ? 'active' : ''}`}
            onClick={() => setActiveTab('details')}
          >
            Teacher Details
          </button>
          <button 
            className={`tab ${activeTab === 'schedule' ? 'active' : ''}`}
            onClick={() => setActiveTab('schedule')}
          >
            Teaching Schedule
          </button>
          <button 
            className={`tab ${activeTab === 'performance' ? 'active' : ''}`}
            onClick={() => setActiveTab('performance')}
          >
            Performance
          </button>
        </div>
      </section>

      {/* Filters Section */}
      <section className="reports-filters">
        <div className="filter-group">
          <label>Search Teacher</label>
          <input
            type="text"
            placeholder="Search by name, email, or employee ID..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
        </div>
        <div className="filter-group">
          <label>Department</label>
          <select 
            value={filters.department} 
            onChange={(e) => handleFilterChange('department', e.target.value)}
          >
            <option value="">All Departments</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label>Designation</label>
          <select 
            value={filters.designation} 
            onChange={(e) => handleFilterChange('designation', e.target.value)}
          >
            <option value="">All Designations</option>
            {designations.map(designation => (
              <option key={designation} value={designation}>{designation}</option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label>Status</label>
          <select 
            value={filters.status} 
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value="">All Status</option>
            {statuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      </section>

      {/* Summary Cards */}
      <section className="parent-cards">
        <div className="parent-card card-blue">
          <div>Total Teachers</div>
          <div className="parent-card-value">{filteredTeachers.length}</div>
          <div className="parent-card-desc">Across all departments</div>
        </div>
        <div className="parent-card card-green">
          <div>Active Teachers</div>
          <div className="parent-card-value">
            {filteredTeachers.filter(teacher => teacher.status === 'Active').length}
          </div>
          <div className="parent-card-desc">Currently teaching</div>
        </div>
        <div className="parent-card card-purple">
          <div>Average Experience</div>
          <div className="parent-card-value">
            {filteredTeachers.length > 0 
              ? Math.round(filteredTeachers.reduce((acc, teacher) => {
                  const exp = parseInt(teacher.experience);
                  return acc + (isNaN(exp) ? 0 : exp);
                }, 0) / filteredTeachers.length)
              : 0} yrs
          </div>
          <div className="parent-card-desc">Teaching experience</div>
        </div>
        <div className="parent-card card-orange">
          <div>Total Students</div>
          <div className="parent-card-value">
            {filteredTeachers.reduce((acc, teacher) => acc + teacher.students, 0)}
          </div>
          <div className="parent-card-desc">Under guidance</div>
        </div>
      </section>

      {/* Teachers Table */}
      <section className="reports-table-container">
        <div className="reports-table-header">
          <h3>Teacher Details</h3>
          <span>Showing {filteredTeachers.length} teachers</span>
        </div>
        
        <div className="reports-table">
          <table>
            <thead>
              <tr>
                <th>Teacher Name</th>
                <th>Employee ID</th>
                <th>Email</th>
                <th>Department</th>
                <th>Designation</th>
                <th>Subjects</th>
                <th>Experience</th>
                <th>Classes</th>
                <th>Attendance</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTeachers.map(teacher => (
                <tr key={teacher.id}>
                  <td>
                    <div className="student-info">
                      <div className="student-avatar" style={{background: '#22c55e'}}>
                        {teacher.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      {teacher.name}
                    </div>
                  </td>
                  <td>{teacher.employeeId}</td>
                  <td>{teacher.email}</td>
                  <td>{teacher.department}</td>
                  <td>{teacher.designation}</td>
                  <td>
                    <div className="subjects-list">
                      {teacher.subjects.slice(0, 2).map((subject, index) => (
                        <span key={index} className="subject-tag">{subject}</span>
                      ))}
                      {teacher.subjects.length > 2 && (
                        <span className="more-subjects">+{teacher.subjects.length - 2} more</span>
                      )}
                    </div>
                  </td>
                  <td>{teacher.experience}</td>
                  <td>
                    <span className="classes-count">{teacher.classes} classes</span>
                  </td>
                  <td>
                    <div className="attendance-display">
                      <span className={`attendance-value ${teacher.attendance < 85 ? 'low' : teacher.attendance < 95 ? 'medium' : 'high'}`}>
                        {teacher.attendance}%
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge ${teacher.status === 'Active' ? 'active' : teacher.status === 'On Leave' ? 'leave' : 'inactive'}`}>
                      {teacher.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="view-btn"
                        onClick={() => handleViewDetails(teacher)}
                        title="View Details"
                      >
                        👁️
                      </button>
                      <button 
                        className="edit-btn"
                        onClick={() => handleEditTeacher(teacher)}
                        title="Edit Teacher"
                      >
                        ✏️
                      </button>
                      <button 
                        className="delete-btn"
                        onClick={() => handleDeleteTeacher(teacher)}
                        title="Delete Teacher"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredTeachers.length === 0 && (
            <div className="no-data">
              <span role="img" aria-label="no data">👨‍🏫</span>
              <p>No teachers found matching your filters</p>
            </div>
          )}
        </div>
      </section>

      {/* Department Statistics */}
      <section className="department-stats">
        <div className="section-header">
          <h3>Department-wise Distribution</h3>
          <span>Teacher count by department</span>
        </div>
        <div className="stats-grid">
          {departments.map(dept => {
            const deptTeachers = filteredTeachers.filter(t => t.department === dept);
            const activeTeachers = deptTeachers.filter(t => t.status === 'Active').length;
            
            return (
              <div key={dept} className="dept-stat-card">
                <div className="dept-name">{dept}</div>
                <div className="dept-count">{deptTeachers.length} Teachers</div>
                <div className="dept-active">{activeTeachers} Active</div>
                <div className="dept-progress">
                  <div 
                    className="dept-progress-bar" 
                    style={{width: `${(deptTeachers.length / Math.max(...departments.map(d => filteredTeachers.filter(t => t.department === d).length))) * 80}%`}}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );

  // If embedded, just return the content without the layout wrapper
  if (embedded) {
    return <div className="teachers-embedded">{teachersContent}</div>;
  }

  // If not embedded, return the full layout with sidebar
  return (
    <div className="parent-layout">
      <aside className="parent-sidebar">
        <div className="parent-logo">
          <img src="/logo192.png" alt="GuardianLink" />
          <span>GuardianLink</span>
        </div>
        <div className="parent-role">
          <span className="parent-role-badge" style={{background:'#fee2e2', color:'#b91c1c'}}>admin</span>
          <span>Teachers</span>
        </div>
        <div className="parent-powered">
          by <a href="https://edutrackers.com" target="_blank" rel="noopener noreferrer">EduTrackers</a>
        </div>
        <nav className="parent-nav">
          <a href="/admin-dashboard"><span role="img" aria-label="dashboard">📋</span> Dashboard</a>
          <button type="button"><span role="img" aria-label="notifications">🔔</span> Notifications</button>
          <button type="button"><span role="img" aria-label="reports">📄</span> Reports</button>
          <button type="button"><span role="img" aria-label="students">🧑‍🎓</span> Students</button>
          <button type="button" className="active"><span role="img" aria-label="teachers">🧑‍🏫</span> Teachers</button>
          <button type="button"><span role="img" aria-label="fee">💳</span> Fee Management</button>
          <button type="button"><span role="img" aria-label="security">🛡️</span> Security & Audit</button>
          <button type="button"><span role="img" aria-label="settings">⚙️</span> Settings</button>
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
        {teachersContent}
      </main>
    </div>
  );
}

export default Teachers;