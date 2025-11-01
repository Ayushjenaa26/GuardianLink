import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';

function Students({ embedded = false }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [filters, setFilters] = useState({
    batch: '',
    class: '',
    year: '',
    search: ''
  });

  // Mock data - replace with actual API calls
  useEffect(() => {
    setTimeout(() => {
      const mockStudents = [
        {
          id: 1,
          name: 'Aarav Sharma',
          rollNo: 'CS2024001',
          class: 'Computer Science',
          year: 'Final Year',
          batch: '2024',
          email: 'aarav.sharma@college.edu',
          phone: '+91 9876543210',
          attendance: 92,
          gpa: 8.7,
          status: 'Active',
          joinDate: '2021-08-15'
        },
        {
          id: 2,
          name: 'Priya Patel',
          rollNo: 'IT2024001',
          class: 'Information Technology',
          year: 'Final Year',
          batch: '2024',
          email: 'priya.patel@college.edu',
          phone: '+91 9876543211',
          attendance: 88,
          gpa: 9.2,
          status: 'Active',
          joinDate: '2021-08-15'
        },
        {
          id: 3,
          name: 'Rohan Kumar',
          rollNo: 'CS2025001',
          class: 'Computer Science',
          year: 'Third Year',
          batch: '2025',
          email: 'rohan.kumar@college.edu',
          phone: '+91 9876543212',
          attendance: 95,
          gpa: 8.9,
          status: 'Active',
          joinDate: '2022-08-15'
        },
        {
          id: 4,
          name: 'Sneha Gupta',
          rollNo: 'EC2025001',
          class: 'Electronics',
          year: 'Third Year',
          batch: '2025',
          email: 'sneha.gupta@college.edu',
          phone: '+91 9876543213',
          attendance: 85,
          gpa: 8.1,
          status: 'Active',
          joinDate: '2022-08-15'
        },
        {
          id: 5,
          name: 'Vikram Singh',
          rollNo: 'ME2026001',
          class: 'Mechanical',
          year: 'Second Year',
          batch: '2026',
          email: 'vikram.singh@college.edu',
          phone: '+91 9876543214',
          attendance: 78,
          gpa: 7.8,
          status: 'Active',
          joinDate: '2023-08-15'
        },
        {
          id: 6,
          name: 'Ananya Reddy',
          rollNo: 'CS2026001',
          class: 'Computer Science',
          year: 'Second Year',
          batch: '2026',
          email: 'ananya.reddy@college.edu',
          phone: '+91 9876543215',
          attendance: 96,
          gpa: 9.4,
          status: 'Active',
          joinDate: '2023-08-15'
        }
      ];
      setStudents(mockStudents);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter students based on filters
  const filteredStudents = students.filter(student => {
    return (
      (filters.batch === '' || student.batch === filters.batch) &&
      (filters.class === '' || student.class === filters.class) &&
      (filters.year === '' || student.year === filters.year) &&
      (filters.search === '' || 
        student.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        student.email.toLowerCase().includes(filters.search.toLowerCase()) ||
        student.rollNo.toLowerCase().includes(filters.search.toLowerCase()))
    );
  });

  // Get unique values for filters
  const batches = [...new Set(students.map(student => student.batch))];
  const classes = [...new Set(students.map(student => student.class))];
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
  };

  const handleEditStudent = (student) => {
    // Edit student functionality
    console.log('Edit student:', student);
  };

  const handleDeleteStudent = (student) => {
    // Delete student functionality
    if (window.confirm(`Are you sure you want to delete ${student.name}?`)) {
      console.log('Delete student:', student);
    }
  };

  if (loading) return <div className="loading">Loading students...</div>;

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
            Student Details
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
          <label>Class</label>
          <select 
            value={filters.class} 
            onChange={(e) => handleFilterChange('class', e.target.value)}
          >
            <option value="">All Classes</option>
            {classes.map(cls => (
              <option key={cls} value={cls}>{cls}</option>
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
                <th>Class</th>
                <th>Year</th>
                <th>Batch</th>
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
                  <td>{student.class}</td>
                  <td>{student.year}</td>
                  <td>{student.batch}</td>
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