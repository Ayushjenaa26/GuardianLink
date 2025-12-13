// AssignRoles.js (Admin Dashboard)
import React, { useState, useEffect, useCallback } from 'react';
import './AssignRoles.css';
import { API_URL } from '../config';

function AssignRoles({ embedded = false }) {
  const [teachers, setTeachers] = useState([]);
  const [roleRequests, setRoleRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeView, setActiveView] = useState('teachers'); // 'teachers' or 'requests'
  const [requestFilter, setRequestFilter] = useState('pending'); // 'pending', 'approved', or 'rejected'
  const [showSubjectDropdown, setShowSubjectDropdown] = useState(false);
  
  // Form state for assignment
  const [assignmentForm, setAssignmentForm] = useState({
    department: '',
    subjects: [],
    classes: [],
    semester: ''
  });

  // Available options - College format
  const years = [1, 2, 3, 4];
  const batches = ['A', 'B', 'C'];
  const availableClasses = years.flatMap(year => 
    batches.map(batch => `Year ${year} - Batch ${batch}`)
  );

  const semesters = ['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4', 'Semester 5', 'Semester 6', 'Semester 7', 'Semester 8'];

  const departments = [
    { code: 'CSE', name: 'Computer Science & Engineering' },
    { code: 'ECE', name: 'Electronics & Communication Engineering' },
    { code: 'EEE', name: 'Electrical & Electronics Engineering' },
    { code: 'ME', name: 'Mechanical Engineering' },
    { code: 'CE', name: 'Civil Engineering' },
    { code: 'ChE', name: 'Chemical Engineering' }
  ];

  // Semester-specific subjects by department
  const subjectsBySemesterAndDept = {
    'CSE': {
      'Semester 1': ['Programming in C', 'Mathematics I', 'Physics', 'English Communication'],
      'Semester 2': ['Data Structures', 'Mathematics II', 'Chemistry', 'Professional Communication'],
      'Semester 3': ['Algorithms', 'Database Management', 'Computer Organization', 'Discrete Mathematics'],
      'Semester 4': ['Operating Systems', 'Computer Networks', 'Software Engineering', 'Theory of Computation'],
      'Semester 5': ['Web Technologies', 'Compiler Design', 'Computer Graphics', 'Artificial Intelligence'],
      'Semester 6': ['Machine Learning', 'Cloud Computing', 'Mobile Computing', 'Information Security'],
      'Semester 7': ['Big Data Analytics', 'IoT', 'Blockchain', 'Elective I'],
      'Semester 8': ['Deep Learning', 'Project Work', 'Elective II', 'Internship']
    },
    'ECE': {
      'Semester 1': ['Basic Electronics', 'Mathematics I', 'Physics', 'English Communication'],
      'Semester 2': ['Circuit Theory', 'Mathematics II', 'Chemistry', 'Professional Communication'],
      'Semester 3': ['Analog Electronics', 'Digital Electronics', 'Network Analysis', 'Signals & Systems'],
      'Semester 4': ['Microprocessors', 'Communication Systems', 'Electromagnetic Theory', 'Control Systems'],
      'Semester 5': ['Digital Signal Processing', 'VLSI Design', 'Microcontrollers', 'Antenna Theory'],
      'Semester 6': ['Embedded Systems', 'Wireless Communication', 'Digital Communication', 'Optical Communication'],
      'Semester 7': ['VLSI Technology', 'Satellite Communication', 'Mobile Communication', 'Elective I'],
      'Semester 8': ['Project Work', 'Industrial Training', 'Elective II', 'Seminar']
    },
    'EEE': {
      'Semester 1': ['Basic Electrical Engineering', 'Mathematics I', 'Physics', 'English Communication'],
      'Semester 2': ['Circuit Theory', 'Mathematics II', 'Chemistry', 'Professional Communication'],
      'Semester 3': ['Electrical Machines I', 'Network Analysis', 'Electromagnetic Fields', 'Control Systems'],
      'Semester 4': ['Electrical Machines II', 'Power Systems I', 'Power Electronics', 'Measurements'],
      'Semester 5': ['Power Systems II', 'Electric Drives', 'Digital Electronics', 'Microprocessors'],
      'Semester 6': ['High Voltage Engineering', 'Power System Protection', 'Renewable Energy', 'Electrical Design'],
      'Semester 7': ['Smart Grid', 'Energy Management', 'Industrial Drives', 'Elective I'],
      'Semester 8': ['Project Work', 'Industrial Training', 'Elective II', 'Seminar']
    },
    'ME': {
      'Semester 1': ['Engineering Mechanics', 'Mathematics I', 'Physics', 'English Communication'],
      'Semester 2': ['Strength of Materials', 'Mathematics II', 'Chemistry', 'Professional Communication'],
      'Semester 3': ['Thermodynamics', 'Fluid Mechanics', 'Manufacturing Technology', 'Material Science'],
      'Semester 4': ['Machine Design', 'Heat Transfer', 'Dynamics of Machinery', 'Metrology'],
      'Semester 5': ['CAD/CAM', 'Finite Element Analysis', 'Industrial Engineering', 'Automobile Engineering'],
      'Semester 6': ['Refrigeration & Air Conditioning', 'Power Plant Engineering', 'CNC Machines', 'Robotics'],
      'Semester 7': ['Computational Fluid Dynamics', 'Additive Manufacturing', 'Mechatronics', 'Elective I'],
      'Semester 8': ['Project Work', 'Industrial Training', 'Elective II', 'Seminar']
    },
    'CE': {
      'Semester 1': ['Engineering Mechanics', 'Mathematics I', 'Physics', 'English Communication'],
      'Semester 2': ['Strength of Materials', 'Mathematics II', 'Chemistry', 'Professional Communication'],
      'Semester 3': ['Structural Analysis I', 'Fluid Mechanics', 'Surveying', 'Building Materials'],
      'Semester 4': ['Structural Analysis II', 'Soil Mechanics', 'Concrete Technology', 'Hydrology'],
      'Semester 5': ['Design of Steel Structures', 'Foundation Engineering', 'Water Resources', 'Highway Engineering'],
      'Semester 6': ['Design of Concrete Structures', 'Environmental Engineering', 'Transportation Engineering', 'Estimation'],
      'Semester 7': ['Bridge Engineering', 'Construction Management', 'GIS & Remote Sensing', 'Elective I'],
      'Semester 8': ['Project Work', 'Industrial Training', 'Elective II', 'Seminar']
    },
    'ChE': {
      'Semester 1': ['Chemical Engineering Principles', 'Mathematics I', 'Physics', 'English Communication'],
      'Semester 2': ['Chemical Process Calculations', 'Mathematics II', 'Chemistry', 'Professional Communication'],
      'Semester 3': ['Fluid Mechanics', 'Heat Transfer', 'Mass Transfer', 'Chemical Thermodynamics'],
      'Semester 4': ['Chemical Reaction Engineering', 'Process Control', 'Unit Operations I', 'Mechanical Operations'],
      'Semester 5': ['Unit Operations II', 'Process Equipment Design', 'Industrial Chemistry', 'Polymer Engineering'],
      'Semester 6': ['Process Dynamics', 'Petrochemical Engineering', 'Environmental Engineering', 'Safety Engineering'],
      'Semester 7': ['Process Simulation', 'Biochemical Engineering', 'Nanotechnology', 'Elective I'],
      'Semester 8': ['Project Work', 'Industrial Training', 'Elective II', 'Seminar']
    }
  };

  // Fetch role requests
  const fetchRoleRequests = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/admin/role-requests`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setRoleRequests(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching role requests:', err);
    }
  }, []);

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
    fetchRoleRequests();
  }, [fetchTeachers, fetchRoleRequests]);

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
    setSelectedRequest(null);
    setAssignmentForm({
      department: teacher.department || '',
      subjects: Array.isArray(teacher.subject) ? teacher.subject : (teacher.subject && teacher.subject !== 'Not Assigned' ? [teacher.subject] : []),
      classes: Array.isArray(teacher.classes) ? teacher.classes : 
               (teacher.classes ? teacher.classes.split(',').map(c => c.trim()) : []),
      semester: teacher.semester || ''
    });
    setShowAssignModal(true);
    setSuccess('');
    setError('');
  };

  // Open assignment modal from role request
  const handleApproveRequest = (request) => {
    setSelectedRequest(request);
    setSelectedTeacher({
      id: request.teacher._id || request.teacher,
      name: request.teacherName,
      email: request.teacherEmail,
      employeeId: request.employeeId
    });
    setAssignmentForm({
      department: request.department || '',
      subjects: request.requestedSubjects || [],
      classes: [],
      semester: ''
    });
    setShowAssignModal(true);
    setSuccess('');
    setError('');
  };

  // Close modal
  const handleCloseModal = () => {
    setShowAssignModal(false);
    setSelectedTeacher(null);
    setSelectedRequest(null);
    setAssignmentForm({ department: '', subjects: [], classes: [], semester: '' });
  };

  // Handle subject selection
  const handleSubjectToggle = (subject) => {
    setAssignmentForm(prev => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter(s => s !== subject)
        : [...prev.subjects, subject]
    }));
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

    if (!assignmentForm.department) {
      setError('Please select a department');
      return;
    }

    if (!assignmentForm.semester) {
      setError('Please select a semester');
      return;
    }

    if (assignmentForm.subjects.length === 0) {
      setError('Please select at least one subject');
      return;
    }

    if (assignmentForm.classes.length === 0) {
      setError('Please select at least one class');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const token = localStorage.getItem('token');
      
      // If approving a role request
      if (selectedRequest) {
        const response = await fetch(`${API_URL}/api/admin/role-requests/${selectedRequest._id}/approve`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            classes: assignmentForm.classes,
            semester: assignmentForm.semester,
            adminResponse: 'Your request has been approved'
          })
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || 'Failed to approve request');
        }

        setSuccess(`Successfully approved request for ${selectedTeacher.name}`);
        fetchRoleRequests();
      } else {
        // Regular assignment update
        const response = await fetch(`${API_URL}/api/admin/teachers/${selectedTeacher.id}/assign`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            subjects: assignmentForm.subjects,
            classes: assignmentForm.classes,
            semester: assignmentForm.semester
          })
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || 'Failed to update assignment');
        }

        setSuccess(`Successfully updated assignments for ${selectedTeacher.name}`);
      }
      
      handleCloseModal();
      fetchTeachers();
    } catch (err) {
      console.error('Error updating assignment:', err);
      setError(err.message || 'Failed to update assignment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Reject role request
  const handleRejectRequest = async (requestId) => {
    if (!window.confirm('Are you sure you want to reject this request?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/admin/role-requests/${requestId}/reject`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ adminResponse: 'Request rejected' })
      });

      if (!response.ok) throw new Error('Failed to reject request');

      setSuccess('Request rejected');
      fetchRoleRequests();
    } catch (err) {
      setError(err.message || 'Failed to reject request');
    }
  };

  // Render content
  const renderContent = () => (
    <div className="assign-roles-container">
      <header className="assign-roles-header">
        <div>
          <h2>👥 Assign Roles & Classes</h2>
          <p>Manage teacher assignments and approve role requests</p>
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

      {/* View Toggle */}
      <div className="view-toggle">
        <button 
          className={`toggle-btn ${activeView === 'teachers' ? 'active' : ''}`}
          onClick={() => setActiveView('teachers')}
        >
          👨‍🏫 All Teachers
        </button>
        <button 
          className={`toggle-btn ${activeView === 'requests' ? 'active' : ''}`}
          onClick={() => { setActiveView('requests'); setRequestFilter('pending'); }}
        >
          📋 Pending Requests {roleRequests.filter(r => r.status === 'pending').length > 0 && <span className="badge">{roleRequests.filter(r => r.status === 'pending').length}</span>}
        </button>
        <button 
          className={`toggle-btn ${activeView === 'approved' ? 'active' : ''}`}
          onClick={() => { setActiveView('requests'); setRequestFilter('approved'); }}
        >
          ✅ Approved
        </button>
        <button 
          className={`toggle-btn ${activeView === 'rejected' ? 'active' : ''}`}
          onClick={() => { setActiveView('requests'); setRequestFilter('rejected'); }}
        >
          ❌ Rejected
        </button>
      </div>

      {/* Requests View */}
      {activeView === 'requests' && (
        <div className="requests-section">
          {roleRequests.filter(r => r.status === requestFilter).length === 0 ? (
            <div className="assign-empty">
              <span className="empty-icon">📋</span>
              <h3>No {requestFilter.charAt(0).toUpperCase() + requestFilter.slice(1)} Requests</h3>
              <p>There are currently no {requestFilter} role requests.</p>
            </div>
          ) : (
            <div className="requests-grid">
              {roleRequests.filter(r => r.status === requestFilter).map(request => (
                <div key={request._id} className="request-card">
                  <div className="request-header">
                    <h4>{request.teacherName}</h4>
                    <span className={`request-badge badge-${request.status}`}>{request.status.charAt(0).toUpperCase() + request.status.slice(1)}</span>
                  </div>
                  <div className="request-body">
                    <div className="info-row">
                      <span className="label">📧 Email:</span>
                      <span className="value">{request.teacherEmail}</span>
                    </div>
                    <div className="info-row">
                      <span className="label">🆔 Employee ID:</span>
                      <span className="value">{request.employeeId}</span>
                    </div>
                    {request.department && (
                      <div className="info-row">
                        <span className="label">🏢 Department:</span>
                        <span className="value dept-badge">{request.department}</span>
                      </div>
                    )}
                    <div className="info-row">
                      <span className="label">📚 Requested Subjects:</span>
                      <div className="subjects-tags">
                        {request.requestedSubjects?.map((subject, idx) => (
                          <span key={idx} className="subject-tag">{subject}</span>
                        ))}
                      </div>
                    </div>
                    {request.requestMessage && (
                      <div className="request-message">
                        <strong>Message:</strong>
                        <p>{request.requestMessage}</p>
                      </div>
                    )}
                  </div>
                  {request.status === 'pending' && (
                    <div className="request-actions">
                      <button 
                        className="approve-btn"
                        onClick={() => handleApproveRequest(request)}
                      >
                        ✅ Approve & Assign
                      </button>
                      <button 
                        className="reject-btn"
                        onClick={() => handleRejectRequest(request._id)}
                      >
                        ❌ Reject
                      </button>
                    </div>
                  )}
                  {request.adminResponse && (
                    <div className="admin-response">
                      <strong>Admin Response:</strong>
                      <p>{request.adminResponse}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Teachers List View */}
      {activeView === 'teachers' && (
        <>
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
        </>
      )}

      {/* Assignment Modal */}
      {showAssignModal && selectedTeacher && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="assign-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedRequest ? '✅ Approve & Assign' : 'Assign Roles to'} {selectedTeacher.name}</h3>
              <button className="close-btn" onClick={handleCloseModal}>×</button>
            </div>
            
            <div className="modal-body">
              {selectedRequest && (
                <div className="request-summary">
                  <h4>📋 Request Details</h4>
                  <p><strong>Department:</strong> {selectedRequest.department}</p>
                  <p><strong>Requested Subjects:</strong></p>
                  <div className="subjects-tags">
                    {selectedRequest.requestedSubjects?.map((subject, idx) => (
                      <span key={idx} className="subject-tag">{subject}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Department Selection */}
              <div className="form-group">
                <label>🏢 Department <span className="required">*</span></label>
                <select
                  value={assignmentForm.department}
                  onChange={(e) => {
                    setAssignmentForm(prev => ({ 
                      ...prev, 
                      department: e.target.value,
                      subjects: [] // Reset subjects when department changes
                    }));
                  }}
                  className="form-select"
                >
                  <option value="">Select Department</option>
                  {departments.map(dept => (
                    <option key={dept.code} value={dept.code}>{dept.code} - {dept.name}</option>
                  ))}
                </select>
              </div>

              {/* Semester Selection */}
              <div className="form-group">
                <label>📅 Semester <span className="required">*</span></label>
                <select
                  value={assignmentForm.semester}
                  onChange={(e) => {
                    const newSemester = e.target.value;
                    setAssignmentForm(prev => ({ 
                      ...prev, 
                      semester: newSemester,
                      classes: [] // Reset classes when semester changes
                    }));
                  }}
                  className="form-select"
                >
                  <option value="">Select Semester</option>
                  {semesters.map(sem => (
                    <option key={sem} value={sem}>{sem}</option>
                  ))}
                </select>
              </div>

              {/* Subject Selection - Custom Checkbox Dropdown */}
              <div className="form-group">
                <label>
                  📚 Subjects <span className="required">*</span>
                  <span className="count">({assignmentForm.subjects.length} selected)</span>
                </label>
                {!assignmentForm.department ? (
                  <p className="helper-text">Please select a department first</p>
                ) : !assignmentForm.semester ? (
                  <p className="helper-text">Please select a semester first</p>
                ) : (
                  <div className="custom-dropdown">
                    <button 
                      type="button"
                      className="dropdown-trigger"
                      onClick={() => setShowSubjectDropdown(!showSubjectDropdown)}
                    >
                      <span>
                        {assignmentForm.subjects.length === 0 
                          ? 'Select subjects...' 
                          : `${assignmentForm.subjects.length} subject(s) selected`}
                      </span>
                      <span className="dropdown-arrow">{showSubjectDropdown ? '▲' : '▼'}</span>
                    </button>
                    {showSubjectDropdown && (
                      <div className="dropdown-menu">
                        {subjectsBySemesterAndDept[assignmentForm.department]?.[assignmentForm.semester]?.map(subject => (
                          <label key={subject} className="dropdown-item">
                            <input
                              type="checkbox"
                              checked={assignmentForm.subjects.includes(subject)}
                              onChange={() => handleSubjectToggle(subject)}
                            />
                            <span>{subject}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Classes Selection - Filtered by semester */}
              <div className="form-group">
                <label>
                  🏫 Classes <span className="required">*</span>
                  <span className="count">({assignmentForm.classes.length} selected)</span>
                </label>
                {!assignmentForm.semester ? (
                  <p className="helper-text">Please select a semester first</p>
                ) : (
                  <>
                    <div className="class-actions">
                      <button type="button" onClick={() => {
                        const semesterNum = parseInt(assignmentForm.semester.split(' ')[1]);
                        const year = Math.ceil(semesterNum / 2);
                        const relevantClasses = batches.map(batch => `Year ${year} - Batch ${batch}`);
                        setAssignmentForm(prev => ({ ...prev, classes: relevantClasses }));
                      }}>Select All</button>
                      <button type="button" onClick={handleClearAllClasses}>Clear All</button>
                    </div>
                    <div className="classes-grid">
                      {(() => {
                        const semesterNum = parseInt(assignmentForm.semester.split(' ')[1]);
                        const year = Math.ceil(semesterNum / 2);
                        const relevantClasses = batches.map(batch => `Year ${year} - Batch ${batch}`);
                        return relevantClasses.map(className => (
                          <label key={className} className="class-checkbox">
                            <input
                              type="checkbox"
                              checked={assignmentForm.classes.includes(className)}
                              onChange={() => handleClassToggle(className)}
                            />
                            <span>{className}</span>
                          </label>
                        ));
                      })()}
                    </div>
                  </>
                )}
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
                {loading ? 'Saving...' : selectedRequest ? '✅ Approve & Assign' : '💾 Save Assignment'}
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
