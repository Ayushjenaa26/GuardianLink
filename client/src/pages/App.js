import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
// Import other components as needed
// import Dashboard from './pages/Dashboard';
// import ParentDashboard from './pages/ParentDashboard';
// import TeacherDashboard from './pages/TeacherDashboard';
// import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          
          {/* Default redirect to signin */}
          <Route path="/" element={<Navigate to="/signin" replace />} />
          
          {/* Protected Routes - You can add these later */}
          {/* 
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/parent-dashboard" element={<ParentDashboard />} />
          <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          */}
          
          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/signin" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;