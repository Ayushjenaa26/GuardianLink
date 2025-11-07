import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './components/AuthPage';
import { AuthProvider } from './context/AuthContext';
import TeacherDashboard from './TeacherSide/TeacherDashboard';
import ParentDashboard from './ParentSide/ParentDashboard';
import AdminDashboard from './AdminSide/AdminDashboard';
import StudentDataInput from './TeacherSide/StudentDataInput';
import HomePage from './HomePage'; // Import HomePage
import './App.css';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} /> {/* HomePage as root */}
          <Route path="/auth" element={<AuthPage />} />
          
          {/* Protected Routes */}
          <Route
            path="/teacher/*"
            element={
              <PrivateRoute role="teacher">
                <TeacherDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/teacher/add-student"
            element={
              <PrivateRoute role="teacher">
                <StudentDataInput />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/*"
            element={
              <PrivateRoute role="admin">
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/parent/*"
            element={
              <PrivateRoute role="parent">
                <ParentDashboard />
              </PrivateRoute>
            }
          />
          
          {/* Redirect any unknown routes to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

// Private Route Component
const PrivateRoute = ({ children, role }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  if (!token || !user) {
    return <Navigate to="/auth" replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

export default App;