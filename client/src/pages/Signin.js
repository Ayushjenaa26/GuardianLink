import React, { useState } from 'react';
import './Signup.css';

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'parent'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRoleSelect = (role) => {
    setFormData({
      ...formData,
      role: role
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Store token and user data
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Redirect based on role
        switch (formData.role) {
          case 'parent':
            window.location.href = '/parent-dashboard';
            break;
          case 'teacher':
            window.location.href = '/teacher-dashboard';
            break;
          case 'administrator':
            window.location.href = '/admin-dashboard';
            break;
          default:
            window.location.href = '/dashboard';
        }
      } else {
        setError(data.message || 'Sign in failed');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signin-container">
      <div className="signin-card">
        <div className="signin-left">
          <div className="brand">
            <div className="brand-icon">GL</div>
            <h2>GuardianLink</h2>
          </div>
          <p className="tagline">Secure institutional access portal</p>
          <p className="subtitle">Optimised for desktop</p>
          
          <div className="features">
            <div className="feature-item">
              <span className="checkmark">✓</span>
              <span>Monitor academic progress in real-time</span>
            </div>
            <div className="feature-item">
              <span className="checkmark">✓</span>
              <span>Access assignments and grades</span>
            </div>
            <div className="feature-item">
              <span className="checkmark">✓</span>
              <span>Communicate with teachers</span>
            </div>
            <div className="feature-item">
              <span className="checkmark">✓</span>
              <span>Track attendance and schedules</span>
            </div>
          </div>
          
          <div className="powered-by">
            <span>Powered by failTrackers</span>
          </div>
        </div>
        
        <div className="signin-right">
          <h3>Sign in to your account</h3>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your institutional email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Select Your Role</label>
              <div className="role-selector">
                <div 
                  className={`role-option ${formData.role === 'parent' ? 'selected' : ''}`}
                  onClick={() => handleRoleSelect('parent')}
                >
                  <div className="role-icon">👨‍👩‍👧‍👦</div>
                  <div className="role-title">Parent</div>
                  <div className="role-description">Monitor your child's academic progress</div>
                </div>
                
                <div 
                  className={`role-option ${formData.role === 'teacher' ? 'selected' : ''}`}
                  onClick={() => handleRoleSelect('teacher')}
                >
                  <div className="role-icon">🎓</div>
                  <div className="role-title">Teacher</div>
                  <div className="role-description">Manage classes and student records</div>
                </div>
                
                <div 
                  className={`role-option ${formData.role === 'administrator' ? 'selected' : ''}`}
                  onClick={() => handleRoleSelect('administrator')}
                >
                  <div className="role-icon">⚙️</div>
                  <div className="role-title">Administrator</div>
                  <div className="role-description">System management and oversight</div>
                </div>
              </div>
            </div>
            
            {error && <div className="error-message">{error}</div>}
            
            <button type="submit" className="signin-button" disabled={loading}>
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
          
          <div className="forgot-password">
            <a href="/forgot-password">Forgot your password?</a>
          </div>
          
          <div className="signup-link">
            <span>Don't have an account? </span>
            <a href="/signup">Sign Up</a>
          </div>
          
          <div className="footer">
            <span>© 2023 GuardianLink. All rights reserved.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;