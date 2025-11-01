const mongoose = require('mongoose');

/**
 * connectDB
 * Tries to connect to MongoDB. If it fails, it will log the error and retry after a delay.
 * The function does not exit the process on failure so the HTTP server can still run.
 */
const connectDB = async (opts = {}) => {
    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/student_management';
    const retryDelay = opts.retryDelay || 5000;

    const attempt = async () => {
        try {
            console.log('🔗 Attempting to connect to MongoDB...');
            console.log('📁 Using DB URL:', process.env.MONGODB_URI ? '<MONGODB_URI loaded>' : uri);

            const conn = await mongoose.connect(uri, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });

            console.log('✅ MongoDB Connected Successfully!');
            console.log(`🏠 Host: ${conn.connection.host}`);
            console.log(`📊 Database: ${conn.connection.name}`);

            return conn;
        } catch (error) {
            console.error('❌ MongoDB Connection Failed:', error && error.message ? error.message : error);

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