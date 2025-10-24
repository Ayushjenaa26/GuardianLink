// SecurityAudit.js
import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';

function SecurityAudit({ embedded = false }) {
  const [auditData, setAuditData] = useState([]);
  const [securityMetrics, setSecurityMetrics] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [filters, setFilters] = useState({
    userType: '',
    severity: '',
    dateRange: '',
    search: ''
  });

  // Mock data - replace with actual API calls
  useEffect(() => {
    setTimeout(() => {
      const mockAuditData = [
        {
          id: 1,
          timestamp: '2025-01-15 14:30:25',
          user: 'admin.user',
          userType: 'Administrator',
          ipAddress: '192.168.1.100',
          action: 'User Login',
          description: 'Successful login from admin dashboard',
          severity: 'Low',
          status: 'Success',
          location: 'Mumbai, IN',
          device: 'Chrome on Windows'
        },
        {
          id: 2,
          timestamp: '2025-01-15 13:15:42',
          user: 'priya.sharma',
          userType: 'Teacher',
          ipAddress: '103.216.85.120',
          action: 'Grade Submission',
          description: 'Submitted marks for CS401 assignment',
          severity: 'Medium',
          status: 'Success',
          location: 'Delhi, IN',
          device: 'Firefox on MacOS'
        },
        {
          id: 3,
          timestamp: '2025-01-15 11:45:18',
          user: 'aarav.student',
          userType: 'Student',
          ipAddress: '192.168.1.150',
          action: 'Failed Login Attempt',
          description: '3 consecutive failed password attempts',
          severity: 'High',
          status: 'Failed',
          location: 'Campus Network',
          device: 'Android Mobile'
        },
        {
          id: 4,
          timestamp: '2025-01-15 10:20:33',
          user: 'system.admin',
          userType: 'Administrator',
          ipAddress: '192.168.1.10',
          action: 'User Permission Change',
          description: 'Modified teacher access permissions',
          severity: 'High',
          status: 'Success',
          location: 'Mumbai, IN',
          device: 'Chrome on Windows'
        },
        {
          id: 5,
          timestamp: '2025-01-15 09:55:12',
          user: 'rohan.kumar',
          userType: 'Parent',
          ipAddress: '49.36.120.85',
          action: 'Data Export',
          description: 'Exported student attendance report',
          severity: 'Medium',
          status: 'Success',
          location: 'Bangalore, IN',
          device: 'Safari on iOS'
        },
        {
          id: 6,
          timestamp: '2025-01-14 22:15:08',
          user: 'unknown',
          userType: 'External',
          ipAddress: '182.176.45.210',
          action: 'Brute Force Attempt',
          description: 'Multiple failed login attempts from suspicious IP',
          severity: 'Critical',
          status: 'Blocked',
          location: 'Unknown',
          device: 'Unknown'
        },
        {
          id: 7,
          timestamp: '2025-01-14 18:40:55',
          user: 'neha.gupta',
          userType: 'Teacher',
          ipAddress: '192.168.1.125',
          action: 'Bulk Data Update',
          description: 'Updated attendance for 45 students',
          severity: 'Medium',
          status: 'Success',
          location: 'Campus Network',
          device: 'Chrome on Windows'
        },
        {
          id: 8,
          timestamp: '2025-01-14 16:20:17',
          user: 'admin.user',
          userType: 'Administrator',
          ipAddress: '192.168.1.100',
          action: 'System Configuration',
          description: 'Modified security settings and password policies',
          severity: 'High',
          status: 'Success',
          location: 'Mumbai, IN',
          device: 'Chrome on Windows'
        }
      ];

      const mockMetrics = {
        totalActivities: 1247,
        failedAttempts: 23,
        suspiciousActivities: 8,
        systemUptime: '99.98%',
        lastSecurityScan: '2025-01-14 23:00:00',
        dataEncryption: 'Enabled',
        twoFactorAuth: '85% Users',
        lastIncident: '15 days ago'
      };

      setAuditData(mockAuditData);
      setSecurityMetrics(mockMetrics);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter audit data based on filters
  const filteredAuditData = auditData.filter(audit => {
    return (
      (filters.userType === '' || audit.userType === filters.userType) &&
      (filters.severity === '' || audit.severity === filters.severity) &&
      (filters.search === '' || 
        audit.user.toLowerCase().includes(filters.search.toLowerCase()) ||
        audit.action.toLowerCase().includes(filters.search.toLowerCase()) ||
        audit.description.toLowerCase().includes(filters.search.toLowerCase()))
    );
  });

  // Get unique values for filters
  const userTypes = [...new Set(auditData.map(audit => audit.userType))];
  const severities = [...new Set(auditData.map(audit => audit.severity))];
  const statuses = [...new Set(auditData.map(audit => audit.status))];

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleExportLogs = () => {
    // Export logs functionality
    console.log('Exporting security logs...');
  };

  const handleRunSecurityScan = () => {
    // Run security scan functionality
    console.log('Running security scan...');
  };

  const handleViewDetails = (audit) => {
    // View audit details functionality
    console.log('View audit details:', audit);
  };

  const handleBlockIP = (audit) => {
    // Block IP functionality
    if (window.confirm(`Block IP address ${audit.ipAddress}?`)) {
      console.log('Blocking IP:', audit.ipAddress);
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'Critical': return '#ef4444';
      case 'High': return '#f59e0b';
      case 'Medium': return '#eab308';
      case 'Low': return '#22c55e';
      default: return '#a0a0c0';
    }
  };

  if (loading) return <div className="loading">Loading security data...</div>;

  // Main content that will be rendered in both embedded and full modes
  const securityContent = (
    <>
      <header className="parent-header">
        <div>
          <h2>Security & Audit</h2>
          <span className="parent-welcome">Monitor system security, user activities, and access logs</span>
        </div>
        <div className="parent-actions">
          <button className="export-btn" onClick={handleRunSecurityScan}>🔍 Run Security Scan</button>
          <button className="export-btn" onClick={handleExportLogs}>📄 Export Logs</button>
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
            className={`tab ${activeTab === 'audit-logs' ? 'active' : ''}`}
            onClick={() => setActiveTab('audit-logs')}
          >
            Audit Logs
          </button>
          <button 
            className={`tab ${activeTab === 'threats' ? 'active' : ''}`}
            onClick={() => setActiveTab('threats')}
          >
            Threat Detection
          </button>
          <button 
            className={`tab ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            Security Settings
          </button>
        </div>
      </section>

      {/* Filters Section */}
      <section className="reports-filters">
        <div className="filter-group">
          <label>Search Activities</label>
          <input
            type="text"
            placeholder="Search by user, action, or description..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
        </div>
        <div className="filter-group">
          <label>User Type</label>
          <select 
            value={filters.userType} 
            onChange={(e) => handleFilterChange('userType', e.target.value)}
          >
            <option value="">All User Types</option>
            {userTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label>Severity Level</label>
          <select 
            value={filters.severity} 
            onChange={(e) => handleFilterChange('severity', e.target.value)}
          >
            <option value="">All Severities</option>
            {severities.map(severity => (
              <option key={severity} value={severity}>{severity}</option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label>Date Range</label>
          <select 
            value={filters.dateRange} 
            onChange={(e) => handleFilterChange('dateRange', e.target.value)}
          >
            <option value="">All Time</option>
            <option value="today">Today</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
          </select>
        </div>
      </section>

      {/* Security Metrics Cards */}
      <section className="parent-cards">
        <div className="parent-card card-green">
          <div>System Uptime</div>
          <div className="parent-card-value">{securityMetrics.systemUptime}</div>
          <div className="parent-card-desc">Last incident: {securityMetrics.lastIncident}</div>
        </div>
        <div className="parent-card card-blue">
          <div>Total Activities</div>
          <div className="parent-card-value">{securityMetrics.totalActivities}</div>
          <div className="parent-card-desc">Tracked this month</div>
        </div>
        <div className="parent-card card-red">
          <div>Failed Attempts</div>
          <div className="parent-card-value">{securityMetrics.failedAttempts}</div>
          <div className="parent-card-desc">Requires attention</div>
        </div>
        <div className="parent-card card-purple">
          <div>2FA Adoption</div>
          <div className="parent-card-value">{securityMetrics.twoFactorAuth}</div>
          <div className="parent-card-desc">Enhanced security</div>
        </div>
      </section>

      {/* Threat Level Indicators */}
      <section className="department-stats">
        <div className="section-header">
          <h3>Security Status</h3>
          <span>Current system security overview</span>
        </div>
        <div className="stats-grid">
          <div className="dept-stat-card">
            <div className="dept-name">🛡️ Data Encryption</div>
            <div className="dept-count" style={{color: '#22c55e'}}>{securityMetrics.dataEncryption}</div>
            <div className="dept-active">All sensitive data</div>
            <div className="dept-progress">
              <div className="dept-progress-bar" style={{width: '100%', background: '#22c55e'}}></div>
            </div>
          </div>
          <div className="dept-stat-card">
            <div className="dept-name">🔐 Password Strength</div>
            <div className="dept-count" style={{color: '#22c55e'}}>Strong</div>
            <div className="dept-active">Enforced policies</div>
            <div className="dept-progress">
              <div className="dept-progress-bar" style={{width: '90%', background: '#22c55e'}}></div>
            </div>
          </div>
          <div className="dept-stat-card">
            <div className="dept-name">🌐 Network Security</div>
            <div className="dept-count" style={{color: '#eab308'}}>Moderate</div>
            <div className="dept-active">Monitoring required</div>
            <div className="dept-progress">
              <div className="dept-progress-bar" style={{width: '75%', background: '#eab308'}}></div>
            </div>
          </div>
          <div className="dept-stat-card">
            <div className="dept-name">📊 Last Security Scan</div>
            <div className="dept-count" style={{color: '#22c55e'}}>Completed</div>
            <div className="dept-active">{new Date(securityMetrics.lastSecurityScan).toLocaleDateString()}</div>
            <div className="dept-progress">
              <div className="dept-progress-bar" style={{width: '100%', background: '#22c55e'}}></div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Security Activities */}
      <section className="reports-table-container">
        <div className="reports-table-header">
          <h3>Recent Security Activities</h3>
          <span>Showing {filteredAuditData.length} of {auditData.length} activities</span>
        </div>
        
        <div className="reports-table">
          <table>
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>User</th>
                <th>Action</th>
                <th>IP Address</th>
                <th>Description</th>
                <th>Severity</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAuditData.map(audit => (
                <tr key={audit.id}>
                  <td>
                    <span style={{fontSize: '0.8rem', color: '#a0a0c0'}}>
                      {formatTimestamp(audit.timestamp)}
                    </span>
                  </td>
                  <td>
                    <div className="student-info">
                      <div className="student-avatar" style={{background: getSeverityColor(audit.severity)}}>
                        {audit.user.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div style={{fontWeight: '600'}}>{audit.user}</div>
                        <div style={{fontSize: '0.75rem', color: '#a0a0c0'}}>{audit.userType}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span style={{fontWeight: '600'}}>{audit.action}</span>
                  </td>
                  <td>
                    <span className="subject-tag">{audit.ipAddress}</span>
                    <div style={{fontSize: '0.75rem', color: '#a0a0c0', marginTop: '0.25rem'}}>
                      {audit.location}
                    </div>
                  </td>
                  <td>
                    <div style={{maxWidth: '200px'}}>
                      {audit.description}
                      <div style={{fontSize: '0.75rem', color: '#a0a0c0', marginTop: '0.25rem'}}>
                        {audit.device}
                      </div>
                    </div>
                  </td>
                  <td>
                    <span 
                      className="status-badge" 
                      style={{
                        background: `${getSeverityColor(audit.severity)}20`,
                        color: getSeverityColor(audit.severity),
                        borderColor: `${getSeverityColor(audit.severity)}40`
                      }}
                    >
                      {audit.severity}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${
                      audit.status === 'Success' ? 'active' : 
                      audit.status === 'Failed' ? 'inactive' : 'leave'
                    }`}>
                      {audit.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="view-btn"
                        onClick={() => handleViewDetails(audit)}
                        title="View Details"
                      >
                        👁️
                      </button>
                      {(audit.severity === 'High' || audit.severity === 'Critical') && (
                        <button 
                          className="delete-btn"
                          onClick={() => handleBlockIP(audit)}
                          title="Block IP"
                        >
                          🚫
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredAuditData.length === 0 && (
            <div className="no-data">
              <span role="img" aria-label="no data">🛡️</span>
              <p>No security activities found matching your filters</p>
            </div>
          )}
        </div>
      </section>

      {/* Quick Security Actions */}
      <section className="department-stats">
        <div className="section-header">
          <h3>Quick Security Actions</h3>
          <span>Common security management tasks</span>
        </div>
        <div className="stats-grid">
          <div className="dept-stat-card" style={{cursor: 'pointer'}} onClick={() => console.log('Review access logs')}>
            <div className="dept-name">📋 Review Access Logs</div>
            <div className="dept-active">Comprehensive activity review</div>
          </div>
          <div className="dept-stat-card" style={{cursor: 'pointer'}} onClick={() => console.log('Update security policies')}>
            <div className="dept-name">⚙️ Update Policies</div>
            <div className="dept-active">Security policy configuration</div>
          </div>
          <div className="dept-stat-card" style={{cursor: 'pointer'}} onClick={() => console.log('Generate security report')}>
            <div className="dept-name">📊 Generate Report</div>
            <div className="dept-active">Compliance and security report</div>
          </div>
          <div className="dept-stat-card" style={{cursor: 'pointer'}} onClick={() => console.log('Backup security data')}>
            <div className="dept-name">💾 Backup Data</div>
            <div className="dept-active">Security logs and configurations</div>
          </div>
        </div>
      </section>
    </>
  );

  // If embedded, just return the content without the layout wrapper
  if (embedded) {
    return <div className="security-audit-embedded">{securityContent}</div>;
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
          <span>Security & Audit</span>
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
          <button type="button"><span role="img" aria-label="fee">💰</span> Fee Management</button>
          <button type="button" className="active"><span role="img" aria-label="security">🛡️</span> Security & Audit</button>
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
        {securityContent}
      </main>
    </div>
  );
}

export default SecurityAudit;