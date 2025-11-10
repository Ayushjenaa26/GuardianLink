// Load environment variables FIRST
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');
const net = require('net');
const connectDB = require('./config/database');

// Create Express app
const app = express();

// Handle uncaught exceptions and rejections
process.on('uncaughtException', (err) => {
    console.error('🔥 Uncaught Exception:', err);
    process.exit(1);
});

process.on('unhandledRejection', (err) => {
    console.error('🔥 Unhandled Rejection:', err);
    console.error('Stack:', err.stack);
    process.exit(1);
});

// Debug environment variables
console.log('=== ENVIRONMENT VARIABLES ===');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT || 3004);
console.log('MONGODB_URI:', process.env.MONGODB_URI ? '✓ Loaded' : '✗ Missing');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? '✓ Loaded' : '✗ Missing');
console.log('=============================');

// Basic middleware setup
app.use(helmet());
const corsOptions = {
    origin: [
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:3002',
        'http://localhost:3004'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    preflightContinue: false,
    optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(morgan(':method :url :status :response-time ms - :res[content-length] - :remote-addr'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`🔍 ${new Date().toISOString()} - ${req.method} ${req.url}`);
    if (req.body && Object.keys(req.body).length > 0) {
        console.log('Body:', req.body);
    }
    next();
});

// Import and mount routes
const authRoutes = require('./routes/authRoutes');
const teacherRoutes = require('./routes/TeacherSide/teacherRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/teacher', teacherRoutes);

// Root API endpoint
app.get('/api', (req, res) => {
    res.json({
        message: 'GuardianLink API Server',
        version: '1.0.0',
        endpoints: ['/api/auth', '/api/teacher', '/api/health']
    });
});

// Health check endpoint
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

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(err.status || 500).json({
        success: false,
        message: process.env.NODE_ENV === 'development' ? err.message : 'An internal server error occurred',
        error: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

// Initialize server
const PORT = process.env.PORT || 3004;

const startServer = async () => {
    try {
        // Connect to MongoDB first
        console.log('📡 Initializing server...');
        await connectDB({
            maxRetries: 5,
            retryDelay: 5000
        });
        console.log('✅ Database connected successfully');
        
        // Check if port is available
        await new Promise((resolve, reject) => {
            const testServer = net.createServer()
                .once('error', err => {
                    if (err.code === 'EADDRINUSE') {
                        console.error(`Port ${PORT} is already in use. Please choose a different port.`);
                        process.exit(1);
                    }
                    reject(err);
                })
                .once('listening', () => {
                    testServer.close();
                    resolve();
                })
                .listen(PORT);
        });

        // Start the server
        app.listen(PORT, () => {
            console.log(`
🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}
📱 API available at http://localhost:${PORT}
            `);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

// Start the server
startServer().catch(err => {
    console.error('Failed to start server:', err);
    process.exit(1);
});