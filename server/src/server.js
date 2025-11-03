// Load environment variables FIRST
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');
const connectDB = require('./config/database');

const app = express();

// Debug environment variables
console.log('=== ENVIRONMENT VARIABLES ===');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT);
console.log('MONGODB_URI:', process.env.MONGODB_URI ? '✓ Loaded' : '✗ Missing');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? '✓ Loaded' : '✗ Missing');
console.log('=============================');

// Connect to Database
connectDB();

// Middleware
app.use(helmet());
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
const authRoutes = require('./routes/authRoutes');
const teacherRoutes = require('./routes/TeacherSide/teacherRoutes');

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/teacher', teacherRoutes);

// Basic route
app.get('/', (req, res) => {
    res.json({ 
        message: 'Student Management System API is running!',
        database: 'MongoDB Atlas',
        status: 'Connected'
    });
});

// Health check route
app.get('/health', (req, res) => {
    const dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';
    res.json({
        server: 'Running',
        database: dbStatus,
        timestamp: new Date().toISOString()
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        message: 'Route not found',
        status: 404
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    
    // Ensure we're sending a JSON response even in error cases
    res.setHeader('Content-Type', 'application/json');
    
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.stack : 'Internal Server Error'
    });
});

const PORT = process.env.PORT || 3001;

// Error handling for server start
const startServer = async () => {
    try {
        await mongoose.connection.asPromise(); // Wait for DB connection
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`📍 Environment: ${process.env.NODE_ENV}`);
            console.log(`🌐 API Base URL: http://localhost:${PORT}/api`);
        }).on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                console.error(`⚠️ Port ${PORT} is already in use. Please try another port.`);
                process.exit(1);
            } else {
                console.error('Server error:', err);
            }
        });
    } catch (err) {
        console.error('Failed to start server:', err);
        process.exit(1);
    }
};

startServer();