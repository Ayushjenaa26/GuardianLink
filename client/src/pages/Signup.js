import React, { useState } from 'react';
import './Signup.css';

const SignUp = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'parent',
    institutionCode: '',
    phoneNumber: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    if (!formData.institutionCode) {
      setError('Institution code is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Account created successfully! Please check your email for verification.');
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          confirmPassword: '',
          role: 'parent',
          institutionCode: '',
          phoneNumber: ''
        });
        
        // Redirect to sign in after 3 seconds
        setTimeout(() => {
          window.location.href = '/signin';
        }, 3000);
      } else {
        setError(data.message || 'Sign up failed');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return React.createElement('div', { className: 'signup-container' },
    React.createElement('div', { className: 'signup-card' },
      React.createElement('div', { className: 'signup-left' },
        React.createElement('div', { className: 'brand' },
          React.createElement('div', { className: 'brand-icon' }, 'GL'),
          React.createElement('h2', null, 'GuardianLink')
        ),
        React.createElement('p', { className: 'tagline' }, 'Secure institutional access portal'),
        React.createElement('p', { className: 'subtitle' }, 'Join the academic community'),
        
        React.createElement('div', { className: 'features' },
          React.createElement('div', { className: 'feature-item' },
            React.createElement('span', { className: 'checkmark' }, '✓'),
            React.createElement('span', null, 'Real-time academic monitoring')
          ),
          React.createElement('div', { className: 'feature-item' },
            React.createElement('span', { className: 'checkmark' }, '✓'),
            React.createElement('span', null, 'Seamless communication platform')
          ),
          React.createElement('div', { className: 'feature-item' },
            React.createElement('span', { className: 'checkmark' }, '✓'),
            React.createElement('span', null, 'Comprehensive progress tracking')
          ),
          React.createElement('div', { className: 'feature-item' },
            React.createElement('span', { className: 'checkmark' }, '✓'),
            React.createElement('span', null, 'Secure institutional integration')
          )
        ),
        
        React.createElement('div', { className: 'powered-by' },
          React.createElement('span', null, 'Powered by failTrackers')
        )
      ),
      
      React.createElement('div', { className: 'signup-right' },
        React.createElement('h3', null, 'Create your account'),
        
        React.createElement('form', { onSubmit: handleSubmit },
          React.createElement('div', { className: 'name-row' },
            React.createElement('div', { className: 'form-group half' },
              React.createElement('label', { htmlFor: 'firstName' }, 'First Name'),
              React.createElement('input', {
                type: 'text',
                id: 'firstName',
                name: 'firstName',
                placeholder: 'Enter your first name',
                value: formData.firstName,
                onChange: handleChange,
                required: true
              })
            ),
            React.createElement('div', { className: 'form-group half' },
              React.createElement('label', { htmlFor: 'lastName' }, 'Last Name'),
              React.createElement('input', {
                type: 'text',
                id: 'lastName',
                name: 'lastName',
                placeholder: 'Enter your last name',
                value: formData.lastName,
                onChange: handleChange,
                required: true
              })
            )
          ),
          
          React.createElement('div', { className: 'form-group' },
            React.createElement('label', { htmlFor: 'email' }, 'Email Address'),
            React.createElement('input', {
              type: 'email',
              id: 'email',
              name: 'email',
              placeholder: 'Enter your institutional email',
              value: formData.email,
              onChange: handleChange,
              required: true
            })
          ),
          
          React.createElement('div', { className: 'form-group' },
            React.createElement('label', { htmlFor: 'phoneNumber' }, 'Phone Number'),
            React.createElement('input', {
              type: 'tel',
              id: 'phoneNumber',
              name: 'phoneNumber',
              placeholder: 'Enter your phone number',
              value: formData.phoneNumber,
              onChange: handleChange,
              required: true
            })
          ),
          
          React.createElement('div', { className: 'form-group' },
            React.createElement('label', { htmlFor: 'institutionCode' }, 'Institution Code'),
            React.createElement('input', {
              type: 'text',
              id: 'institutionCode',
              name: 'institutionCode',
              placeholder: 'Enter your institution code',
              value: formData.institutionCode,
              onChange: handleChange,
              required: true
            })
          ),
          
          React.createElement('div', { className: 'password-row' },
            React.createElement('div', { className: 'form-group half' },
              React.createElement('label', { htmlFor: 'password' }, 'Password'),
              React.createElement('input', {
                type: 'password',
                id: 'password',
                name: 'password',
                placeholder: 'Create password',
                value: formData.password,
                onChange: handleChange,
                required: true
              })
            ),
            React.createElement('div', { className: 'form-group half' },
              React.createElement('label', { htmlFor: 'confirmPassword' }, 'Confirm Password'),
              React.createElement('input', {
                type: 'password',
                id: 'confirmPassword',
                name: 'confirmPassword',
                placeholder: 'Confirm password',
                value: formData.confirmPassword,
                onChange: handleChange,
                required: true
              })
            )
          ),
          
          React.createElement('div', { className: 'form-group' },
            React.createElement('label', null, 'Select Your Role'),
            React.createElement('div', { className: 'role-selector' },
              React.createElement('div', {
                className: `role-option ${formData.role === 'parent' ? 'selected' : ''}`,
                onClick: () => handleRoleSelect('parent')
              },
                React.createElement('div', { className: 'role-icon' }, '👨‍👩‍👧‍👦'),
                React.createElement('div', { className: 'role-title' }, 'Parent'),
                React.createElement('div', { className: 'role-description' }, 'Monitor your child\'s academic progress')
              ),
              
              React.createElement('div', {
                className: `role-option ${formData.role === 'teacher' ? 'selected' : ''}`,
                onClick: () => handleRoleSelect('teacher')
              },
                React.createElement('div', { className: 'role-icon' }, '🎓'),
                React.createElement('div', { className: 'role-title' }, 'Teacher'),
                React.createElement('div', { className: 'role-description' }, 'Manage classes and student records')
              ),
              
              React.createElement('div', {
                className: `role-option ${formData.role === 'administrator' ? 'selected' : ''}`,
                onClick: () => handleRoleSelect('administrator')
              },
                React.createElement('div', { className: 'role-icon' }, '⚙️'),
                React.createElement('div', { className: 'role-title' }, 'Administrator'),
                React.createElement('div', { className: 'role-description' }, 'System management and oversight')
              )
            )
          ),
          
          error && React.createElement('div', { className: 'error-message' }, error),
          success && React.createElement('div', { className: 'success-message' }, success),
          
          React.createElement('button', {
            type: 'submit',
            className: 'signup-button',
            disabled: loading
          }, loading ? 'Creating Account...' : 'Create Account')
        ),
        
        React.createElement('div', { className: 'signin-link' },
          React.createElement('span', null, 'Already have an account? '),
          React.createElement('a', { href: '/signin' }, 'Sign In')
        ),
        
        React.createElement('div', { className: 'footer' },
          React.createElement('span', null, '© 2023 GuardianLink. All rights reserved.')
        )
      )
    )
  );
};

export default SignUp;