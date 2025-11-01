// Load environment variables FIRST
require('dotenv').config();
const express = require('express');
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
app.use(express.json());

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

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV}`);
});