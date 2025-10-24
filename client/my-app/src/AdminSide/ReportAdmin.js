import React, { useState, useEffect } from 'react';
import '../ParentSide/ParentDashboard.css';

function Reports({ embedded = false }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    batch: '',
    class: '',
    year: '',
    search: ''
  });

  // Mock data - replace with actual API calls
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockStudents = [
        {
          id: 1,
          name: 'Aarav Sharma',
          batch: '2024',
          class: 'Computer Science',
          year: 'Final Year',
          attendance: 92,
          gpa: 8.7,
          email: 'aarav.sharma@college.edu'
        },
        {
          id: 2,
          name: 'Priya Patel',
          batch: '2024',
          class: 'Information Technology',
          year: 'Final Year',
          attendance: 88,
          gpa: 9.2,
          email: 'priya.patel@college.edu'
        },
        {
          id: 3,
          name: 'Rohan Kumar',
          batch: '2025',
          class: 'Computer Science',
          year: 'Third Year',
          attendance: 95,
          gpa: 8.9,
          email: 'rohan.kumar@college.edu'
        },
        {
          id: 4,
          name: 'Sneha Gupta',
          batch: '2025',
          class: 'Electronics',
          year: 'Third Year',
          attendance: 85,
          gpa: 8.1,
          email: 'sneha.gupta@college.edu'
        },
        {
          id: 5,
          name: 'Vikram Singh',
          batch: '2026',
          class: 'Mechanical',
          year: 'Second Year',
          attendance: 78,
          gpa: 7.8,
          email: 'vikram.singh@college.edu'
        },
        {
          id: 6,
          name: 'Ananya Reddy',
          batch: '2026',
          class: 'Computer Science',
          year: 'Second Year',
          attendance: 96,
          gpa: 9.4,
          email: 'ananya.reddy@college.edu'
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
        student.email.toLowerCase().includes(filters.search.toLowerCase()))
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

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Batch', 'Class', 'Year', 'Attendance %', 'GPA'];
    const csvData = filteredStudents.map(student => [
      student.name,
      student.email,
      student.batch,
      student.class,
      student.year,
      student.attendance,
      student.gpa
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'student-reports.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) return (<div className="loading">Loading reports...</div>);

  // Main content that will be rendered in both embedded and full modes
  const reportsContent = (
    <>
      <header className="parent-header">
        <div>
          <h2>Student Reports</h2>
          <span className="parent-welcome">Comprehensive academic and attendance reports</span>
        </div>
        <div className="parent-actions">
          <button className="export-btn" onClick={exportToCSV}>📥 Export CSV</button>
        </div>
      </header>

      {/* Filters Section */}
      <section className="reports-filters">
        <div className="filter-group">
          <label>Search Student</label>
          <input
            type="text"
            placeholder="Search by name or email..."
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
          <div>Average Attendance</div>
          <div className="parent-card-value">
            {filteredStudents.length > 0 
              ? Math.round(filteredStudents.reduce((acc, student) => acc + student.attendance, 0) / filteredStudents.length) 
              : 0}%
          </div>
          <div className="parent-card-desc">Overall attendance rate</div>
        </div>
        <div className="parent-card card-purple">
          <div>Average GPA</div>
          <div className="parent-card-value">
            {filteredStudents.length > 0 
              ? (filteredStudents.reduce((acc, student) => acc + student.gpa, 0) / filteredStudents.length).toFixed(1)
              : '0.0'}
          </div>
          <div className="parent-card-desc">Overall academic performance</div>
        </div>
        <div className="parent-card card-orange">
          <div>Low Attendance</div>
          <div className="parent-card-value">
            {filteredStudents.filter(student => student.attendance < 75).length}
          </div>
          <div className="parent-card-desc">Below 75% attendance</div>
        </div>
      </section>

      {/* Reports Table */}
      <section className="reports-table-container">
        <div className="reports-table-header">
          <h3>Student Performance Details</h3>
          <span>Showing {filteredStudents.length} students</span>
        </div>
        
        <div className="reports-table">
          <table>
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Email</th>
                <th>Batch</th>
                <th>Class</th>
                <th>Year</th>
                <th>Attendance</th>
                <th>GPA</th>
                <th>Performance</th>
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
                  <td>{student.email}</td>
                  <td>{student.batch}</td>
                  <td>{student.class}</td>
                  <td>{student.year}</td>
                  <td>
                    <div className="attendance-display">
                      <span className={`attendance-value ${student.attendance < 75 ? 'low' : student.attendance < 85 ? 'medium' : 'high'}`}>
                        {student.attendance}%
                      </span>
                      <div className="attendance-bar">
                        <div 
                          className={`attendance-fill ${student.attendance < 75 ? 'low' : student.attendance < 85 ? 'medium' : 'high'}`}
                          style={{width: `${student.attendance}%`}}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`gpa-value ${student.gpa < 7 ? 'low' : student.gpa < 8.5 ? 'medium' : 'high'}`}>
                      {student.gpa}
                    </span>
                  </td>
                  <td>
                    <span className={`performance-badge ${
                      student.attendance >= 85 && student.gpa >= 8.5 ? 'excellent' :
                      student.attendance >= 75 && student.gpa >= 7 ? 'good' : 'needs-improvement'
                    }`}>
                      {student.attendance >= 85 && student.gpa >= 8.5 ? 'Excellent' :
                       student.attendance >= 75 && student.gpa >= 7 ? 'Good' : 'Needs Improvement'}
                    </span>
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
    return <div className="reports-embedded">{reportsContent}</div>;
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
          <span>Reports</span>
        </div>
        <div className="parent-powered">
          by <a href="https://edutrackers.com" target="_blank" rel="noopener noreferrer">EduTrackers</a>
        </div>
        <nav className="parent-nav">
          <a href="/admin-dashboard"><span role="img" aria-label="dashboard">📋</span> Dashboard</a>
          <button type="button"><span role="img" aria-label="notifications">🔔</span> Notifications</button>
          <button type="button" className="active"><span role="img" aria-label="reports">📄</span> Reports</button>
          <button type="button"><span role="img" aria-label="students">🧑‍🎓</span> Students</button>
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
        {reportsContent}
      </main>
    </div>
  );
}

export default Reports;