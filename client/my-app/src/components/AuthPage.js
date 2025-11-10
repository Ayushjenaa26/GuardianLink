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
  
  // Teacher specific
  const [subject, setSubject] = useState('');
  const [classes, setClasses] = useState('');
  
  // Parent specific
  const [childName, setChildName] = useState('');
  const [childClass, setChildClass] = useState('');
  
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
      // Validation
      if (!email || !password || !role) {
        throw new Error('Please fill in all required fields');
      }

      // For Admin and Parent - Skip API calls, use frontend only
      if (role === 'admin' || role === 'parent') {
        // Simple validation
        if (!isLogin && password !== confirmPassword) {
          throw new Error('Passwords do not match');
        }

        // Create mock user data
        const mockUser = {
          id: `${role}_${Date.now()}`,
          email: email,
          name: name || email.split('@')[0],
          role: role
        };

        // Store mock authentication data
        localStorage.setItem('token', `mock_token_${Date.now()}`);
        localStorage.setItem('user', JSON.stringify(mockUser));

        // Set success message
        const successMsg = isLogin ? 'Login successful! Redirecting...' : 'Registration successful! Redirecting...';
        setSuccess(successMsg);

        // Navigate based on role
        const roleRoutes = {
          admin: '/admin',
          parent: '/parent'
        };

        setTimeout(() => {
          navigate(roleRoutes[role] || '/');
        }, 1500);
        
        setLoading(false);
        return;
      }

      // For Teacher - Continue with API calls
      if (!isLogin) {
        if (!name || !email || !password || !confirmPassword) {
          throw new Error('Please fill in all required fields');
        }
        
        if (password !== confirmPassword) {
          throw new Error('Passwords do not match');
        }
        
        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters long');
        }
        
        if (role === 'teacher' && (!subject || !classes || !phone)) {
          throw new Error('Please fill in subject, classes, and phone number for teacher registration');
        }
      }

      // Check server availability for teacher
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
        
        if (role === 'teacher') {
          requestBody.subject = subject;
          requestBody.classes = classes.split(',').map(c => c.trim());
        } else if (role === 'parent') {
          requestBody.childName = childName;
          requestBody.childClass = childClass;
        } else if (role === 'admin') {
          // Admin registration - basic fields only
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
          )}

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

          {/* Sign Up Only: Phone Number (for all roles) */}
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your phone number"
                required
              />
            </div>
          )}

          {/* Sign Up Only: Teacher Specific Fields */}
          {!isLogin && role === 'teacher' && (
            <>
              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input
                  type="text"
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g., Mathematics"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="classes">Classes (comma separated)</label>
                <input
                  type="text"
                  id="classes"
                  value={classes}
                  onChange={(e) => setClasses(e.target.value)}
                  placeholder="e.g., 10A, 10B, 11A"
                  required
                />
              </div>
            </>
          )}

          {/* Sign Up Only: Parent Specific Fields */}
          {!isLogin && role === 'parent' && (
            <>
              <div className="form-group">
                <label htmlFor="childName">Child's Name</label>
                <input
                  type="text"
                  id="childName"
                  value={childName}
                  onChange={(e) => setChildName(e.target.value)}
                  placeholder="Enter your child's name"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="childClass">Child's Class</label>
                <input
                  type="text"
                  id="childClass"
                  value={childClass}
                  onChange={(e) => setChildClass(e.target.value)}
                  placeholder="e.g., 10A"
                  required
                />
              </div>
            </>
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