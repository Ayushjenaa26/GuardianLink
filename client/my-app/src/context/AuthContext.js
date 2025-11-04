// AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

// Import configuration
import config from '../config';
const API_URL = config.apiUrl;

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check authentication on app start
  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email, password, role) => {
    setLoading(true);
    setError(null);
    try {
      console.log('Attempting login to:', `${API_URL}/auth/login`);
      
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email, 
          password, 
          role: role.toLowerCase() 
        }),
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
        throw new Error(data.message || data.error || `Login failed with status ${response.status}`);
      }

      if (!data.token || !data.user) {
        throw new Error('Invalid response: missing token or user data');
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
      console.log('Attempting registration to:', `${API_URL}/auth/register`);
      
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

      const response = await fetch(`${API_URL}/auth/register`, {
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

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setError(null);
  };

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        
        // Optional: Verify token with backend
        try {
          const response = await fetch(`${API_URL}/auth/verify`, {
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
  };

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