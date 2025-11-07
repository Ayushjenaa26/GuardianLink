// Load environment variables FIRST
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');
const connectDB = require('./config/database');

// Create Express app
const app = express();

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('🔥 Uncaught Exception:', err);
    process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('🔥 Unhandled Rejection:', err);
    console.error('Stack:', err.stack);
});


// Debug environment variables
console.log('=== ENVIRONMENT VARIABLES ===');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT || 3004);
console.log('MONGODB_URI:', process.env.MONGODB_URI ? '✓ Loaded' : '✗ Missing');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? '✓ Loaded' : '✗ Missing');
console.log('=============================');

// Middleware
app.use(helmet());

// Configure CORS
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true
}));

// Basic middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const corsOptions = {
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3004'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    preflightContinue: false,
    optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

// Handle OPTIONS preflight requests
app.options('*', cors(corsOptions));
// Enhanced request logging
app.use(morgan(':method :url :status :response-time ms - :res[content-length] - :remote-addr'));

// Request body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log all requests
app.use((req, res, next) => {
    console.log(`🔍 ${new Date().toISOString()} - ${req.method} ${req.url}`);
    console.log('Headers:', req.headers);
    if (req.body && Object.keys(req.body).length > 0) {
        console.log('Body:', req.body);
    }
    next();
});

// Import routes
const authRoutes = require('./routes/authRoutes');
const teacherRoutes = require('./routes/TeacherSide/teacherRoutes');

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/teacher', teacherRoutes);

// Health check endpoint with detailed status
app.get('/api/health', async (req, res) => {
    try {
        const dbStatus = mongoose.connection.readyState;
        const memoryUsage = process.memoryUsage();
        
        res.json({ 
            status: 'ok',
            message: 'Server is running',
            uptime: process.uptime(),
            timestamp: new Date().toISOString(),
            database: {
                status: dbStatus === 1 ? 'connected' : 'disconnected',
                name: mongoose.connection.name || 'unknown'
            },
            memory: {
                heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024) + 'MB',
                heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024) + 'MB'
            }
        });
    } catch (error) {
        console.error('Health check error:', error);
        res.status(500).json({ 
            status: 'error',
            message: 'Internal server error during health check'
        });
    }
});

// Handle root API endpoint
app.get('/api', (req, res) => {
    res.json({
        message: 'GuardianLink API Server',
        version: '1.0.0',
        endpoints: ['/api/auth', '/api/teacher', '/api/health']
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    console.error('Stack:', err.stack);
    res.status(500).json({
        success: false,
        message: process.env.NODE_ENV === 'development' ? err.message : 'An internal server error occurred',
        error: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

// Initialize server
const initializeServer = async () => {
    try {
        const PORT = process.env.PORT || 3004;

        // Connect to database first
        console.log('📡 Initializing server...');
        
        // Status is handled by /api/health endpoint

        await connectDB();
        console.log('✅ Database connected successfully');
        
        // Check if port is available
        try {
            const net = require('net');
            const testServer = net.createServer();
            await new Promise((resolve, reject) => {
                testServer.once('error', (err) => {
                    if (err.code === 'EADDRINUSE') {
                        console.error(`Port ${PORT} is already in use. Please choose a different port.`);
                        process.exit(1);
                    }
                    reject(err);
                });
                
                testServer.once('listening', () => {
                    testServer.close();
                    resolve();
                });
                
                testServer.listen(PORT);
            });
        } catch (error) {
            console.error('Error checking port availability:', error);
            throw error;
        }

        // Start the actual server
        const server = app.listen(PORT, () => {
            console.log(`✅ Server running on port ${PORT}`);
            console.log(`🌐 Server URL: http://localhost:${PORT}`);
            console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
        });

        // Handle server shutdown
        const gracefulShutdown = async () => {
            console.log('🔄 Shutting down server gracefully...');
            await mongoose.connection.close();
            server.close(() => {
                console.log('👋 Server shut down successfully');
                process.exit(0);
            });
        };

        // Handle signals for development
        if (process.env.NODE_ENV === 'development') {
            process.on('SIGTERM', gracefulShutdown);
            process.on('SIGINT', gracefulShutdown);
        }

        // Create demo teacher account after server is up
        try {
            const { createDemoTeacher } = require('./controllers/authController');
            await createDemoTeacher();
        } catch (error) {
            console.warn('⚠️ Could not create demo teacher:', error.message);
        }

    } catch (err) {
        console.error('❌ Failed to initialize server:', err);
        process.exit(1);
    }
};

// Global error handlers
process.on('uncaughtException', (err) => {
    console.error('❌ Uncaught Exception:', err);
    process.exit(1);
});

process.on('unhandledRejection', (err) => {
    console.error('❌ Unhandled Rejection:', err);
    console.error('Stack trace:', err.stack);
});

// Start the server
initializeServer();
