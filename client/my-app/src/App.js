import React, { useState } from 'react';
import './App.css';
import HomePage from './HomePage';
import ParentDashboard from './ParentSide/ParentDashboard';
import TeacherDashboard from './TeacherSide/TeacherDashboard';
import AdminDashboard from './AdminSide/AdminDashboard';
import SecurityAudit from './AdminSide/SecurityAudit';

const roles = [
  { 
    value: 'Parent',
    label: 'Parent',
    description: "Monitor your child's academic progress",
    icon: <span style={{fontSize: '1.5rem', color: '#2563eb'}}>👨‍👩‍👧‍👦</span>
  },
  {
    value: 'Teacher',
    label: 'Teacher',
    description: "Manage classes and student records",
    icon: <span style={{fontSize: '1.5rem', color: '#22c55e'}}>🧑‍🏫</span>
  },
  {
    value: 'Administrator',
    label: 'Administrator',
    description: "System management and oversight",
    icon: <span style={{fontSize: '1.5rem', color: '#a855f7'}}>🛡️</span>
  }
];

function App() {
  const [currentPage, setCurrentPage] = useState('home'); // 'home', 'auth', or 'dashboard'
  const [activeTab, setActiveTab] = useState('signin');
  const [role, setRole] = useState('');
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [signedIn, setSignedIn] = useState(false);

  // Handle sign in
  const handleSignIn = (e) => {
    e.preventDefault();
    if (role) {
      setSignedIn(true);
      setCurrentPage('dashboard');
    }
  };

  // Handle sign up
  const handleSignUp = (e) => {
    e.preventDefault();
    if (role) {
      setSignedIn(true);
      setCurrentPage('dashboard');
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
    setSignedIn(false);
    setRole('');
    setCurrentPage('home');
  };

  // Render home page
  if (currentPage === 'home') {
    return <HomePage onNavigateToAuth={handleGoToAuth} />;
  }

  // Render dashboards if signed in
  if (signedIn && role === 'Parent') {
    return <ParentDashboard onSignOut={handleSignOut} />;
  }
  if (signedIn && role === 'Teacher') {
    return <TeacherDashboard onSignOut={handleSignOut} />;
  }
  if (signedIn && role === 'Administrator') {
    return (
      <>
        <AdminDashboard onSignOut={handleSignOut} />
        <SecurityAudit />
      </>
    );
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
            <input type="email" placeholder="Enter your institutional email" required />
            
            <label>Password</label>
            <div className="auth-password">
              <input type="password" placeholder="Enter your password" required />
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
            
            <button type="submit" className="auth-btn">Sign In to GuardianLink →</button>
            
            <div className="auth-demo">
              <b>Demo Mode:</b>
              <br />
              Use any email/password with your selected role to try the portal.
            </div>
            
            <div className="auth-footer">
              <a href="#" style={{color: '#6366f1'}}>Forgot Password?</a>
              <span style={{margin: '0 8px'}}> | </span>
              <span style={{color: '#888'}}>Need help? Contact IT Support</span>
            </div>
          </form>
        ) : (
          <form className="auth-form" onSubmit={handleSignUp}>
            <label>Full Name</label>
            <input type="text" placeholder="Enter your full name" required />
            
            <label>Email Address</label>
            <input type="email" placeholder="Enter your institutional email" required />
            
            <label>Password</label>
            <div className="auth-password">
              <input type="password" placeholder="Create a password" required />
              <span className="auth-eye">👁️</span>
            </div>
            
            <label>Confirm Password</label>
            <div className="auth-password">
              <input type="password" placeholder="Confirm your password" required />
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
                I agree to the <a href="#terms" style={{color: '#6366f1'}}>Terms of Service</a> and <a href="#privacy" style={{color: '#6366f1'}}>Privacy Policy</a>
              </label>
            </div>
            
            <button type="submit" className="auth-btn">Create Account →</button>
            
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