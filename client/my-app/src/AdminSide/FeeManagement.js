// FeeManagement.js
import React, { useState, useEffect } from 'react';
import './FeeManagement.css';

function FeeManagement({ embedded = false }) {
  const [feeData, setFeeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [filters, setFilters] = useState({
    academicYear: '',
    semester: '',
    status: '',
    search: ''
  });

  // Mock data - replace with actual API calls
  useEffect(() => {
    setTimeout(() => {
      const mockFeeData = [
        {
          id: 1,
          studentName: 'Aarav Sharma',
          rollNo: 'CS2024001',
          class: 'Computer Science',
          academicYear: '2024-25',
          semester: 'Semester 4',
          feeType: 'Tuition Fee',
          amount: 25000,
          paidAmount: 25000,
          dueDate: '2025-01-15',
          paymentDate: '2025-01-12',
          status: 'Paid',
          paymentMethod: 'Online Transfer',
          transactionId: 'TXN001234'
        },
        {
          id: 2,
          studentName: 'Priya Patel',
          rollNo: 'IT2024001',
          class: 'Information Technology',
          academicYear: '2024-25',
          semester: 'Semester 4',
          feeType: 'Tuition Fee',
          amount: 25000,
          paidAmount: 20000,
          dueDate: '2025-01-15',
          paymentDate: '',
          status: 'Partial',
          paymentMethod: '',
          transactionId: ''
        },
        {
          id: 3,
          studentName: 'Rohan Kumar',
          rollNo: 'CS2025001',
          class: 'Computer Science',
          academicYear: '2024-25',
          semester: 'Semester 3',
          feeType: 'Development Fee',
          amount: 10000,
          paidAmount: 0,
          dueDate: '2025-01-25',
          paymentDate: '',
          status: 'Pending',
          paymentMethod: '',
          transactionId: ''
        },
        {
          id: 4,
          studentName: 'Sneha Gupta',
          rollNo: 'EC2025001',
          class: 'Electronics',
          academicYear: '2024-25',
          semester: 'Semester 3',
          feeType: 'Tuition Fee',
          amount: 25000,
          paidAmount: 25000,
          dueDate: '2025-01-15',
          paymentDate: '2025-01-10',
          status: 'Paid',
          paymentMethod: 'Credit Card',
          transactionId: 'TXN001235'
        },
        {
          id: 5,
          studentName: 'Vikram Singh',
          rollNo: 'ME2026001',
          class: 'Mechanical',
          academicYear: '2024-25',
          semester: 'Semester 2',
          feeType: 'Examination Fee',
          amount: 5000,
          paidAmount: 5000,
          dueDate: '2025-02-01',
          paymentDate: '2025-01-20',
          status: 'Paid',
          paymentMethod: 'UPI',
          transactionId: 'TXN001236'
        },
        {
          id: 6,
          studentName: 'Ananya Reddy',
          rollNo: 'CS2026001',
          class: 'Computer Science',
          academicYear: '2024-25',
          semester: 'Semester 2',
          feeType: 'Library Fee',
          amount: 2000,
          paidAmount: 0,
          dueDate: '2025-02-15',
          paymentDate: '',
          status: 'Pending',
          paymentMethod: '',
          transactionId: ''
        },
        {
          id: 7,
          studentName: 'Karan Malhotra',
          rollNo: 'IT2025001',
          class: 'Information Technology',
          academicYear: '2024-25',
          semester: 'Semester 3',
          feeType: 'Laboratory Fee',
          amount: 8000,
          paidAmount: 8000,
          dueDate: '2025-01-20',
          paymentDate: '2025-01-18',
          status: 'Paid',
          paymentMethod: 'Debit Card',
          transactionId: 'TXN001237'
        },
        {
          id: 8,
          studentName: 'Neha Sharma',
          rollNo: 'EC2026001',
          class: 'Electronics',
          academicYear: '2024-25',
          semester: 'Semester 2',
          feeType: 'Tuition Fee',
          amount: 25000,
          paidAmount: 15000,
          dueDate: '2025-01-15',
          paymentDate: '',
          status: 'Partial',
          paymentMethod: '',
          transactionId: ''
        }
      ];
      setFeeData(mockFeeData);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter fee data based on filters
  const filteredFeeData = feeData.filter(fee => {
    return (
      (filters.academicYear === '' || fee.academicYear === filters.academicYear) &&
      (filters.semester === '' || fee.semester === filters.semester) &&
      (filters.status === '' || fee.status === filters.status) &&
      (filters.search === '' || 
        fee.studentName.toLowerCase().includes(filters.search.toLowerCase()) ||
        fee.rollNo.toLowerCase().includes(filters.search.toLowerCase()) ||
        fee.feeType.toLowerCase().includes(filters.search.toLowerCase()))
    );
  });

  // Get unique values for filters
  const academicYears = [...new Set(feeData.map(fee => fee.academicYear))];
  const semesters = [...new Set(feeData.map(fee => fee.semester))];
  const statuses = [...new Set(feeData.map(fee => fee.status))];
  const feeTypes = [...new Set(feeData.map(fee => fee.feeType))];

  // Calculate statistics
  const totalRevenue = feeData.reduce((sum, fee) => sum + fee.paidAmount, 0);
  const pendingAmount = feeData.reduce((sum, fee) => sum + (fee.amount - fee.paidAmount), 0);
  const totalStudents = [...new Set(feeData.map(fee => fee.rollNo))].length;
  const paidStudents = [...new Set(feeData.filter(fee => fee.status === 'Paid').map(fee => fee.rollNo))].length;

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleAddFee = () => {
    // Add fee functionality
    console.log('Add new fee record');
  };

  const handleEditFee = (fee) => {
    // Edit fee functionality
    console.log('Edit fee:', fee);
  };

  const handleDeleteFee = (fee) => {
    // Delete fee functionality
    if (window.confirm(`Are you sure you want to delete fee record for ${fee.studentName}?`)) {
      console.log('Delete fee:', fee);
    }
  };

  const handleGenerateReceipt = (fee) => {
    // Generate receipt functionality
    console.log('Generate receipt for:', fee);
  };

  const handleSendReminder = (fee) => {
    // Send reminder functionality
    console.log('Send reminder for:', fee);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) return <div className="loading">Loading fee data...</div>;

  // Main content that will be rendered in both embedded and full modes
  const feeContent = (
    <>
      <header className="parent-header">
        <div>
          <h2>Fee Management</h2>
          <span className="parent-welcome">Manage student fees, payments, and financial records</span>
        </div>
        <div className="parent-actions">
          <button className="export-btn" onClick={handleAddFee}>💰 Add Fee Record</button>
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
            className={`tab ${activeTab === 'transactions' ? 'active' : ''}`}
            onClick={() => setActiveTab('transactions')}
          >
            Transactions
          </button>
          <button 
            className={`tab ${activeTab === 'reports' ? 'active' : ''}`}
            onClick={() => setActiveTab('reports')}
          >
            Reports
          </button>
          <button 
            className={`tab ${activeTab === 'pending' ? 'active' : ''}`}
            onClick={() => setActiveTab('pending')}
          >
            Pending Fees
          </button>
        </div>
      </section>

      {/* Filters Section */}
      <section className="reports-filters">
        <div className="filter-group">
          <label>Search</label>
          <input
            type="text"
            placeholder="Search by student name, roll no, or fee type..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
        </div>
        <div className="filter-group">
          <label>Academic Year</label>
          <select 
            value={filters.academicYear} 
            onChange={(e) => handleFilterChange('academicYear', e.target.value)}
          >
            <option value="">All Years</option>
            {academicYears.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label>Semester</label>
          <select 
            value={filters.semester} 
            onChange={(e) => handleFilterChange('semester', e.target.value)}
          >
            <option value="">All Semesters</option>
            {semesters.map(semester => (
              <option key={semester} value={semester}>{semester}</option>
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
        <div className="parent-card card-green">
          <div>Total Revenue</div>
          <div className="parent-card-value">{formatCurrency(totalRevenue)}</div>
          <div className="parent-card-desc">Collected this academic year</div>
        </div>
        <div className="parent-card card-red">
          <div>Pending Amount</div>
          <div className="parent-card-value">{formatCurrency(pendingAmount)}</div>
          <div className="parent-card-desc">Yet to be collected</div>
        </div>
        <div className="parent-card card-blue">
          <div>Paid Students</div>
          <div className="parent-card-value">{paidStudents}/{totalStudents}</div>
          <div className="parent-card-desc">Completed fee payment</div>
        </div>
        <div className="parent-card card-purple">
          <div>Collection Rate</div>
          <div className="parent-card-value">
            {totalStudents > 0 ? Math.round((paidStudents / totalStudents) * 100) : 0}%
          </div>
          <div className="parent-card-desc">Overall collection efficiency</div>
        </div>
      </section>

      {/* Fee Type Distribution */}
      <section className="department-stats">
        <div className="section-header">
          <h3>Fee Type Distribution</h3>
          <span>Revenue breakdown by fee type</span>
        </div>
        <div className="stats-grid">
          {feeTypes.map(feeType => {
            const typeData = feeData.filter(fee => fee.feeType === feeType);
            const totalAmount = typeData.reduce((sum, fee) => sum + fee.amount, 0);
            const collectedAmount = typeData.reduce((sum, fee) => sum + fee.paidAmount, 0);
            const collectionRate = totalAmount > 0 ? (collectedAmount / totalAmount) * 100 : 0;
            
            return (
              <div key={feeType} className="dept-stat-card">
                <div className="dept-name">{feeType}</div>
                <div className="dept-count">{formatCurrency(collectedAmount)}</div>
                <div className="dept-active">of {formatCurrency(totalAmount)}</div>
                <div className="dept-progress">
                  <div 
                    className="dept-progress-bar" 
                    style={{width: `${collectionRate}%`}}
                  ></div>
                </div>
                <div style={{fontSize: '0.8rem', color: '#a0a0c0', marginTop: '0.5rem'}}>
                  {Math.round(collectionRate)}% collected
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Fee Transactions Table */}
      <section className="reports-table-container">
        <div className="reports-table-header">
          <h3>Fee Transactions</h3>
          <span>Showing {filteredFeeData.length} records</span>
        </div>
        
        <div className="reports-table">
          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>Roll No</th>
                <th>Fee Type</th>
                <th>Academic Year</th>
                <th>Semester</th>
                <th>Amount</th>
                <th>Paid</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredFeeData.map(fee => (
                <tr key={fee.id}>
                  <td>
                    <div className="student-info">
                      <div className="student-avatar" style={{background: '#8b5cf6'}}>
                        {fee.studentName.split(' ').map(n => n[0]).join('')}
                      </div>
                      {fee.studentName}
                    </div>
                  </td>
                  <td>{fee.rollNo}</td>
                  <td>
                    <span className="subject-tag">{fee.feeType}</span>
                  </td>
                  <td>{fee.academicYear}</td>
                  <td>{fee.semester}</td>
                  <td>
                    <span style={{fontWeight: '600', color: '#ffffff'}}>
                      {formatCurrency(fee.amount)}
                    </span>
                  </td>
                  <td>
                    <span style={{fontWeight: '600', color: '#22c55e'}}>
                      {formatCurrency(fee.paidAmount)}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${
                      new Date(fee.dueDate) < new Date() && fee.status !== 'Paid' ? 'inactive' : ''
                    }`}>
                      {new Date(fee.dueDate).toLocaleDateString()}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${
                      fee.status === 'Paid' ? 'active' : 
                      fee.status === 'Partial' ? 'leave' : 'inactive'
                    }`}>
                      {fee.status}
                      {fee.status === 'Partial' && ` (${Math.round((fee.paidAmount / fee.amount) * 100)}%)`}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      {fee.status === 'Paid' && (
                        <button 
                          className="view-btn"
                          onClick={() => handleGenerateReceipt(fee)}
                          title="Generate Receipt"
                        >
                          🧾
                        </button>
                      )}
                      {(fee.status === 'Pending' || fee.status === 'Partial') && (
                        <button 
                          className="edit-btn"
                          onClick={() => handleSendReminder(fee)}
                          title="Send Reminder"
                        >
                          🔔
                        </button>
                      )}
                      <button 
                        className="edit-btn"
                        onClick={() => handleEditFee(fee)}
                        title="Edit Fee"
                      >
                        ✏️
                      </button>
                      <button 
                        className="delete-btn"
                        onClick={() => handleDeleteFee(fee)}
                        title="Delete Record"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredFeeData.length === 0 && (
            <div className="no-data">
              <span role="img" aria-label="no data">💰</span>
              <p>No fee records found matching your filters</p>
            </div>
          )}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="department-stats">
        <div className="section-header">
          <h3>Quick Actions</h3>
          <span>Common fee management tasks</span>
        </div>
        <div className="stats-grid">
          <div className="dept-stat-card" style={{cursor: 'pointer'}} onClick={() => console.log('Generate bulk receipts')}>
            <div className="dept-name">📄 Generate Bulk Receipts</div>
            <div className="dept-active">For all paid students</div>
          </div>
          <div className="dept-stat-card" style={{cursor: 'pointer'}} onClick={() => console.log('Send bulk reminders')}>
            <div className="dept-name">📧 Send Bulk Reminders</div>
            <div className="dept-active">To pending fee students</div>
          </div>
          <div className="dept-stat-card" style={{cursor: 'pointer'}} onClick={() => console.log('Export financial report')}>
            <div className="dept-name">📊 Export Financial Report</div>
            <div className="dept-active">Complete financial data</div>
          </div>
          <div className="dept-stat-card" style={{cursor: 'pointer'}} onClick={() => console.log('Configure fee structure')}>
            <div className="dept-name">⚙️ Configure Fee Structure</div>
            <div className="dept-active">Update fee types and amounts</div>
          </div>
        </div>
      </section>
    </>
  );

  // If embedded, just return the content without the layout wrapper
  if (embedded) {
    return <div className="fee-management-embedded">{feeContent}</div>;
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
          <span>Fee Management</span>
        </div>
        <div className="parent-powered">
          by <a href="https://edutrackers.com" target="_blank" rel="noopener noreferrer">EduTrackers</a>
        </div>
        <nav className="parent-nav">
          <a href="/admin-dashboard"><span role="img" aria-label="dashboard">📋</span> Dashboard</a>
          <button type="button"><span role="img" aria-label="notifications">🔔</span> Notifications</button>
          <button type="button"><span role="img" aria-label="reports">📄</span> Reports</button>
          <button type="button"><span role="img" aria-label="students">🧑‍🎓</span> Students</button>
          <button type="button"><span role="img" aria-label="teachers">🧑‍🏫</span> Teachers</button>
          <button type="button" className="active"><span role="img" aria-label="fee">💰</span> Fee Management</button>
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
        {feeContent}
      </main>
    </div>
  );
}

export default FeeManagement;