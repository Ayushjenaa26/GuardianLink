import React, { useState, useEffect } from 'react';
import { API_URL } from '../config';
import './StudentDataInput.css';

const StudentDataInput = () => {
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    studentId: '',
    dateOfBirth: '',
    gender: '',
    email: '',
    phone: '',
    address: '',
    
    // Academic Information
    batch: '',
    semester: '',
    department: '',
    enrollmentDate: '',
    
    // Contact Information
    parentName: '',
    parentEmail: '',
    parentPhone: '',
    emergencyContact: '',
    
    // Academic Performance
    previousGrades: '',
    attendance: '',
    behaviorScore: '',
    specialNeeds: '',
    
    // Additional Information
    hobbies: '',
    strengths: '',
    improvements: '',
    notes: ''
  });

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [profileImage, setProfileImage] = useState(null);

  // State for recent entries
  const [recentEntries, setRecentEntries] = useState([]);
  const [showAllStudents, setShowAllStudents] = useState(false);
  const [allStudents, setAllStudents] = useState([]);

  // Fetch recent entries function (can be reused)
  const fetchRecentEntries = async () => {
    try {
      const response = await fetch(`${API_URL}/api/teacher/students?limit=4`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch recent entries');
      }

      const data = await response.json();
      const formattedEntries = data.map(student => ({
        id: student.admissionNumber || student.studentId,
        name: student.name || `${student.firstName || ''} ${student.lastName || ''}`.trim(),
        batch: student.branch || student.batch,
        date: new Date(student.createdAt).toLocaleDateString(),
        initials: student.name ? student.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'ST'
      }));
      setRecentEntries(formattedEntries);
    } catch (error) {
      console.error('Error fetching recent entries:', error);
    }
  };

  // Fetch all students function
  const fetchAllStudents = async () => {
    try {
      const response = await fetch(`${API_URL}/api/teacher/students`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch all students');
      }

      const data = await response.json();
      const formattedStudents = data.map(student => ({
        id: student.admissionNumber || student.studentId,
        name: student.name || `${student.firstName || ''} ${student.lastName || ''}`.trim(),
        batch: student.branch || student.batch,
        section: student.section || student.department,
        email: student.email,
        date: new Date(student.createdAt).toLocaleDateString(),
        initials: student.name ? student.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'ST'
      }));
      setAllStudents(formattedStudents);
      setShowAllStudents(true);
    } catch (error) {
      console.error('Error fetching all students:', error);
      alert('Failed to fetch students. Please try again.');
    }
  };

  // Fetch recent entries when component mounts
  React.useEffect(() => {
    fetchRecentEntries();
  }, []);

  const batches = [
    'B1 - Full Stack Development',
    'B2 - Software Engineering',
    'B3 - Database Systems',
    'A1 - Computer Networks',
    'A2 - Cyber Security'
  ];

  const departments = [
    'Computer Science',
    'Information Technology',
    'Software Engineering',
    'Data Science',
    'Computer Engineering'
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error for the field being edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    console.log('🔍 Validating form data:', formData);

    // Required field validation matching backend requirements
    if (!formData.firstName || !formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
      console.log('❌ First name validation failed');
    }
    if (!formData.lastName || !formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
      console.log('❌ Last name validation failed');
    }
    if (!formData.studentId || !formData.studentId.trim()) {
      newErrors.studentId = 'Student ID is required (will be used as initial password)';
      console.log('❌ Student ID validation failed');
    } else if (formData.studentId.length < 6) {
      newErrors.studentId = 'Student ID must be at least 6 characters (will be used as initial password)';
      console.log('❌ Student ID too short');
    }

    if (!formData.email || !formData.email.trim()) {
      newErrors.email = 'Email is required';
      console.log('❌ Email validation failed');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
      console.log('❌ Email format invalid');
    }

    if (!formData.batch) {
      newErrors.batch = 'Class/Batch is required';
      console.log('❌ Batch validation failed');
    }
    if (!formData.department) {
      newErrors.department = 'Section/Department is required';
      console.log('❌ Department validation failed');
    }
    if (!formData.parentName) {
      newErrors.parentName = 'Parent name is required';
      console.log('❌ Parent name validation failed');
    }
    if (!formData.parentPhone) {
      newErrors.parentPhone = 'Parent phone number is required';
      console.log('❌ Parent phone validation failed');
    }

    console.log('📋 Validation errors:', newErrors);
    setErrors(newErrors);
    
    const isValid = Object.keys(newErrors).length === 0;
    console.log(isValid ? '✅ Validation passed!' : '❌ Validation failed!');
    
    if (!isValid) {
      // Show which fields are missing
      const missingFields = Object.keys(newErrors).join(', ');
      alert(`Please fill in the following required fields:\n\n${missingFields}`);
    }
    
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('Submit button clicked!');
    alert('Form submitted! Processing...');
    
    if (!validateForm()) {
      alert('Validation failed! Please check all required fields.');
      return;
    }

    setIsSubmitting(true);
    console.log('Validation passed, starting submission...');

    try {
      // Create the student data object
      const studentData = {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email.trim(),
        password: formData.studentId.trim(),
        branch: formData.batch,
        section: formData.department,
        admissionNumber: formData.studentId.trim(),
        parentName: formData.parentName.trim(),
        parentPhone: formData.parentPhone.trim(),
        healthInfo: formData.specialNeeds ? formData.specialNeeds.trim() : ''
      };

      // Validate required fields again just to be safe
      const requiredFields = ['name', 'email', 'password', 'branch', 'section', 'admissionNumber', 'parentName', 'parentPhone'];
      for (const field of requiredFields) {
        if (!studentData[field]) {
          throw new Error(`${field} is required`);
        }
      }

      // Password length check
      if (studentData.password.length < 6) {
        throw new Error('Password (Student ID) must be at least 6 characters');
      }

      // Email format check
      if (!/\S+@\S+\.\S+/.test(studentData.email)) {
        throw new Error('Invalid email format');
      }

      console.log('🔍 API_URL:', API_URL);
      console.log('🔍 Token:', localStorage.getItem('token') ? 'Present' : 'Missing');
      console.log('🔍 Full URL:', `${API_URL}/api/teacher/students`);
      console.log('📤 Sending student data:', studentData);

  // Use configured API_URL (imported at top) to ensure client talks to backend
  const response = await fetch(`${API_URL}/api/teacher/students`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify(studentData)
      });

      console.log('📥 Response status:', response.status, response.statusText);

      let responseData;
      const contentType = response.headers.get("content-type");
      console.log('📥 Content-Type:', contentType);
      
      if (contentType && contentType.includes("application/json")) {
        responseData = await response.json();
        console.log('📥 Response data:', responseData);
      } else {
        const text = await response.text();
        console.log('📥 Response text:', text);
        throw new Error(text || 'Failed to create student');
      }

      if (!response.ok) {
        console.error('❌ Request failed:', responseData);
        throw new Error(responseData.message || responseData.error || 'Failed to create student');
      }

      console.log('✅ Student created successfully:', responseData);
      
      // Show success alert
      alert(`✅ Success! Student "${studentData.name}" has been added to the database.`);
      
      // Refresh recent entries from the server to show the newly added student
      await fetchRecentEntries();
      
      setShowSuccessModal(true);
      resetForm();
    } catch (error) {
      console.error('❌ Error submitting form:', error);
      console.error('❌ Error stack:', error.stack);
      const errorMessage = error.message || 'Failed to create student. Please try again.';
      setErrors(prev => ({
        ...prev,
        submit: errorMessage
      }));
      // Show error in UI with more details
      alert(`❌ Error: ${errorMessage}\n\nPlease check the console for more details.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      studentId: '',
      dateOfBirth: '',
      gender: '',
      email: '',
      phone: '',
      address: '',
      batch: '',
      semester: '',
      department: '',
      enrollmentDate: '',
      parentName: '',
      parentEmail: '',
      parentPhone: '',
      emergencyContact: '',
      previousGrades: '',
      attendance: '',
      behaviorScore: '',
      specialNeeds: '',
      hobbies: '',
      strengths: '',
      improvements: '',
      notes: ''
    });
    setProfileImage(null);
    setErrors({});
  };

  const getStudentInitials = () => {
    const first = formData.firstName.charAt(0) || 'S';
    const last = formData.lastName.charAt(0) || 'T';
    return (first + last).toUpperCase();
  };

  return (
    <div className="student-data-input">
      <div className="data-input-container">
        {/* Header */}
        <div className="data-input-header">
          <div className="header-content">
            <h1>Student Data Input</h1>
            <p>Add new student information to the system</p>
          </div>
          <div className="header-actions">
            <button className="btn-secondary">📥 Import Students</button>
            <button className="btn-primary">👥 View All Students</button>
          </div>
        </div>

        <div className="input-content-grid">
          {/* Main Form */}
          <div className="form-container">
            {/* Error Display */}
            {errors.submit && (
              <div style={{
                backgroundColor: '#fee',
                border: '2px solid #f00',
                padding: '15px',
                borderRadius: '8px',
                marginBottom: '20px',
                color: '#c00',
                fontWeight: 'bold'
              }}>
                ❌ Error: {errors.submit}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              {/* Personal Information Section */}
              <div className="form-section">
                <h3 className="section-title">👤 Personal Information</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label required">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`form-input ${errors.firstName ? 'error' : ''}`}
                      placeholder="Enter first name"
                    />
                    {errors.firstName && <span className="error-message">{errors.firstName}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label required">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={`form-input ${errors.lastName ? 'error' : ''}`}
                      placeholder="Enter last name"
                    />
                    {errors.lastName && <span className="error-message">{errors.lastName}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label required">Student ID</label>
                    <input
                      type="text"
                      name="studentId"
                      value={formData.studentId}
                      onChange={handleInputChange}
                      className={`form-input ${errors.studentId ? 'error' : ''}`}
                      placeholder="e.g., S1001"
                    />
                    {errors.studentId && <span className="error-message">{errors.studentId}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label required">Date of Birth</label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      className={`form-input ${errors.dateOfBirth ? 'error' : ''}`}
                    />
                    {errors.dateOfBirth && <span className="error-message">{errors.dateOfBirth}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label required">Gender</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className={`form-select ${errors.gender ? 'error' : ''}`}
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.gender && <span className="error-message">{errors.gender}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`form-input ${errors.email ? 'error' : ''}`}
                      placeholder="student@example.com"
                    />
                    {errors.email && <span className="error-message">{errors.email}</span>}
                  </div>

                  <div className="form-group full-width">
                    <label className="form-label">Address</label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="form-textarea"
                      placeholder="Enter complete address"
                      rows="3"
                    />
                  </div>
                </div>
              </div>

              {/* Academic Information Section */}
              <div className="form-section">
                <h3 className="section-title">🎓 Academic Information</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label required">Batch</label>
                    <select
                      name="batch"
                      value={formData.batch}
                      onChange={handleInputChange}
                      className={`form-select ${errors.batch ? 'error' : ''}`}
                    >
                      <option value="">Select batch</option>
                      {batches.map(batch => (
                        <option key={batch} value={batch}>{batch}</option>
                      ))}
                    </select>
                    {errors.batch && <span className="error-message">{errors.batch}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label required">Department</label>
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      className={`form-select ${errors.department ? 'error' : ''}`}
                    >
                      <option value="">Select department</option>
                      {departments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                    {errors.department && <span className="error-message">{errors.department}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Semester</label>
                    <select
                      name="semester"
                      value={formData.semester}
                      onChange={handleInputChange}
                      className="form-select"
                    >
                      <option value="">Select semester</option>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                        <option key={sem} value={sem}>Semester {sem}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Enrollment Date</label>
                    <input
                      type="date"
                      name="enrollmentDate"
                      value={formData.enrollmentDate}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information Section */}
              <div className="form-section">
                <h3 className="section-title">📞 Contact Information</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Parent/Guardian Name</label>
                    <input
                      type="text"
                      name="parentName"
                      value={formData.parentName}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Parent's full name"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Parent Email</label>
                    <input
                      type="email"
                      name="parentEmail"
                      value={formData.parentEmail}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="parent@example.com"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Parent Phone</label>
                    <input
                      type="tel"
                      name="parentPhone"
                      value={formData.parentPhone}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Emergency Contact</label>
                    <input
                      type="tel"
                      name="emergencyContact"
                      value={formData.emergencyContact}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Emergency phone number"
                    />
                  </div>
                </div>
              </div>

              {/* Additional Information Section */}
              <div className="form-section">
                <h3 className="section-title">📝 Additional Information</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Hobbies & Interests</label>
                    <input
                      type="text"
                      name="hobbies"
                      value={formData.hobbies}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Sports, music, arts, etc."
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Strengths</label>
                    <input
                      type="text"
                      name="strengths"
                      value={formData.strengths}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Academic strengths"
                    />
                  </div>

                  <div className="form-group full-width">
                    <label className="form-label">Areas for Improvement</label>
                    <textarea
                      name="improvements"
                      value={formData.improvements}
                      onChange={handleInputChange}
                      className="form-textarea"
                      placeholder="Areas where student needs support"
                      rows="3"
                    />
                  </div>

                  <div className="form-group full-width">
                    <label className="form-label">Additional Notes</label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      className="form-textarea"
                      placeholder="Any additional information about the student"
                      rows="4"
                    />
                  </div>
                </div>
              </div>

              {/* Profile Picture Upload */}
              <div className="form-section">
                <h3 className="section-title">🖼️ Profile Picture</h3>
                <div className="file-upload" onClick={() => document.getElementById('profileImage').click()}>
                  <div className="file-upload-content">
                    <div className="file-icon">📷</div>
                    <div className="file-text">
                      {profileImage ? 'Change profile picture' : 'Click to upload profile picture'}
                    </div>
                    <div className="upload-btn">Choose File</div>
                  </div>
                  <input
                    type="file"
                    id="profileImage"
                    className="file-input"
                    accept="image/*"
                    onChange={handleFileUpload}
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="form-actions">
                <button type="button" className="btn-reset" onClick={resetForm}>
                  Reset Form
                </button>
                <button 
                  type="submit" 
                  className={`btn-submit ${isSubmitting ? 'btn-loading' : ''}`}
                  disabled={isSubmitting}
                  onClick={(e) => {
                    console.log('Add Student button clicked directly!');
                  }}
                >
                  {isSubmitting ? '⏳ Adding Student...' : '✅ Add Student'}
                </button>
              </div>
            </form>
          </div>

          {/* Preview Sidebar */}
          <div className="preview-sidebar">
            <h3 className="preview-title">Student Preview</h3>
            <div className="student-preview">
              <div className="student-avatar">
                {profileImage ? (
                  <img 
                    src={profileImage} 
                    alt="Student" 
                    style={{ width: '100%', height: '100%', borderRadius: '20px', objectFit: 'cover' }}
                  />
                ) : (
                  getStudentInitials()
                )}
              </div>
              <div className="student-info">
                <div className="student-name">
                  {formData.firstName || 'New'} {formData.lastName || 'Student'}
                </div>
                <div className="student-id">
                  {formData.studentId || 'ID: Not set'}
                </div>
              </div>
              <div className="preview-details">
                <div className="preview-item">
                  <span className="preview-label">Batch</span>
                  <span className="preview-value">{formData.batch || 'Not set'}</span>
                </div>
                <div className="preview-item">
                  <span className="preview-label">Department</span>
                  <span className="preview-value">{formData.department || 'Not set'}</span>
                </div>
                <div className="preview-item">
                  <span className="preview-label">Email</span>
                  <span className="preview-value">{formData.email || 'Not set'}</span>
                </div>
                <div className="preview-item">
                  <span className="preview-label">Status</span>
                  <span className="preview-value" style={{ color: '#4ade80' }}>Ready to Submit</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Entries */}
        <div className="recent-entries">
          <div className="entries-header">
            <h3 className="entries-title">
              {showAllStudents ? 'All Students' : 'Recent Entries'}
            </h3>
            <span 
              className="view-all-btn" 
              onClick={() => {
                if (showAllStudents) {
                  setShowAllStudents(false);
                } else {
                  fetchAllStudents();
                }
              }}
              style={{ cursor: 'pointer' }}
            >
              {showAllStudents ? '← Back to Recent' : 'View All →'}
            </span>
          </div>
          <div className="entries-list">
            {(showAllStudents ? allStudents : recentEntries).length === 0 ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '40px 20px', 
                color: '#666',
                fontSize: '14px'
              }}>
                {showAllStudents ? 'No students found in the database.' : 'No recent entries yet. Add your first student!'}
              </div>
            ) : (
              (showAllStudents ? allStudents : recentEntries).map(entry => (
                <div key={entry.id} className="entry-item">
                  <div className="entry-avatar">{entry.initials}</div>
                  <div className="entry-info">
                    <div className="entry-name">{entry.name}</div>
                    <div className="entry-details">
                      {entry.batch} {entry.section ? `• ${entry.section}` : ''} • {entry.id}
                    </div>
                  </div>
                  <div className="entry-date">{entry.date}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="modal-overlay" onClick={() => setShowSuccessModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon">🎉</div>
            <h3 className="modal-title">Student Added Successfully!</h3>
            <p className="modal-message">
              The student has been successfully added to the system. 
              You can now view them in the student list below.
            </p>
            <div className="modal-actions">
              <button 
                className="btn-reset" 
                onClick={() => {
                  setShowSuccessModal(false);
                  resetForm();
                }}
              >
                Add Another Student
              </button>
              <button 
                className="btn-submit" 
                onClick={() => {
                  setShowSuccessModal(false);
                  fetchAllStudents();
                  // Scroll to recent entries section
                  document.querySelector('.recent-entries')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                View All Students
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDataInput;