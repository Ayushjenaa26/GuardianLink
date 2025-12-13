import React, { useState, useEffect } from 'react';
import './PendingRequests.css';

const PendingRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('pending');
  const [processingId, setProcessingId] = useState(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [approvalData, setApprovalData] = useState({
    classes: [],
    adminResponse: ''
  });

  // College year-batch format
  const years = [1, 2, 3, 4];
  const batches = ['A', 'B', 'C'];
  const availableClasses = years.flatMap(year => 
    batches.map(batch => `${year}${batch}`)
  );

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('token');
      const response = await fetch(
        `http://localhost:3004/api/admin/role-requests?status=${activeTab}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      const data = await response.json();
      setRequests(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching requests:', error);
      setError(error.message || 'Error fetching role requests');
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const handleApprove = async (request) => {
    setSelectedRequest(request);
    setApprovalData({
      classes: [],
      adminResponse: ''
    });
    setShowApprovalModal(true);
  };

  const handleClassToggle = (className) => {
    setApprovalData(prev => {
      const classes = prev.classes.includes(className)
        ? prev.classes.filter(c => c !== className)
        : [...prev.classes, className];
      return { ...prev, classes };
    });
  };

  const confirmApproval = async () => {
    if (approvalData.classes.length === 0) {
      alert('Please select at least one class');
      return;
    }

    try {
      setProcessingId(selectedRequest._id);
      const token = localStorage.getItem('token');
      const response = await fetch(
        `http://localhost:3004/api/admin/role-requests/${selectedRequest._id}/approve`,
        {
          method: 'PUT',
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 
            adminResponse: approvalData.adminResponse || 'Your request has been approved',
            classes: approvalData.classes
          })
        }
      );
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }
      
      setSuccess('Request approved successfully!');
      fetchRequests();
      setShowApprovalModal(false);
      setSelectedRequest(null);
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error.message || 'Error approving request');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (requestId) => {
    const adminResponse = prompt('Please provide a reason for rejection:');
    
    if (!adminResponse || adminResponse.trim() === '') {
      alert('Rejection reason is required');
      return;
    }

    try {
      setProcessingId(requestId);
      const token = localStorage.getItem('token');
      const response = await fetch(
        `http://localhost:3004/api/admin/role-requests/${requestId}/reject`,
        {
          method: 'PUT',
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ adminResponse })
        }
      );
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }
      
      setSuccess('Request rejected successfully');
      fetchRequests();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error.message || 'Error rejecting request');
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async (requestId) => {
    if (!window.confirm('Are you sure you want to delete this request?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3004/api/admin/role-requests/${requestId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }
      
      setSuccess('Request deleted successfully');
      fetchRequests();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error.message || 'Error deleting request');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { class: 'badge-pending', icon: '⏳', text: 'Pending' },
      approved: { class: 'badge-approved', icon: '✅', text: 'Approved' },
      rejected: { class: 'badge-rejected', icon: '❌', text: 'Rejected' }
    };
    return badges[status] || badges.pending;
  };

  return (
    <div className="pending-requests-container">
      <header className="requests-header">
        <h2>📋 Teacher Role Requests</h2>
        <p>Review and manage teacher role assignment requests</p>
      </header>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="tabs-container">
        <button 
          className={`tab ${activeTab === 'pending' ? 'active' : ''}`}
          onClick={() => setActiveTab('pending')}
        >
          ⏳ Pending
        </button>
        <button 
          className={`tab ${activeTab === 'approved' ? 'active' : ''}`}
          onClick={() => setActiveTab('approved')}
        >
          ✅ Approved
        </button>
        <button 
          className={`tab ${activeTab === 'rejected' ? 'active' : ''}`}
          onClick={() => setActiveTab('rejected')}
        >
          ❌ Rejected
        </button>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading requests...</p>
        </div>
      ) : requests.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h3>No {activeTab} requests</h3>
          <p>
            {activeTab === 'pending' 
              ? 'There are no pending role requests at the moment.' 
              : `No ${activeTab} requests found.`}
          </p>
        </div>
      ) : (
        <div className="requests-grid">
          {requests.map(request => {
            const badge = getStatusBadge(request.status);
            return (
              <div key={request._id} className="request-card">
                <div className="request-card-header">
                  <div className="teacher-info">
                    <h3>{request.teacherName}</h3>
                    <p className="teacher-email">{request.teacherEmail}</p>
                    <p className="teacher-id">ID: {request.employeeId}</p>
                  </div>
                  <span className={`status-badge ${badge.class}`}>
                    {badge.icon} {badge.text}
                  </span>
                </div>

                <div className="request-card-body">
                  {request.department && (
                    <div className="info-section">
                      <h4>🏫 Department</h4>
                      <div className="tags-list">
                        <span className="tag tag-department">{request.department}</span>
                      </div>
                    </div>
                  )}

                  <div className="info-section">
                    <h4>📖 Requested Subjects</h4>
                    <div className="tags-list">
                      {request.requestedSubjects && Array.isArray(request.requestedSubjects) ? (
                        request.requestedSubjects.map(sub => (
                          <span key={sub} className="tag tag-subject">{sub}</span>
                        ))
                      ) : (
                        <span className="tag tag-subject">{request.requestedSubjects}</span>
                      )}
                    </div>
                  </div>

                  {request.requestedClasses && request.requestedClasses.length > 0 && (
                    <div className="info-section">
                      <h4>📚 Assigned Classes</h4>
                      <div className="tags-list">
                        {request.requestedClasses.map(cls => (
                          <span key={cls} className="tag tag-class">{cls}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {request.requestMessage && (
                    <div className="info-section">
                      <h4>💬 Teacher's Message</h4>
                      <p className="message-text">{request.requestMessage}</p>
                    </div>
                  )}

                  {request.adminResponse && (
                    <div className="info-section admin-response-section">
                      <h4>📝 Admin Response</h4>
                      <p className="message-text">{request.adminResponse}</p>
                    </div>
                  )}

                  <div className="info-section metadata">
                    <p><strong>Requested:</strong> {new Date(request.createdAt).toLocaleString()}</p>
                    {request.reviewedAt && (
                      <p><strong>Reviewed:</strong> {new Date(request.reviewedAt).toLocaleString()}</p>
                    )}
                  </div>
                </div>

                <div className="request-card-actions">
                  {request.status === 'pending' ? (
                    <>
                      <button 
                        className="btn btn-approve"
                        onClick={() => handleApprove(request)}
                        disabled={processingId === request._id}
                      >
                        ✅ Approve
                      </button>
                      <button 
                        className="btn btn-reject"
                        onClick={() => handleReject(request._id)}
                        disabled={processingId === request._id}
                      >
                        ❌ Reject
                      </button>
                    </>
                  ) : (
                    <button 
                      className="btn btn-delete"
                      onClick={() => handleDelete(request._id)}
                    >
                      🗑️ Delete
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Approval Modal */}
      {showApprovalModal && selectedRequest && (
        <div className="modal-overlay" onClick={() => setShowApprovalModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>✅ Approve Role Request</h3>
              <button className="modal-close" onClick={() => setShowApprovalModal(false)}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="teacher-summary">
                <p><strong>Teacher:</strong> {selectedRequest.teacherName}</p>
                {selectedRequest.department && (
                  <p><strong>Department:</strong> <span className="tag tag-department">{selectedRequest.department}</span></p>
                )}
                <p><strong>Subjects:</strong> 
                  {selectedRequest.requestedSubjects && Array.isArray(selectedRequest.requestedSubjects) ? (
                    selectedRequest.requestedSubjects.map(sub => (
                      <span key={sub} className="tag tag-subject" style={{marginLeft: '8px'}}>{sub}</span>
                    ))
                  ) : (
                    <span className="tag tag-subject" style={{marginLeft: '8px'}}>{selectedRequest.requestedSubjects}</span>
                  )}
                </p>
              </div>

              <div className="form-group">
                <label>Assign Classes *</label>
                <div className="checkbox-grid">
                  {availableClasses.map(className => (
                    <label key={className} className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={approvalData.classes.includes(className)}
                        onChange={() => handleClassToggle(className)}
                      />
                      {className}
                    </label>
                  ))}
                </div>
                <small>{approvalData.classes.length} class(es) selected</small>
              </div>

              <div className="form-group">
                <label>Message to Teacher (Optional)</label>
                <textarea
                  value={approvalData.adminResponse}
                  onChange={(e) => setApprovalData(prev => ({ ...prev, adminResponse: e.target.value }))}
                  placeholder="Add a message for the teacher..."
                  rows="3"
                />
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-cancel" onClick={() => setShowApprovalModal(false)}>
                Cancel
              </button>
              <button className="btn btn-approve" onClick={confirmApproval}>
                ✅ Approve Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingRequests;
