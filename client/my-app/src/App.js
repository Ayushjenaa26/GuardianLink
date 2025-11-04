import React, { useState, useEffect } from 'react';
import './App.css';
import HomePage from './HomePage';
import './HomePage.css';
import ParentDashboard from './ParentSide/ParentDashboard';
import TeacherDashboard from './TeacherSide/TeacherDashboard';
import AdminDashboard from './AdminSide/AdminDashboard';
import { useAuth } from './context/AuthContext';

const roles = [
  { 
    value: 'parent',
    label: 'Parent',
    description: "Monitor your child's academic progress",
    icon: <span style={{fontSize: '1.5rem', color: '#2563eb'}}>👨‍👩‍👧‍👦</span>
  },
  {
    value: 'teacher',
    label: 'Teacher',
    description: "Manage classes and student records",
    icon: <span style={{fontSize: '1.5rem', color: '#22c55e'}}>🧑‍🏫</span>
  },
  {
    value: 'admin',
    label: 'Administrator',
    description: "System management and oversight",
    icon: <span style={{fontSize: '1.5rem', color: '#a855f7'}}>🛡️</span>
  }
];

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [activeTab, setActiveTab] = useState('signin');
  const [role, setRole] = useState('');
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [signedIn, setSignedIn] = useState(false);

  const { login, register, logout, user, loading, error } = useAuth();

  useEffect(() => {
    // Check if user is already authenticated
    if (user) {
      setSignedIn(true);
      setRole(user.role);
      setCurrentPage('dashboard');
    }
  }, [user]);

  // Handle sign in
  const handleSignIn = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');

    if (!role) {
      alert('Please select your role');
      return;
    }

    try {
      await login(email, password, role);
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  // Handle sign up
  const handleSignUp = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get('name');
    const email = formData.get('email');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');

    if (!role) {
      alert('Please select your role');
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      const result = await register(name, email, password, role);
      if (result && result.user) {
        setSignedIn(true);
        setRole(result.user.role);
        setCurrentPage('dashboard');
      }
    } catch (err) {
      console.error('Registration failed:', err);
    }
  };

  // Navigation handlers
  const handleGoToAuth = () => {
    setCurrentPage('auth');
  };

  const handleGoToHome = () => {
    setCurrentPage('home');
    setSignedIn(false);
    setRole('');
  };

  const handleSignOut = () => {
    logout();
    setSignedIn(false);
    setRole('');
    setCurrentPage('home');
  };

  // Render home page
  if (currentPage === 'home') {
    return <HomePage onNavigateToAuth={handleGoToAuth} />;
  }

  // Render dashboards if signed in
  if (signedIn && user) {
    switch (user.role.toLowerCase()) {
      case 'parent':
        return <ParentDashboard user={user} onSignOut={handleSignOut} />;
      case 'teacher':
        return <TeacherDashboard user={user} onSignOut={handleSignOut} />;
      case 'admin':
        return <AdminDashboard user={user} onSignOut={handleSignOut} />;
      default:
        return <HomePage onNavigateToAuth={handleGoToAuth} />;
    }
  }

  // Render authentication page
  return (
    <div className="auth-bg">
      <div className="auth-container">
        {/* Back to Home Button */}
        <button className="back-to-home" onClick={handleGoToHome}>
          ← Back to Home
        </button>
        
        <div className="auth-logo">
          <div className="logo-icon">🔗</div>
        </div>
        <h1 className="auth-title">GuardianLink</h1>
        <p className="auth-subtitle">Secure institutional access portal</p>
        <div className="auth-optimized">🖥️ Optimized for desktop</div>
        <hr className="auth-divider" />
        <div className="auth-powered">
          Powered by <a href="https://edutrackers.com" target="_blank" rel="noopener noreferrer">EduTrackers</a>
        </div>
        
        {/* Error Display */}
        {error && (
          <div className="auth-error" style={{ 
            color: 'red', 
            margin: '10px 0', 
            textAlign: 'center',
            padding: '10px',
            backgroundColor: '#ffe6e6',
            borderRadius: '5px'
          }}>
            ⚠️ {error}
          </div>
        )}
        
        <div className="auth-tabs">
          <button
            className={activeTab === 'signin' ? 'active' : ''}
            onClick={() => setActiveTab('signin')}
          >
            Sign In
          </button>
          <button
            className={activeTab === 'signup' ? 'active' : ''}
            onClick={() => setActiveTab('signup')}
          >
            Sign Up
          </button>
        </div>
        
        {activeTab === 'signin' ? (
          <form className="auth-form" onSubmit={handleSignIn}>
            <label>Email Address</label>
            <input 
              type="email"
              name="email"
              placeholder="Enter your institutional email"
              required
            />
            
            <label>Password</label>
            <div className="auth-password">
              <input 
                type="password"
                name="password"
                placeholder="Enter your password"
                required
              />
              <span className="auth-eye">👁️</span>
            </div>
            
            <label>Select Your Role</label>
            <div
              className="custom-select"
              tabIndex={0}
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              onBlur={() => setTimeout(() => setShowRoleDropdown(false), 150)}
            >
              <div className="custom-select-value">
                {role
                  ? (
                    <>
                      {roles.find(r => r.value === role)?.icon}
                      <span style={{marginLeft: 8}}>{roles.find(r => r.value === role)?.label}</span>
                      <span className="custom-select-desc">{roles.find(r => r.value === role)?.description}</span>
                    </>
                  )
                  : <span style={{color: '#888'}}>Choose your role to continue</span>
                }
              </div>
              {showRoleDropdown && (
                <div className="custom-select-dropdown">
                  {roles.map(r => (
                    <div
                      key={r.value}
                      className={`custom-select-option${role === r.value ? ' selected' : ''}`}
                      onClick={() => { setRole(r.value); setShowRoleDropdown(false); }}
                    >
                      {r.icon}
                      <div style={{marginLeft: 10}}>
                        <div style={{fontWeight: 500}}>{r.label}</div>
                        <div style={{fontSize: '0.95rem', color: '#888'}}>{r.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="auth-remember">
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Remember my credentials on this device</label>
            </div>
            
            <button type="submit" className="auth-btn" disabled={loading || !role}>
              {loading ? 'Signing in...' : 'Sign In to GuardianLink →'}
            </button>
            
            <div className="auth-demo">
              <b>Demo Mode:</b>
              <br />
              Use any email/password with your selected role to try the portal.
            </div>
            
            <div className="auth-footer">
              <button type="button" style={{color: '#6366f1', background: 'none', border: 'none', cursor: 'pointer', padding: 0}}>
                Forgot Password?
              </button>
              <span style={{margin: '0 8px'}}> | </span>
              <span style={{color: '#888'}}>Need help? Contact IT Support</span>
            </div>
          </form>
        ) : (
          <form className="auth-form" onSubmit={handleSignUp}>
            <label>Full Name</label>
            <input 
              type="text"
              name="name"
              placeholder="Enter your full name"
              required 
            />
            
            <label>Email Address</label>
            <input 
              type="email"
              name="email"
              placeholder="Enter your institutional email"
              required 
            />
            
            <label>Password</label>
            <div className="auth-password">
              <input 
                type="password"
                name="password"
                placeholder="Create a password"
                required 
              />
              <span className="auth-eye">👁️</span>
            </div>
            
            <label>Confirm Password</label>
            <div className="auth-password">
              <input 
                type="password"
                name="confirmPassword"
                placeholder="Confirm your password"
                required 
              />
              <span className="auth-eye">👁️</span>
            </div>
            
            <label>Select Your Role</label>
            <div
              className="custom-select"
              tabIndex={0}
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              onBlur={() => setTimeout(() => setShowRoleDropdown(false), 150)}
            >
              <div className="custom-select-value">
                {role
                  ? (
                    <>
                      {roles.find(r => r.value === role)?.icon}
                      <span style={{marginLeft: 8}}>{roles.find(r => r.value === role)?.label}</span>
                      <span className="custom-select-desc">{roles.find(r => r.value === role)?.description}</span>
                    </>
                  )
                  : <span style={{color: '#888'}}>Choose your role to continue</span>
                }
              </div>
              {showRoleDropdown && (
                <div className="custom-select-dropdown">
                  {roles.map(r => (
                    <div
                      key={r.value}
                      className={`custom-select-option${role === r.value ? ' selected' : ''}`}
                      onClick={() => { setRole(r.value); setShowRoleDropdown(false); }}
                    >
                      {r.icon}
                      <div style={{marginLeft: 10}}>
                        <div style={{fontWeight: 500}}>{r.label}</div>
                        <div style={{fontSize: '0.95rem', color: '#888'}}>{r.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="auth-terms">
              <input type="checkbox" id="terms" required />
              <label htmlFor="terms">
                I agree to the Terms of Service and Privacy Policy
              </label>
            </div>
            
            <button type="submit" className="auth-btn" disabled={loading || !role}>
              {loading ? 'Creating Account...' : 'Create Account →'}
            </button>
            
            <div className="auth-demo">
              <b>Demo Registration:</b>
              <br />
              Fill any details to create a demo account for testing.
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default App;