import React, { useState } from 'react';
import './HomePage.css';

const HomePage = ({ onNavigateToAuth }) => {
  const [activeSection, setActiveSection] = useState('hero');

  return (
    <div className="homepage">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo">
            <div className="logo-icon">🔗</div>
            <span className="logo-text">GuardianLink</span>
          </div>
          <div className="nav-links">
            <a href="#features" onClick={() => setActiveSection('features')}>Features</a>
            <a href="#how-it-works" onClick={() => setActiveSection('how-it-works')}>How It Works</a>
            <a href="#testimonials" onClick={() => setActiveSection('testimonials')}>Testimonials</a>
            <a href="#contact" onClick={() => setActiveSection('contact')}>Contact</a>
          </div>
          <div className="nav-auth">
            <button className="btn-signin" onClick={onNavigateToAuth}>Sign In</button>
            <button className="btn-signup" onClick={onNavigateToAuth}>Sign Up</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background">
          <div className="floating-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
            <div className="shape shape-4"></div>
          </div>
        </div>
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Direct Institution-to-Parent
              <span className="gradient-text"> Communication</span>
            </h1>
            <p className="hero-description">
              This portal enables college authorities to directly update parents about their
              ward's attendance (teacher-verified), academic marks/KTs, fee status, and 
              behavioral observations—all without relying on student-reported data.
            </p>
            <div className="hero-stats">
              <div className="stat">
                <div className="stat-number">100%</div>
                <div className="stat-label">Verified Data</div>
              </div>
              <div className="stat">
                <div className="stat-number">24/7</div>
                <div className="stat-label">Real-time Updates</div>
              </div>
              <div className="stat">
                <div className="stat-number">0</div>
                <div className="stat-label">Student Intermediaries</div>
              </div>
            </div>
            <div className="hero-actions">
              <button className="btn-primary" onClick={onNavigateToAuth}>Get Started</button>
              <button className="btn-secondary">Watch Demo</button>
            </div>
          </div>
          <div className="hero-visual">
            <div className="platform-preview">
              <div className="preview-card teacher">
                <div className="card-header">
                  <span className="card-icon">👨‍🏫</span>
                  <span>Teacher Portal</span>
                </div>
                <div className="card-content">
                  <div className="feature-item">✓ Mark Attendance</div>
                  <div className="feature-item">✓ Submit Marks/KTs</div>
                  <div className="feature-item">✓ Report Behavior</div>
                </div>
              </div>
              <div className="preview-card parent">
                <div className="card-header">
                  <span className="card-icon">👨‍👩‍👧‍👦</span>
                  <span>Parent Portal</span>
                </div>
                <div className="card-content">
                  <div className="feature-item">✓ View Attendance</div>
                  <div className="feature-item">✓ Check Academics</div>
                  <div className="feature-item">✓ Monitor Fees</div>
                </div>
              </div>
              <div className="preview-card admin">
                <div className="card-header">
                  <span className="card-icon">⚙️</span>
                  <span>Admin Module</span>
                </div>
                <div className="card-content">
                  <div className="feature-item">✓ Manage Fees</div>
                  <div className="feature-item">✓ Data Oversight</div>
                  <div className="feature-item">✓ Approvals</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Differentiator */}
      <section className="differentiator-section">
        <div className="container">
          <div className="section-header">
            <h2>Key Differentiator</h2>
            <p>What sets GuardianLink apart from traditional systems</p>
          </div>
          <div className="differentiator-card">
            <div className="diff-icon">🚫</div>
            <h3>Eliminates Student Intermediaries</h3>
            <p>
              Provides 100% institution-verified information directly to parents, 
              eliminating the gap between student-reported data and actual performance.
            </p>
            <div className="diff-features">
              <div className="diff-feature">
                <span className="check">✓</span>
                <span>Direct teacher-to-parent communication</span>
              </div>
              <div className="diff-feature">
                <span className="check">✓</span>
                <span>Real-time verified updates</span>
              </div>
              <div className="diff-feature">
                <span className="check">✓</span>
                <span>No information filtering</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="container">
          <div className="section-header">
            <h2>Complete Platform Features</h2>
            <p>Everything you need for transparent educational communication</p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">👨‍🏫</div>
              <h3>Teacher Portal</h3>
              <ul>
                <li>Mark attendance with verification</li>
                <li>Submit marks and KT status</li>
                <li>Report behavioral observations</li>
                <li>Class performance analytics</li>
              </ul>
              <button className="feature-cta" onClick={onNavigateToAuth}>Access Portal</button>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚙️</div>
              <h3>Admin Module</h3>
              <ul>
                <li>Manage fee structures and payments</li>
                <li>Approval workflows</li>
                <li>Complete data oversight</li>
                <li>Institution management</li>
              </ul>
              <button className="feature-cta" onClick={onNavigateToAuth}>Access Portal</button>
            </div>
            <div className="feature-card">
              <div className="feature-icon">👨‍👩‍👧‍👦</div>
              <h3>Parent Portal/Website</h3>
              <ul>
                <li>Real-time attendance tracking</li>
                <li>Academic performance monitoring</li>
                <li>Fee status and payment history</li>
                <li>Behavior reports and feedback</li>
              </ul>
              <button className="feature-cta" onClick={onNavigateToAuth}>Access Portal</button>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔔</div>
              <h3>Notification System</h3>
              <ul>
                <li>Real-time portal alerts</li>
                <li>Instant update notifications</li>
                <li>Customizable alert preferences</li>
                <li>Multi-channel communication</li>
              </ul>
              <button className="feature-cta" onClick={onNavigateToAuth}>Learn More</button>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Reporting</h3>
              <ul>
                <li>Auto-generated academic summaries</li>
                <li>Fee status reports</li>
                <li>Attendance analytics</li>
                <li>Performance trends</li>
              </ul>
              <button className="feature-cta" onClick={onNavigateToAuth}>View Demo</button>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Security</h3>
              <ul>
                <li>Role-based access control</li>
                <li>Comprehensive audit logs</li>
                <li>Data encryption</li>
                <li>Secure authentication</li>
              </ul>
              <button className="feature-cta" onClick={onNavigateToAuth}>Learn More</button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="how-it-works">
        <div className="container">
          <div className="section-header">
            <h2>How GuardianLink Works</h2>
            <p>Simple, secure, and transparent communication flow</p>
          </div>
          <div className="workflow">
            <div className="workflow-step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Teacher Updates</h3>
                <p>Teachers mark attendance, submit marks, and report behavior directly through their portal</p>
              </div>
            </div>
            <div className="workflow-step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Admin Verification</h3>
                <p>Administrators oversee and verify all data before it's shared with parents</p>
              </div>
            </div>
            <div className="workflow-step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Real-time Notification</h3>
                <p>Parents receive instant notifications about updates through the portal</p>
              </div>
            </div>
            <div className="workflow-step">
              <div className="step-number">4</div>
              <div className="step-content">
                <h3>Parent Access</h3>
                <p>Parents view verified information about attendance, academics, fees, and behavior</p>
              </div>
            </div>
          </div>
          <div className="workflow-cta">
            <button className="btn-primary large" onClick={onNavigateToAuth}>Start Using GuardianLink</button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Transform Parent-Teacher Communication?</h2>
            <p>Join institutions that trust GuardianLink for transparent, verified educational updates</p>
            <div className="cta-actions">
              <button className="btn-primary large" onClick={onNavigateToAuth}>Start Free Trial</button>
              <button className="btn-secondary large">Schedule Demo</button>
            </div>
            <div className="cta-note">
              <span>Already have an account? </span>
              <button className="text-link" onClick={onNavigateToAuth}>Sign in here</button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <div className="footer-logo">
                <div className="logo-icon">🔗</div>
                <span className="logo-text">GuardianLink</span>
              </div>
              <p>Direct institution-to-parent communication platform for transparent educational updates.</p>
              <div className="footer-auth">
                <button className="btn-signin" onClick={onNavigateToAuth}>Sign In</button>
                <button className="btn-signup" onClick={onNavigateToAuth}>Sign Up</button>
              </div>
            </div>
            <div className="footer-section">
              <h4>Platform</h4>
              <a href="#features">Features</a>
              <a href="#how-it-works">How It Works</a>
              <a href="#pricing">Pricing</a>
              <a href="#security">Security</a>
            </div>
            <div className="footer-section">
              <h4>Support</h4>
              <a href="#help">Help Center</a>
              <a href="#contact">Contact Us</a>
              <a href="#docs">Documentation</a>
              <a href="#status">System Status</a>
            </div>
            <div className="footer-section">
              <h4>Legal</h4>
              <a href="#privacy">Privacy Policy</a>
              <a href="#terms">Terms of Service</a>
              <a href="#cookies">Cookie Policy</a>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 GuardianLink. All rights reserved. Powered by EduTrackers</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;