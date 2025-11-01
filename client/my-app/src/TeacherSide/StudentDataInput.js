import React, { useState } from 'react';
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

  // Sample recent entries for preview
  const recentEntries = [
    {
      id: 'S1001',
      name: 'Emily Johnson',
      batch: 'B1 - Full Stack',
      date: '2 hours ago',
      initials: 'EJ'
    },
    {
      id: 'S1002',
      name: 'Michael Rodriguez',
      batch: 'B2 - Software Eng',
      date: '4 hours ago',
      initials: 'MR'
    },
    {
      id: 'S1003',
      name: 'Sarah Chen',
      batch: 'B1 - Full Stack',
      date: '1 day ago',
      initials: 'SC'
    },
    {
      id: 'S1004',
      name: 'David Wilson',
      batch: 'B3 - Database',
      date: '2 days ago',
      initials: 'DW'
    }
  ];

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

    // Required field validation
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.studentId.trim()) newErrors.studentId = 'Student ID is required';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.batch) newErrors.batch = 'Batch selection is required';
    if (!formData.department) newErrors.department = 'Department is required';

    // Email validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Form submitted:', formData);
      setShowSuccessModal(true);
      resetForm();
    } catch (error) {
      console.error('Error submitting form:', error);
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
                >
                  {isSubmitting ? '' : 'Add Student'}
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
            <h3 className="entries-title">Recent Entries</h3>
            <span className="view-all-btn">View All →</span>
          </div>
          <div className="entries-list">
            {recentEntries.map(entry => (
              <div key={entry.id} className="entry-item">
                <div className="entry-avatar">{entry.initials}</div>
                <div className="entry-info">
                  <div className="entry-name">{entry.name}</div>
                  <div className="entry-details">{entry.batch} • {entry.id}</div>
                </div>
                <div className="entry-date">{entry.date}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-icon">🎉</div>
            <h3 className="modal-title">Student Added Successfully!</h3>
            <p className="modal-message">
              {formData.firstName} {formData.lastName} has been successfully added to the system. 
              You can now view their profile in the student management section.
            </p>
            <div className="modal-actions">
              <button className="btn-reset" onClick={() => setShowSuccessModal(false)}>
                Add Another Student
              </button>
              <button className="btn-submit" onClick={() => setShowSuccessModal(false)}>
                View Student List
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDataInput;