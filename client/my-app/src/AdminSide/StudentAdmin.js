import React, { useState, useEffect, useCallback } from 'react';
import './AdminDashboard.css';
import './StudentAdmin.css';
import { API_URL } from '../config';

function Students({ embedded = false }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [filters, setFilters] = useState({
    batch: '',
    branch: '',
    year: '',
    search: ''
  });

  // Fetch students from database
  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Please log in to view students.');
        setLoading(false);
        return;
      }
      
      console.log('Fetching students with token:', token?.substring(0, 20) + '...');
      
      const response = await fetch(`${API_URL}/api/admin/students`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Response status:', response.status);

      if (response.status === 401 || response.status === 403) {
        const errorData = await response.json();
        console.error('Auth error:', errorData);
        setError('Not authorized. Please log in as admin.');
        setLoading(false);
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Fetch error:', errorData);
        throw new Error(errorData.message || 'Failed to fetch students');
      }

      const data = await response.json();
      console.log('Students data received:', data);
      
      // Map database fields to component fields
      const mappedStudents = (data.students || []).map(student => ({
        id: student._id,
        name: student.studentName,
        rollNo: student.rollNo,
        branch: student.branch || student.class,
        year: student.year,
        batch: student.batch,
        semester: student.semester || '',
        email: student.email,
        phone: student.phone || '',
        attendance: student.attendance || 0,
        gpa: student.gpa || 0,
        status: student.status || 'Active',
        joinDate: student.createdAt
      }));

      setStudents(mappedStudents);
      setError(''); // Clear any previous errors
    } catch (err) {
      console.error('Error fetching students:', err);
      setError(err.message || 'Failed to load students. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  // Filter students based on filters
  const filteredStudents = students.filter(student => {
    return (
      (filters.batch === '' || student.batch === filters.batch) &&
      (filters.branch === '' || student.branch === filters.branch) &&
      (filters.year === '' || student.year === filters.year) &&
      (filters.search === '' || 
        student.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        student.email.toLowerCase().includes(filters.search.toLowerCase()) ||
        student.rollNo.toLowerCase().includes(filters.search.toLowerCase()))
    );
  });

  // Get unique values for filters
  const batches = [...new Set(students.map(student => student.batch))];
  const branches = [...new Set(students.map(student => student.branch))];
  const years = [...new Set(students.map(student => student.year))];

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleAddStudent = () => {
    // Add student functionality
    console.log('Add new student');
    alert('Add student feature - Coming soon!');
  };

  const handleClearAllStudents = async () => {
    if (!window.confirm('⚠️ WARNING: This will permanently delete ALL students from the database. This action cannot be undone. Are you absolutely sure?')) {
      return;
    }
    
    if (!window.confirm('This is your final confirmation. Type "DELETE" to proceed.') || 
        prompt('Type "DELETE" to confirm:') !== 'DELETE') {
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/admin/students`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        alert(`✅ Successfully cleared ${data.deletedCount} students from database`);
        fetchStudents();
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to clear students');
      }
    } catch (err) {
      console.error('Clear error:', err);
      alert('Failed to clear students. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditStudent = (student) => {
    setEditingStudent({
      id: student.id,
      studentName: student.name,
      rollNo: student.rollNo,
      email: student.email,
      branch: student.branch,
      year: student.year,
      batch: student.batch,
      semester: student.semester,
      phone: student.phone,
      attendance: student.attendance,
      gpa: student.gpa,
      status: student.status
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!editingStudent) return;

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Create update data without id field
      const updateData = {
        studentName: editingStudent.studentName,
        rollNo: editingStudent.rollNo,
        email: editingStudent.email,
        phone: editingStudent.phone,
        branch: editingStudent.branch,
        year: editingStudent.year,
        batch: editingStudent.batch,
        semester: editingStudent.semester,
        attendance: editingStudent.attendance,
        gpa: editingStudent.gpa,
        status: editingStudent.status
      };
      
      const response = await fetch(`${API_URL}/api/admin/students/${editingStudent.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });

      const data = await response.json();

      if (response.ok) {
        alert('✅ ' + data.message);
        setShowEditModal(false);
        setEditingStudent(null);
        fetchStudents();
      } else {
        alert('❌ ' + (data.message || 'Failed to update student'));
      }
    } catch (err) {
      console.error('Update error:', err);
      alert('❌ Failed to update student. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingStudent(null);
  };

  const handleDeleteStudent = async (student) => {
    // Delete student functionality
    if (window.confirm(`Are you sure you want to delete ${student.name}?`)) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/api/admin/students/${student.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          // Refresh the student list
          fetchStudents();
        } else {
          const data = await response.json();
          alert(data.message || 'Failed to delete student');
        }
      } catch (err) {
        console.error('Delete error:', err);
        alert('Failed to delete student. Please try again.');
      }
    }
  };

  if (loading) return <div className="loading">Loading students...</div>;
  if (error) return <div className="error-message">{error} <button onClick={fetchStudents}>Retry</button></div>;

  // Show empty state if no students
  if (students.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">🧑‍🎓</div>
        <h3>No Students Found</h3>
        <p>No student records in the database yet.</p>
        <p>Use the <strong>Data Upload</strong> feature to import students from an Excel file.</p>
      </div>
    );
  }

  // Main content that will be rendered in both embedded and full modes
  const studentsContent = (
    <>
      <header className="parent-header">
        <div>
          <h2>Student Management</h2>
          <span className="parent-welcome">Manage student information and records</span>
        </div>
        <div className="parent-actions">
          <button className="export-btn" onClick={handleAddStudent}>➕ Add Student</button>
          <button className="clear-all-btn" onClick={handleClearAllStudents} style={{marginLeft: '10px', background: '#ef4444'}}>🗑️ Clear All</button>
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
            className={`tab ${activeTab === 'attendance' ? 'active' : ''}`}
            onClick={() => setActiveTab('attendance')}
          >
            Attendance
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
          <label>Search Student</label>
          <input
            type="text"
            placeholder="Search by name, email, or roll number..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
        </div>
        <div className="filter-group">
          <label>Batch</label>
          <select 
            value={filters.batch} 
            onChange={(e) => handleFilterChange('batch', e.target.value)}
          >
            <option value="">All Batches</option>
            {batches.map(batch => (
              <option key={batch} value={batch}>{batch}</option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label>Branch</label>
          <select 
            value={filters.branch} 
            onChange={(e) => handleFilterChange('branch', e.target.value)}
          >
            <option value="">All Branches</option>
            {branches.map(branch => (
              <option key={branch} value={branch}>{branch}</option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label>Year</label>
          <select 
            value={filters.year} 
            onChange={(e) => handleFilterChange('year', e.target.value)}
          >
            <option value="">All Years</option>
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </section>

      {/* Summary Cards */}
      <section className="parent-cards">
        <div className="parent-card card-blue">
          <div>Total Students</div>
          <div className="parent-card-value">{filteredStudents.length}</div>
          <div className="parent-card-desc">Across all batches</div>
        </div>
        <div className="parent-card card-green">
          <div>Active Students</div>
          <div className="parent-card-value">
            {filteredStudents.filter(student => student.status === 'Active').length}
          </div>
          <div className="parent-card-desc">Currently enrolled</div>
        </div>
        <div className="parent-card card-purple">
          <div>Average Attendance</div>
          <div className="parent-card-value">
            {filteredStudents.length > 0 
              ? Math.round(filteredStudents.reduce((acc, student) => acc + student.attendance, 0) / filteredStudents.length) 
              : 0}%
          </div>
          <div className="parent-card-desc">Overall attendance rate</div>
        </div>
        <div className="parent-card card-orange">
          <div>New This Month</div>
          <div className="parent-card-value">2</div>
          <div className="parent-card-desc">Recently joined</div>
        </div>
      </section>

      {/* Students Table */}
      <section className="reports-table-container">
        <div className="reports-table-header">
          <h3>Student Details</h3>
          <span>Showing {filteredStudents.length} students</span>
        </div>
        
        <div className="reports-table">
          <table>
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Roll No</th>
                <th>Email</th>
                <th>Branch</th>
                <th>Year</th>
                <th>Batch</th>
                <th>Semester</th>
                <th>Attendance</th>
                <th>GPA</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map(student => (
                <tr key={student.id}>
                  <td>
                    <div className="student-info">
                      <div className="student-avatar" style={{background: '#a855f7'}}>
                        {student.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      {student.name}
                    </div>
                  </td>
                  <td>{student.rollNo}</td>
                  <td>{student.email}</td>
                  <td>{student.branch}</td>
                  <td>{student.year}</td>
                  <td>{student.batch}</td>
                  <td>{student.semester}</td>
                  <td>
                    <div className="attendance-display">
                      <span className={`attendance-value ${student.attendance < 75 ? 'low' : student.attendance < 85 ? 'medium' : 'high'}`}>
                        {student.attendance}%
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className={`gpa-value ${student.gpa < 7 ? 'low' : student.gpa < 8.5 ? 'medium' : 'high'}`}>
                      {student.gpa}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${student.status === 'Active' ? 'active' : 'inactive'}`}>
                      {student.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="edit-btn"
                        onClick={() => handleEditStudent(student)}
                        title="Edit Student"
                      >
                        ✏️
                      </button>
                      <button 
                        className="delete-btn"
                        onClick={() => handleDeleteStudent(student)}
                        title="Delete Student"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredStudents.length === 0 && (
            <div className="no-data">
              <span role="img" aria-label="no data">📭</span>
              <p>No students found matching your filters</p>
            </div>
          )}
        </div>
      </section>

      {/* Edit Student Modal */}
      {showEditModal && editingStudent && (
        <div className="modal-overlay" onClick={handleCloseEditModal}>
          <div className="edit-student-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>✏️ Edit Student - {editingStudent.studentName}</h3>
              <button className="close-btn" onClick={handleCloseEditModal}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label>Student Name <span className="required">*</span></label>
                  <input
                    type="text"
                    value={editingStudent.studentName}
                    onChange={(e) => setEditingStudent({...editingStudent, studentName: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Roll No <span className="required">*</span></label>
                  <input
                    type="text"
                    value={editingStudent.rollNo}
                    onChange={(e) => setEditingStudent({...editingStudent, rollNo: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Email <span className="required">*</span></label>
                  <input
                    type="email"
                    value={editingStudent.email}
                    onChange={(e) => setEditingStudent({...editingStudent, email: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="text"
                    value={editingStudent.phone}
                    onChange={(e) => setEditingStudent({...editingStudent, phone: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Branch</label>
                  <input
                    type="text"
                    value={editingStudent.branch}
                    onChange={(e) => setEditingStudent({...editingStudent, branch: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Year</label>
                  <input
                    type="text"
                    value={editingStudent.year}
                    onChange={(e) => setEditingStudent({...editingStudent, year: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Batch</label>
                  <input
                    type="text"
                    value={editingStudent.batch}
                    onChange={(e) => setEditingStudent({...editingStudent, batch: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Semester</label>
                  <input
                    type="text"
                    value={editingStudent.semester}
                    onChange={(e) => setEditingStudent({...editingStudent, semester: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Attendance (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={editingStudent.attendance}
                    onChange={(e) => setEditingStudent({...editingStudent, attendance: parseFloat(e.target.value)})}
                  />
                </div>
                <div className="form-group">
                  <label>GPA</label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    step="0.1"
                    value={editingStudent.gpa}
                    onChange={(e) => setEditingStudent({...editingStudent, gpa: parseFloat(e.target.value)})}
                  />
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={editingStudent.status}
                    onChange={(e) => setEditingStudent({...editingStudent, status: e.target.value})}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="cancel-btn" onClick={handleCloseEditModal}>
                Cancel
              </button>
              <button className="save-btn" onClick={handleSaveEdit}>
                💾 Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );

  // If embedded, just return the content without the layout wrapper
  if (embedded) {
    return <div className="students-embedded">{studentsContent}</div>;
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
          <span>Students</span>
        </div>
        <div className="parent-powered">
          by <a href="https://edutrackers.com" target="_blank" rel="noopener noreferrer">EduTrackers</a>
        </div>
        <nav className="parent-nav">
           <a href="/admin-dashboard"><span role="img" aria-label="dashboard">📋</span> Dashboard</a>
                <button type="button"><span role="img" aria-label="notifications">🔔</span> Notifications</button>
                <button type="button"><span role="img" aria-label="reports">📄</span> Reports</button>
                <button type="button" class="active"><span role="img" aria-label="students">🧑‍🎓</span> Students</button>
                <button type="button"><span role="img" aria-label="teachers">🧑‍🏫</span> Teachers</button>
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
        {studentsContent}
      </main>
    </div>
  );
}

export default Students;