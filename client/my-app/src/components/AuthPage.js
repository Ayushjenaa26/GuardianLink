import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './AuthPage.css';

const AuthPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('parent');
  const [isLogin, setIsLogin] = useState(true);
  const [rememberMe, setRememberMe] = useState(false);
  const { login, error, loading } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLogin) {
      await login(email, password, role);
    }
  };

  const roles = [
    {
      id: 'parent',
      title: 'Parent',
      description: 'Monitor your child\'s academic progress',
      icon: '👨‍👩‍👧‍👦'
    },
    {
      id: 'teacher',
      title: 'Teacher',
      description: 'Manage classes and student progress',
      icon: '👩‍🏫'
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
            onClick={() => setIsLogin(true)}
          >
            Sign In
          </button>
          <button 
            className={`tab-button ${!isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(false)}
          >
            Sign Up
          </button>
        </div>

        {error && <div className="error-message">⚠️ {error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
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

          <div className="form-group role-selection">
            <label>Select Your Role</label>
            <div className="role-options">
              {roles.map((roleOption) => (
                <div 
                  key={roleOption.id}
                  className={`role-option ${role === roleOption.id ? 'selected' : ''}`}
                  onClick={() => setRole(roleOption.id)}
                >
                  <span className="role-icon">{roleOption.icon}</span>
                  <div className="role-info">
                    <h3>{roleOption.title}</h3>
                    <p>{roleOption.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

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

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Sign Up')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;