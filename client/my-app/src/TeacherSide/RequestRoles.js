import React, { useState, useEffect } from 'react';
import './RequestRoles.css';

const RequestRoles = () => {
  const [formData, setFormData] = useState({
    department: '',
    requestedSubjects: [],
    requestMessage: ''
  });
  const [myRequests, setMyRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(true);

  // Available options for college
  const departments = [
    { code: 'CSE', name: 'Computer Science & Engineering' },
    { code: 'ECE', name: 'Electronics & Communication Engineering' },
    { code: 'EEE', name: 'Electrical & Electronics Engineering' },
    { code: 'ME', name: 'Mechanical Engineering' },
    { code: 'CE', name: 'Civil Engineering' },
    { code: 'ChE', name: 'Chemical Engineering' }
  ];

  const subjectsByDepartment = {
    'CSE': ['Data Structures', 'Algorithms', 'Database Management', 'Operating Systems', 'Computer Networks', 'Software Engineering', 'Web Technologies', 'Machine Learning', 'Artificial Intelligence'],
    'ECE': ['Analog Electronics', 'Digital Electronics', 'Signal Processing', 'Communication Systems', 'VLSI Design', 'Microprocessors', 'Control Systems', 'Embedded Systems'],
    'EEE': ['Electrical Machines', 'Power Systems', 'Control Systems', 'Power Electronics', 'Electric Drives', 'Electrical Measurements', 'High Voltage Engineering'],
    'ME': ['Thermodynamics', 'Fluid Mechanics', 'Manufacturing Technology', 'Machine Design', 'Heat Transfer', 'Mechanics of Materials', 'CAD/CAM', 'Automotive Engineering'],
    'CE': ['Structural Analysis', 'Concrete Technology', 'Soil Mechanics', 'Fluid Mechanics', 'Surveying', 'Transportation Engineering', 'Environmental Engineering', 'Construction Management'],
    'ChE': ['Chemical Reaction Engineering', 'Mass Transfer', 'Heat Transfer', 'Process Control', 'Chemical Process Calculations', 'Unit Operations', 'Process Equipment Design', 'Polymer Engineering']
  };

  const availableSubjects = formData.department ? subjectsByDepartment[formData.department] || [] : [];

  useEffect(() => {
    fetchMyRequests();
  }, []);

  const fetchMyRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3004/api/teacher/role-requests', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      
      // Ensure data is an array
      const requestsArray = Array.isArray(data) ? data : [];
      setMyRequests(requestsArray);

      // Check if there's a pending request
      const hasPending = requestsArray.some(req => req.status === 'pending');
      setShowForm(!hasPending);
    } catch (error) {
      console.error('Error fetching requests:', error);
      setMyRequests([]); // Set empty array on error
    }
  };

  const handleSubjectToggle = (subject) => {
    setFormData(prev => {
      const subjects = prev.requestedSubjects.includes(subject)
        ? prev.requestedSubjects.filter(s => s !== subject)
        : [...prev.requestedSubjects, subject];
      return { ...prev, requestedSubjects: subjects };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.department) {
      setError('Please select a department');
      return;
    }

    if (!formData.requestedSubjects || formData.requestedSubjects.length === 0) {
      setError('Please select at least one subject');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3004/api/teacher/role-request', {
        method: 'POST',
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      setSuccess('Role request submitted successfully! Please wait for admin approval.');
      setFormData({
        department: '',
        requestedSubjects: [],
        requestMessage: ''
      });
      
      // Refresh requests list
      setTimeout(() => {
        fetchMyRequests();
        setSuccess('');
      }, 2000);
    } catch (error) {
      setError(error.message || 'Error submitting request');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRequest = async (requestId) => {
    if (!window.confirm('Are you sure you want to delete this request?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3004/api/teacher/role-requests/${requestId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }
      
      setSuccess('Request deleted successfully');
      fetchMyRequests();
      setTimeout(() => setSuccess(''), 2000);
    } catch (error) {
      setError(error.message || 'Error deleting request');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { class: 'status-pending', text: 'Pending' },
      approved: { class: 'status-approved', text: 'Approved' },
      rejected: { class: 'status-rejected', text: 'Rejected' }
    };
    return badges[status] || badges.pending;
  };

  return (
    <div className="request-roles-container">
      <h2>📋 Request Class & Subject Assignment</h2>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {showForm ? (
        <div className="request-form-section">
          <form onSubmit={handleSubmit} className="request-form">
            <div className="info-note">
              <span className="info-icon">ℹ️</span>
              <p>Classes will be assigned by the admin upon approval of your request.</p>
            </div>

            <div className="form-group">
              <label>Select Department *</label>
              <select 
                value={formData.department}
                onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value, requestedSubjects: [] }))}
                className="subject-dropdown"
              >
                <option value="">-- Choose a department --</option>
                {departments.map(dept => (
                  <option key={dept.code} value={dept.code}>
                    {dept.name} ({dept.code})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Select Subjects *</label>
              <div className="checkbox-grid">
                {availableSubjects.map(subject => (
                  <label key={subject} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.requestedSubjects.includes(subject)}
                      onChange={() => handleSubjectToggle(subject)}
                    />
                    {subject}
                  </label>
                ))}
              </div>
              <small>{formData.requestedSubjects.length} subject(s) selected</small>
            </div>

            <div className="form-group">
              <label>Message to Admin (Optional)</label>
              <textarea
                value={formData.requestMessage}
                onChange={(e) => setFormData(prev => ({ ...prev, requestMessage: e.target.value }))}
                placeholder="Explain why you need these assignments..."
                rows="4"
              />
            </div>

            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Submitting...' : '📤 Submit Request'}
            </button>
          </form>
        </div>
      ) : (
        <div className="pending-notice">
          <p>⏳ You have a pending request. Please wait for admin approval before submitting a new request.</p>
        </div>
      )}

      <div className="my-requests-section">
        <h3>My Requests</h3>
        {myRequests.length === 0 ? (
          <p className="no-requests">No requests yet. Submit your first request above!</p>
        ) : (
          <div className="requests-list">
            {myRequests.map(request => {
              const badge = getStatusBadge(request.status);
              return (
                <div key={request._id} className="request-card">
                  <div className="request-header">
                    <span className={`status-badge ${badge.class}`}>
                      {badge.text}
                    </span>
                    <span className="request-date">
                      {new Date(request.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="request-details">
                    <div className="detail-item">
                      <strong>Classes:</strong>
                      <div className="tags">
                        {request.requestedClasses.map(cls => (
                          <span key={cls} className="tag">{cls}</span>
                        ))}
                      </div>
                    </div>

                    <div className="detail-item">
                      <strong>Subjects:</strong>
                      <div className="tags">
                        {request.requestedSubjects.map(sub => (
                          <span key={sub} className="tag">{sub}</span>
                        ))}
                      </div>
                    </div>

                    {request.requestMessage && (
                      <div className="detail-item">
                        <strong>Your Message:</strong>
                        <p>{request.requestMessage}</p>
                      </div>
                    )}

                    {request.adminResponse && (
                      <div className="detail-item admin-response">
                        <strong>Admin Response:</strong>
                        <p>{request.adminResponse}</p>
                      </div>
                    )}

                    {request.reviewedAt && (
                      <div className="detail-item">
                        <small>Reviewed on: {new Date(request.reviewedAt).toLocaleString()}</small>
                      </div>
                    )}
                  </div>

                  {request.status === 'pending' && (
                    <div className="request-actions">
                      <button 
                        className="btn-delete"
                        onClick={() => handleDeleteRequest(request._id)}
                      >
                        🗑️ Delete Request
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestRoles;
