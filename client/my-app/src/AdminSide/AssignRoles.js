// AssignRoles.js (Admin Dashboard)
import React, { useState, useEffect, useCallback } from 'react';
import './AssignRoles.css';
import { API_URL } from '../config';

function AssignRoles({ embedded = false }) {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Form state for assignment
  const [assignmentForm, setAssignmentForm] = useState({
    subject: '',
    classes: [],
    designation: ''
  });

  // Available options
  const availableClasses = [
    '1A', '1B', '2A', '2B', '3A', '3B', '4A', '4B', '5A', '5B',
    '6A', '6B', '7A', '7B', '8A', '8B', '9A', '9B', '10A', '10B', '10C',
    '11A', '11B', '12A', '12B'
  ];

  const availableSubjects = [
    'Mathematics', 'Science', 'English', 'Hindi', 'Social Studies',
    'Computer Science', 'Physics', 'Chemistry', 'Biology', 'History',
    'Geography', 'Economics', 'Political Science', 'Physical Education',
    'Art', 'Music', 'General'
  ];

  const availableDesignations = [
    'Teacher', 'Senior Teacher', 'Head of Department', 'Class Teacher',
    'Subject Coordinator', 'Vice Principal', 'Principal'
  ];

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
        name: teacher.teacherName || teacher.name,
        employeeId: teacher.employeeId,
        email: teacher.email,
        phone: teacher.phone || '',
        subject: teacher.assignedSubjects?.length > 0 ? teacher.assignedSubjects[0] : (teacher.subject || 'Not Assigned'),
        classes: teacher.assignedClasses?.length > 0 ? teacher.assignedClasses : 
                 (Array.isArray(teacher.classes) ? teacher.classes : 
                  (teacher.classes ? teacher.classes.split(',').map(c => c.trim()) : [])),
        designation: teacher.designation || 'Teacher',
        department: teacher.department || '',
        status: teacher.status || 'Active'
      }));

      setTeachers(mappedTeachers);
      setError('');
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

  // Filter teachers based on search
  const filteredTeachers = teachers.filter(teacher => {
    const query = searchQuery.toLowerCase();
    return (
      teacher.name?.toLowerCase().includes(query) ||
      teacher.email?.toLowerCase().includes(query) ||
      teacher.employeeId?.toLowerCase().includes(query) ||
      teacher.subject?.toLowerCase().includes(query)
    );
  });

  // Open assignment modal
  const handleAssignClick = (teacher) => {
    setSelectedTeacher(teacher);
    setAssignmentForm({
      subject: teacher.subject || '',
      classes: Array.isArray(teacher.classes) ? teacher.classes : 
               (teacher.classes ? teacher.classes.split(',').map(c => c.trim()) : []),
      designation: teacher.designation || 'Teacher'
    });
    setShowAssignModal(true);
    setSuccess('');
    setError('');
  };

  // Close modal
  const handleCloseModal = () => {
    setShowAssignModal(false);
    setSelectedTeacher(null);
    setAssignmentForm({ subject: '', classes: [], designation: '' });
  };

  // Handle class selection
  const handleClassToggle = (className) => {
    setAssignmentForm(prev => ({
      ...prev,
      classes: prev.classes.includes(className)
        ? prev.classes.filter(c => c !== className)
        : [...prev.classes, className]
    }));
  };

  // Select all classes
  const handleSelectAllClasses = () => {
    setAssignmentForm(prev => ({
      ...prev,
      classes: availableClasses
    }));
  };

  // Clear all classes
  const handleClearAllClasses = () => {
    setAssignmentForm(prev => ({
      ...prev,
      classes: []
    }));
  };

  // Submit assignment
  const handleSubmitAssignment = async () => {
    if (!selectedTeacher) return;

    try {
      setLoading(true);
      setError('');
      
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/api/admin/teachers/${selectedTeacher.id}/assign`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          subjects: assignmentForm.subject ? [assignmentForm.subject] : [],
          classes: assignmentForm.classes
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to update assignment');
      }

      setSuccess(`Successfully updated assignments for ${selectedTeacher.name}`);
      handleCloseModal();
      fetchTeachers(); // Refresh the list
    } catch (err) {
      console.error('Error updating assignment:', err);
      setError(err.message || 'Failed to update assignment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Render content
  const renderContent = () => (
    <div className="assign-roles-container">
      <header className="assign-roles-header">
        <div>
          <h2>👥 Assign Roles & Classes</h2>
          <p>Assign subjects, classes, and designations to teachers</p>
        </div>
      </header>

      {/* Success/Error Messages */}
      {success && (
        <div className="assign-message success">
          ✅ {success}
        </div>
      )}
      {error && (
        <div className="assign-message error">
          ❌ {error}
        </div>
      )}

      {/* Search Bar */}
      <div className="assign-search-bar">
        <input
          type="text"
          placeholder="🔍 Search teachers by name, email, or employee ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Teachers List */}
      {loading ? (
        <div className="assign-loading">
          <div className="spinner"></div>
          <p>Loading teachers...</p>
        </div>
      ) : filteredTeachers.length === 0 ? (
        <div className="assign-empty">
          <span className="empty-icon">👨‍🏫</span>
          <h3>No Teachers Found</h3>
          <p>
            {teachers.length === 0 
              ? 'No teachers in the database. Upload teacher data first.'
              : 'No teachers match your search criteria.'}
          </p>
        </div>
      ) : (
        <div className="assign-teachers-grid">
          {filteredTeachers.map(teacher => (
            <div key={teacher.id} className="teacher-card">
              <div className="teacher-card-header">
                <div className="teacher-avatar">
                  {teacher.name?.charAt(0)?.toUpperCase() || 'T'}
                </div>
                <div className="teacher-info">
                  <h4>{teacher.name}</h4>
                  <span className="teacher-id">{teacher.employeeId}</span>
                </div>
                <span className={`status-badge ${teacher.status?.toLowerCase()}`}>
                  {teacher.status}
                </span>
              </div>
              
              <div className="teacher-card-body">
                <div className="info-row">
                  <span className="label">📧 Email:</span>
                  <span className="value">{teacher.email}</span>
                </div>
                <div className="info-row">
                  <span className="label">📚 Subject:</span>
                  <span className={`value ${teacher.subject === 'Not Assigned' ? 'not-assigned' : ''}`}>
                    {teacher.subject}
                  </span>
                </div>
                <div className="info-row">
                  <span className="label">🏫 Classes:</span>
                  <span className="value">
                    {Array.isArray(teacher.classes) && teacher.classes.length > 0
                      ? teacher.classes.slice(0, 3).join(', ') + (teacher.classes.length > 3 ? ` +${teacher.classes.length - 3} more` : '')
                      : 'Not Assigned'}
                  </span>
                </div>
                <div className="info-row">
                  <span className="label">👔 Designation:</span>
                  <span className="value">{teacher.designation}</span>
                </div>
              </div>

              <div className="teacher-card-footer">
                <button 
                  className="assign-btn"
                  onClick={() => handleAssignClick(teacher)}
                >
                  ✏️ Assign Roles
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Assignment Modal */}
      {showAssignModal && selectedTeacher && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="assign-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Assign Roles to {selectedTeacher.name}</h3>
              <button className="close-btn" onClick={handleCloseModal}>×</button>
            </div>
            
            <div className="modal-body">
              {/* Subject Selection */}
              <div className="form-group">
                <label>📚 Subject</label>
                <select
                  value={assignmentForm.subject}
                  onChange={(e) => setAssignmentForm(prev => ({ ...prev, subject: e.target.value }))}
                >
                  <option value="">Select Subject</option>
                  {availableSubjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>

              {/* Designation Selection */}
              <div className="form-group">
                <label>👔 Designation</label>
                <select
                  value={assignmentForm.designation}
                  onChange={(e) => setAssignmentForm(prev => ({ ...prev, designation: e.target.value }))}
                >
                  <option value="">Select Designation</option>
                  {availableDesignations.map(designation => (
                    <option key={designation} value={designation}>{designation}</option>
                  ))}
                </select>
              </div>

              {/* Classes Selection */}
              <div className="form-group">
                <label>
                  🏫 Classes 
                  <span className="class-count">({assignmentForm.classes.length} selected)</span>
                </label>
                <div className="class-actions">
                  <button type="button" onClick={handleSelectAllClasses}>Select All</button>
                  <button type="button" onClick={handleClearAllClasses}>Clear All</button>
                </div>
                <div className="classes-grid">
                  {availableClasses.map(className => (
                    <label key={className} className="class-checkbox">
                      <input
                        type="checkbox"
                        checked={assignmentForm.classes.includes(className)}
                        onChange={() => handleClassToggle(className)}
                      />
                      <span>{className}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="cancel-btn" onClick={handleCloseModal}>
                Cancel
              </button>
              <button 
                className="save-btn" 
                onClick={handleSubmitAssignment}
                disabled={loading}
              >
                {loading ? 'Saving...' : '💾 Save Assignment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // If embedded, render without wrapper
  if (embedded) {
    return renderContent();
  }

  // Standalone render with full layout
  return (
    <div className="admin-page">
      {renderContent()}
    </div>
  );
}

export default AssignRoles;
