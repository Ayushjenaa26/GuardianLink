// AuthContext.js
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// Import configuration
import config from '../config';
const API_ENDPOINTS = {
  health: `${config.apiUrl}/api/health`,
  login: `${config.apiUrl}/api/auth/login`,
  register: `${config.apiUrl}/api/auth/register`,
  verify: `${config.apiUrl}/api/auth/verify`
};

// Initialize API state
const isServerAvailable = async () => {
  try {
    const response = await fetch(API_ENDPOINTS.health);
    return response.ok;
  } catch (error) {
    console.error('Server health check failed:', error);
    return false;
  }
};

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Define logout function first to avoid circular dependency
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setError(null);
  }, []);

  // Define checkAuth using useCallback
  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        
        // Optional: Verify token with backend
        try {
          const response = await fetch(API_ENDPOINTS.verify, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (!response.ok) {
            throw new Error('Token invalid');
          }
        } catch (verifyError) {
          console.error('Token verification failed:', verifyError);
          logout();
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        logout();
      }
    }
  }, [logout]);

  // Check authentication on app start
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (email, password, role) => {
    setLoading(true);
    setError(null);
    
    if (!email || !password || !role) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    try {
      // Check if server is available
      const serverAvailable = await isServerAvailable();
      if (!serverAvailable) {
        throw new Error('Server is not available. Please try again later.');
      }
      
      // Proceed with login
      const response = await fetch(API_ENDPOINTS.login, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ 
          email: email.trim(), 
          password, 
          role: role.toLowerCase() 
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const userData = await response.json();
      localStorage.setItem('token', userData.token);
      localStorage.setItem('user', JSON.stringify(userData.user));
      setUser(userData.user);

      console.log('Response status:', response.status);
      
      // Log full response for debugging
      console.log('Response headers:', Object.fromEntries([...response.headers.entries()]));
      console.log('Response status:', response.status);
      
      let data;
      try {
        // First try to parse as JSON
        data = await response.json();
        console.log('Response data:', data);
      } catch (error) {
        console.error('Failed to parse response as JSON:', error);
        // If JSON parsing fails, get text content for debugging
        const text = await response.text();
        console.error('Raw response text:', text);
        throw new Error('Server returned an invalid response format');
      }

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('The authentication service is not available. Please try again later.');
        }
        if (response.status === 401) {
          throw new Error('Invalid email or password. Please try again.');
        }
        if (response.status === 403) {
          throw new Error('Access denied. Please check your role and try again.');
        }
        if (response.status >= 500) {
          throw new Error('Server error. Please try again later.');
        }
        throw new Error(data.message || data.error || 'Authentication failed. Please try again.');
      }

      if (!data.token || !data.user) {
        throw new Error('Server response is missing required data. Please try again.');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      return data;
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password, role) => {
    setLoading(true);
    setError(null);
    try {
      console.log('Attempting registration to:', API_ENDPOINTS.register);
      
      // Basic validation
      if (!name || !email || !password || !role) {
        throw new Error('All fields are required');
      }

      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }

      // Prepare registration data with role-specific fields
      const registrationData = {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password,
        role: role.toLowerCase()
      };

      // Add default fields for teacher registration
      if (role.toLowerCase() === 'teacher') {
        registrationData.subject = 'General';  // Default subject
        registrationData.classes = ['All'];    // Default classes
        registrationData.phone = '0000000000'; // Default phone
      }

      const response = await fetch(API_ENDPOINTS.register, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData),
      });

      console.log('Response status:', response.status);
      
      const responseText = await response.text();
      console.log('Raw response:', responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        throw new Error(`Server returned invalid JSON: ${responseText.substring(0, 100)}`);
      }

      if (!response.ok) {
        // Handle different error types
        if (data.errors) {
          // Mongoose validation errors
          const errorMessages = data.errors.map(error => error.msg).join(', ');
          throw new Error(errorMessages);
        }
        throw new Error(data.message || data.error || `Registration failed with status ${response.status}`);
      }

      if (!data.token || !data.user) {
        throw new Error('Invalid response: missing token or user data');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      return data;
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Note: logout is now defined above using useCallback

  // Note: checkAuth is now defined above using useCallback

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        error, 
        login, 
        register, 
        logout,
        checkAuth,
        clearError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};