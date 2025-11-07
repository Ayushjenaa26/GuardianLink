const mongoose = require('mongoose');

/**
 * connectDB
 * Establishes connection to MongoDB with retry logic and proper error handling.
 * @param {Object} opts - Options for connection
 * @returns {Promise} Mongoose connection instance
 */
const connectDB = async (opts = {}) => {
    try {
        // Clear any existing connections first
        await mongoose.disconnect();
    } catch (err) {
        console.warn('No existing connection to clear');
    }

    const uri = process.env.MONGODB_URI || 'mongodb+srv://student_management_system:123sp95@mernproject.2jdp5hj.mongodb.net/guardianlink?retryWrites=true&w=majority';
    const maxRetries = opts.maxRetries || 5;
    const retryDelay = opts.retryDelay || 5000;
    let retries = 0;

    const attempt = async () => {
        try {
            console.log('🔗 Attempting to connect to MongoDB...');
            console.log('📁 Using DB URL:', process.env.MONGODB_URI ? '<MONGODB_URI loaded>' : uri);
            console.log('🔍 Testing MongoDB connection...');

            // Configure Mongoose
            mongoose.set('strictQuery', true);
            
            const conn = await mongoose.connect(uri, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                serverSelectionTimeoutMS: 5000,
                connectTimeoutMS: 10000,
                socketTimeoutMS: 45000
            });

            console.log('✅ MongoDB Connected Successfully!');
            console.log(`🏠 Host: ${conn.connection.host}`);
            console.log(`📊 Database: ${conn.connection.name}`);

            // Handle connection errors after initial connection
            mongoose.connection.on('error', (err) => {
                console.error('MongoDB connection error:', err);
            });

            mongoose.connection.on('disconnected', () => {
                console.log('MongoDB disconnected');
            });

            return conn;
        } catch (error) {
            console.error('❌ MongoDB Connection Failed:', error.message);
            
            if (retries < maxRetries) {
                retries++;
                console.log(`Retrying connection in ${retryDelay}ms... (Attempt ${retries}/${maxRetries})`);
                await new Promise(resolve => setTimeout(resolve, retryDelay));
                return attempt();
            }
            
            throw new Error(`Failed to connect to MongoDB after ${maxRetries} attempts`);

            if (error && error.name === 'MongoNetworkError') {
                console.error('🌐 Network Error: Check internet and MongoDB accessibility');
            } else if (error && error.name === 'MongoServerError') {
                console.error('🔐 Auth Error: Check DB credentials');
            } else if (error && error.name === 'MongooseServerSelectionError') {
                console.error('🔍 Server Selection Error: Check connection string / DNS');
            }

            console.warn(`Retrying MongoDB connection in ${retryDelay / 1000}s...`);
            setTimeout(() => attempt(), retryDelay);
            return null;
        }
    };

    // Attach connection event listeners
    mongoose.connection.on('connected', () => console.log('🟢 Mongoose event: connected'));
    mongoose.connection.on('reconnected', () => console.log('🔁 Mongoose event: reconnected'));
    mongoose.connection.on('disconnected', () => console.warn('🟡 Mongoose event: disconnected'));
    mongoose.connection.on('error', (err) => console.error('🔴 Mongoose event: error', err && err.message ? err.message : err));

    // Start first attempt (don't await here; caller may or may not await)
    return attempt();
};

module.exports = connectDB;