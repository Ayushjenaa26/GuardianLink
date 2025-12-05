import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import config from '../config';
import './AuthPage.css';

const AuthPage = () => {
  // Common fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('teacher');
  const [isLogin, setIsLogin] = useState(true);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Sign up only fields
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  
  // Parent specific
  const [studentRollNo, setStudentRollNo] = useState('');
  
  // Admin specific
  const [adminId, setAdminId] = useState('');
  const [showAdminHelp, setShowAdminHelp] = useState(false);
  
  const navigate = useNavigate();

  // API endpoints
  const API_ENDPOINTS = {
    health: `${config.apiUrl}/api/health`,
    login: `${config.apiUrl}/api/auth/login`,
    register: `${config.apiUrl}/api/auth/register`
  };

  // Debug logging
  console.log('🔍 API Configuration:', {
    apiUrl: config.apiUrl,
    healthEndpoint: API_ENDPOINTS.health
  });

  // Check server availability
  const isServerAvailable = async () => {
    try {
      console.log('🔍 Checking server at:', API_ENDPOINTS.health);
      const response = await fetch(API_ENDPOINTS.health);
      console.log('✅ Server response:', response.ok, response.status);
      return response.ok;
    } catch (error) {
      console.error('❌ Server health check failed:', error);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      // Basic validation
      if (!email || !password || !role) {
        throw new Error('Please fill in all required fields');
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Please enter a valid email address');
      }

      // Sign Up validations
      if (!isLogin) {
        // Name validation
        if (!name || name.trim().length < 2) {
          throw new Error('Name must be at least 2 characters long');
        }

        // Password match validation
        if (password !== confirmPassword) {
          throw new Error('Passwords do not match');
        }

        // Password strength validation
        if (password.length < 8) {
          throw new Error('Password must be at least 8 characters long');
        }
        
        if (!/[A-Z]/.test(password)) {
          throw new Error('Password must contain at least one uppercase letter');
        }
        
        if (!/[a-z]/.test(password)) {
          throw new Error('Password must contain at least one lowercase letter');
        }
        
        if (!/[0-9]/.test(password)) {
          throw new Error('Password must contain at least one number');
        }
        
        if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
          throw new Error('Password must contain at least one special character (!@#$%^&*...)');
        }

        // Phone number validation
        if (!phone || phone.trim() === '') {
          throw new Error('Phone number is required');
        }

        // Remove any spaces, dashes, or parentheses
        const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
        
        if (!/^\d+$/.test(cleanPhone)) {
          throw new Error('Phone number must contain only digits');
        }
        
        if (cleanPhone.length !== 10) {
          throw new Error('Phone number must be exactly 10 digits');
        }

        // Role-specific validations
        if (role === 'parent' && !studentRollNo) {
          throw new Error('Please enter the Student Roll Number');
        }

        if (role === 'admin' && !adminId) {
          throw new Error('Please enter your Admin Unique ID');
        }
      }

      // Check server availability
      const serverAvailable = await isServerAvailable();
      if (!serverAvailable) {
        throw new Error('Server is not available. Please try again later.');
      }
      
      const endpoint = isLogin ? API_ENDPOINTS.login : API_ENDPOINTS.register;
      
      console.log('🔍 Authentication Type:', isLogin ? 'Login' : 'Register');
      console.log('🔍 Endpoint:', endpoint);
      console.log('🔍 Role:', role);
      
      // Prepare request body based on role and action
      let requestBody = {
        email: email.trim(),
        password,
        role: role.toLowerCase()
      };
      
      if (!isLogin) {
        requestBody.name = name.trim();
        requestBody.phone = phone;
        
        if (role === 'parent') {
          requestBody.studentRollNo = studentRollNo.trim();
        } else if (role === 'admin') {
          requestBody.adminId = adminId.trim();
          requestBody.permissions = ['manage_students', 'manage_teachers', 'manage_parents'];
        }
      }
      
      console.log('📤 Request Body:', JSON.stringify(requestBody, null, 2));
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      console.log('📥 Response Status:', response.status, response.statusText);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ Error Response:', errorData);
        const errorMessages = {
          404: 'The authentication service is not available',
          401: 'Invalid email or password',
          403: 'Access denied. Please check your role',
          400: errorData.message || 'Invalid request data',
          500: 'Server error. Please try again later'
        };
        throw new Error(errorMessages[response.status] || errorData.message || 'Authentication failed');
      }

      const data = await response.json();
      console.log('✅ Success Response:', data);
      
      if (!data.success) {
        throw new Error(data.message || 'Authentication failed');
      }

      if (!data.token || !data.user) {
        throw new Error('Invalid server response: missing token or user data');
      }

      // Clear any previous errors and set success message
      setError(null);
      const successMsg = isLogin ? 'Login successful! Redirecting...' : 'Registration successful! Redirecting...';
      console.log('✅ Setting success message:', successMsg);
      setSuccess(successMsg);
      
      // Store authentication data
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Navigate based on role after a short delay to show success message
      const roleRoutes = {
        teacher: '/teacher',
        admin: '/admin',
        parent: '/parent',
        student: '/parent'
      };
      
      console.log('✅ Registration/Login successful! Navigating to:', roleRoutes[data.user.role]);
      setTimeout(() => {
        navigate(roleRoutes[data.user.role] || '/');
      }, 2000); // 2 seconds delay to show success message
      
    } catch (error) {
      console.error('❌ Authentication error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    {
      id: 'teacher',
      title: 'Teacher',
      description: 'Manage classes and student progress',
      icon: '‍🏫'
    },
    {
      id: 'parent',
      title: 'Parent',
      description: 'Monitor your child\'s academic progress',
      icon: '👨‍👩‍👧‍👦'
    },
    {
      id: 'admin',
      title: 'Admin',
      description: 'School administration and management',
      icon: '👨‍💼'
    }
  ];

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-header">
          <h1 className="auth-title">Guardian Link</h1>
          <p className="powered-by">Powered by EduTrackers</p>
        </div>

        <div className="auth-tabs">
          <button 
            className={`tab-button ${isLogin ? 'active' : ''}`}
            onClick={() => {
              setIsLogin(true);
              setError(null);
              setSuccess(null);
            }}
          >
            Sign In
          </button>
          <button 
            className={`tab-button ${!isLogin ? 'active' : ''}`}
            onClick={() => {
              setIsLogin(false);
              setError(null);
              setSuccess(null);
            }}
          >
            Sign Up
          </button>
        </div>

        {success && (
          <div style={{
            backgroundColor: '#d4edda',
            color: '#155724',
            padding: '16px',
            borderRadius: '8px',
            marginBottom: '24px',
            border: '1px solid #c3e6cb',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontWeight: '500'
          }}>
            ✅ {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          {/* Sign Up Only: Name Field */}
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          {/* Sign Up Only: Confirm Password */}
          {!isLogin && (
            <>
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  required
                />
              </div>
              
              {/* Password Strength Indicator */}
              {password && (
                <div style={{
                  fontSize: '12px',
                  marginTop: '-12px',
                  marginBottom: '16px',
                  padding: '8px 12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '6px',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <div style={{ marginBottom: '4px', fontWeight: '600', color: '#a78bfa' }}>Password Requirements:</div>
                  <div style={{ color: password.length >= 8 ? '#10b981' : '#ef4444' }}>
                    {password.length >= 8 ? '✓' : '✗'} At least 8 characters
                  </div>
                  <div style={{ color: /[A-Z]/.test(password) ? '#10b981' : '#ef4444' }}>
                    {/[A-Z]/.test(password) ? '✓' : '✗'} One uppercase letter
                  </div>
                  <div style={{ color: /[a-z]/.test(password) ? '#10b981' : '#ef4444' }}>
                    {/[a-z]/.test(password) ? '✓' : '✗'} One lowercase letter
                  </div>
                  <div style={{ color: /[0-9]/.test(password) ? '#10b981' : '#ef4444' }}>
                    {/[0-9]/.test(password) ? '✓' : '✗'} One number
                  </div>
                  <div style={{ color: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password) ? '#10b981' : '#ef4444' }}>
                    {/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password) ? '✓' : '✗'} One special character (!@#$%...)
                  </div>
                </div>
              )}
            </>
          )}

          {/* Sign Up Only: Role Selection */}
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="role">Select Your Role</label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="form-select"
                required
              >
                {roles.map((roleOption) => (
                  <option key={roleOption.id} value={roleOption.id}>
                    {roleOption.icon} {roleOption.title} - {roleOption.description}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Sign Up Only: Phone Number (for all roles) */}
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => {
                  // Only allow numbers and limit to 10 digits
                  const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                  setPhone(value);
                }}
                placeholder="Enter 10-digit phone number"
                maxLength="10"
                pattern="[0-9]{10}"
                required
              />
              {phone && phone.length > 0 && phone.length < 10 && (
                <div style={{
                  fontSize: '12px',
                  color: '#ef4444',
                  marginTop: '4px'
                }}>
                  {phone.length}/10 digits entered
                </div>
              )}
              {phone && phone.length === 10 && (
                <div style={{
                  fontSize: '12px',
                  color: '#10b981',
                  marginTop: '4px'
                }}>
                  ✓ Valid phone number
                </div>
              )}
            </div>
          )}

          {/* Sign Up Only: Admin Specific Fields */}
          {!isLogin && role === 'admin' && (
            <div className="form-group">
              <label htmlFor="adminId">Unique ID</label>
              <input
                type="text"
                id="adminId"
                value={adminId}
                onChange={(e) => setAdminId(e.target.value)}
                placeholder="Enter your unique admin ID"
                required
              />
              <button
                type="button"
                onClick={() => setShowAdminHelp(!showAdminHelp)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#a78bfa',
                  cursor: 'pointer',
                  fontSize: '13px',
                  marginTop: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                ❓ How to get your Unique ID?
              </button>
              {showAdminHelp && (
                <div style={{
                  marginTop: '12px',
                  padding: '16px',
                  backgroundColor: 'rgba(167, 139, 250, 0.1)',
                  borderRadius: '8px',
                  border: '1px solid rgba(167, 139, 250, 0.3)',
                  fontSize: '13px',
                  lineHeight: '1.6'
                }}>
                  <div style={{ fontWeight: '600', marginBottom: '8px', color: '#a78bfa' }}>
                    📋 How to Request Admin Unique ID:
                  </div>
                  <ol style={{ margin: '0', paddingLeft: '20px', color: '#d1d5db' }}>
                    <li>Send an email to <strong style={{ color: '#10b981' }}>ayush.jena26@gmail.com</strong></li>
                    <li>Subject: "Request for Admin Unique ID"</li>
                    <li>Include your full name, school/organization name, and designation</li>
                    <li>You will receive your unique ID within 24-48 hours</li>
                  </ol>
                  <div style={{ marginTop: '12px', padding: '8px', backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: '4px', color: '#fca5a5' }}>
                    ⚠️ Note: Each Unique ID can only be registered with one email address.
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Sign Up Only: Parent Specific Fields */}
          {!isLogin && role === 'parent' && (
            <div className="form-group">
              <label htmlFor="studentRollNo">Student's Roll Number</label>
              <input
                type="text"
                id="studentRollNo"
                value={studentRollNo}
                onChange={(e) => setStudentRollNo(e.target.value)}
                placeholder="Enter your child's roll number"
                required
              />
              <div style={{
                marginTop: '8px',
                fontSize: '12px',
                color: '#9ca3af'
              }}>
                ℹ️ Each roll number can only be registered with one parent email.
              </div>
            </div>
          )}

          {isLogin && (
            <div className="form-group remember-me">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Remember my credentials on this device
              </label>
            </div>
          )}

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Sign Up')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;