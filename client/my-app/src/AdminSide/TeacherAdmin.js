// Teachers.js (Admin Dashboard)
import React, { useState, useEffect, useCallback } from 'react';
import './TeacherAdmin.css';
import './TeacherAdminModals.css';
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
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [editingTeacher, setEditingTeacher] = useState(null);

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
        const errorData = await response.json().catch(() => ({}));
        console.error('Fetch teachers failed:', response.status, errorData);
        throw new Error(errorData.message || 'Failed to fetch teachers');
      }

      const data = await response.json();
      console.log('✅ Teachers fetched:', data);
      
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
        branches: teacher.branches ? (Array.isArray(teacher.branches) ? teacher.branches.length : teacher.branches.split(',').length) : 0,
        students: 0, // Calculate based on branches if needed
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
    setEditingTeacher({...teacher});
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!editingTeacher) return;

    try {
      const token = localStorage.getItem('token');
      const updateData = {
        teacherName: editingTeacher.name,
        employeeId: editingTeacher.employeeId,
        email: editingTeacher.email,
        phone: editingTeacher.phone,
        department: editingTeacher.department,
        designation: editingTeacher.designation,
        subject: editingTeacher.subjects[0] || '',
        experience: editingTeacher.experience,
        qualification: editingTeacher.qualification,
        status: editingTeacher.status
      };

      const response = await fetch(`${API_URL}/api/admin/teachers/${editingTeacher.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });

      if (response.ok) {
        alert('✅ Teacher updated successfully!');
        setShowEditModal(false);
        setEditingTeacher(null);
        fetchTeachers();
      } else {
        const data = await response.json();
        alert(`❌ ${data.message || 'Failed to update teacher'}`);
      }
    } catch (err) {
      console.error('Update error:', err);
      alert('❌ Failed to update teacher. Please try again.');
    }
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
    setSelectedTeacher(teacher);
    setShowViewModal(true);
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
                <th>Specialized Subject</th>
                <th>Experience</th>
                <th>Branches</th>
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
                    <span className="classes-count">{teacher.branches} branches</span>
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
    return (
      <div className="teachers-embedded">
        {teachersContent}
        
        {/* View Teacher Modal */}
        {showViewModal && selectedTeacher && (
          <div className="modal-overlay" onClick={() => setShowViewModal(false)}>
            <div className="view-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>👁️ Teacher Details</h2>
                <button className="close-btn" onClick={() => setShowViewModal(false)}>✕</button>
              </div>
              <div className="modal-body">
                <div className="teacher-info-grid">
                  <div className="info-item">
                    <label>Teacher Name</label>
                    <p>{selectedTeacher.name}</p>
                  </div>
                  <div className="info-item">
                    <label>Employee ID</label>
                    <p>{selectedTeacher.employeeId}</p>
                  </div>
                  <div className="info-item">
                    <label>Email</label>
                    <p>{selectedTeacher.email}</p>
                  </div>
                  <div className="info-item">
                    <label>Phone</label>
                    <p>{selectedTeacher.phone || 'N/A'}</p>
                  </div>
                  <div className="info-item">
                    <label>Department</label>
                    <p>{selectedTeacher.department}</p>
                  </div>
                  <div className="info-item">
                    <label>Designation</label>
                    <p>{selectedTeacher.designation}</p>
                  </div>
                  <div className="info-item">
                    <label>Specialized Subject</label>
                    <p>{selectedTeacher.subjects.join(', ') || 'N/A'}</p>
                  </div>
                  <div className="info-item">
                    <label>Experience</label>
                    <p>{selectedTeacher.experience}</p>
                  </div>
                  <div className="info-item">
                    <label>Qualification</label>
                    <p>{selectedTeacher.qualification || 'N/A'}</p>
                  </div>
                  <div className="info-item">
                    <label>Branches</label>
                    <p>{selectedTeacher.branches} branches</p>
                  </div>
                  <div className="info-item">
                    <label>Attendance</label>
                    <p>{selectedTeacher.attendance}%</p>
                  </div>
                  <div className="info-item">
                    <label>Status</label>
                    <p>
                      <span className={`status-badge ${selectedTeacher.status === 'Active' ? 'active' : 'inactive'}`}>
                        {selectedTeacher.status}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button className="cancel-btn" onClick={() => setShowViewModal(false)}>Close</button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Teacher Modal */}
        {showEditModal && editingTeacher && (
          <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
            <div className="edit-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>✏️ Edit Teacher</h2>
                <button className="close-btn" onClick={() => setShowEditModal(false)}>✕</button>
              </div>
              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-group">
                    <label>Teacher Name <span className="required">*</span></label>
                    <input
                      type="text"
                      value={editingTeacher.name}
                      onChange={(e) => setEditingTeacher({...editingTeacher, name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Employee ID <span className="required">*</span></label>
                    <input
                      type="text"
                      value={editingTeacher.employeeId}
                      onChange={(e) => setEditingTeacher({...editingTeacher, employeeId: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Email <span className="required">*</span></label>
                    <input
                      type="email"
                      value={editingTeacher.email}
                      onChange={(e) => setEditingTeacher({...editingTeacher, email: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      type="tel"
                      value={editingTeacher.phone}
                      onChange={(e) => setEditingTeacher({...editingTeacher, phone: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Department <span className="required">*</span></label>
                    <input
                      type="text"
                      value={editingTeacher.department}
                      onChange={(e) => setEditingTeacher({...editingTeacher, department: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Designation</label>
                    <input
                      type="text"
                      value={editingTeacher.designation}
                      onChange={(e) => setEditingTeacher({...editingTeacher, designation: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Specialized Subject</label>
                    <input
                      type="text"
                      value={editingTeacher.subjects[0] || ''}
                      onChange={(e) => setEditingTeacher({...editingTeacher, subjects: [e.target.value]})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Experience</label>
                    <input
                      type="text"
                      value={editingTeacher.experience}
                      onChange={(e) => setEditingTeacher({...editingTeacher, experience: e.target.value})}
                      placeholder="e.g., 5 years"
                    />
                  </div>
                  <div className="form-group">
                    <label>Qualification</label>
                    <input
                      type="text"
                      value={editingTeacher.qualification || ''}
                      onChange={(e) => setEditingTeacher({...editingTeacher, qualification: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Status</label>
                    <select
                      value={editingTeacher.status}
                      onChange={(e) => setEditingTeacher({...editingTeacher, status: e.target.value})}
                    >
                      <option value="Active">Active</option>
                      <option value="On Leave">On Leave</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button className="cancel-btn" onClick={() => setShowEditModal(false)}>Cancel</button>
                <button className="save-btn" onClick={handleSaveEdit}>Save Changes</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
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