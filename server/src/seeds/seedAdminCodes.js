/**
 * Seed Admin Unique Codes
 * Run this script to generate unique admin codes in the database
 * 
 * Usage: node src/seeds/seedAdminCodes.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const AdminCode = require('../models/AdminCode');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/guardianlink';

// Number of codes to generate
const NUMBER_OF_CODES = 10;

const seedAdminCodes = async () => {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Check existing codes
        const existingCount = await AdminCode.countDocuments({ isUsed: false });
        console.log(`📊 Existing unused admin codes: ${existingCount}`);

        // Generate new codes
        const codes = [];
        for (let i = 0; i < NUMBER_OF_CODES; i++) {
            const code = AdminCode.generateCode();
            codes.push({
                code: code,
                isUsed: false,
                description: `Auto-generated admin code #${i + 1}`
            });
        }

        // Insert codes
        const result = await AdminCode.insertMany(codes);
        
        console.log('\n✅ Successfully generated admin codes:\n');
        console.log('═'.repeat(50));
        result.forEach((code, index) => {
            console.log(`  ${index + 1}. ${code.code}`);
        });
        console.log('═'.repeat(50));
        
        console.log(`\n📝 Total codes generated: ${result.length}`);
        console.log('💡 Share these codes with admins who need to register.');
        console.log('⚠️  Each code can only be used once!\n');

        // Show all available codes
        const allAvailable = await AdminCode.find({ isUsed: false }).select('code createdAt');
        console.log(`📋 All available (unused) codes in database: ${allAvailable.length}`);

    } catch (error) {
        console.error('❌ Error seeding admin codes:', error);
    } finally {
        await mongoose.connection.close();
        console.log('🔌 Database connection closed');
        process.exit(0);
    }
};

// Run the seed function
seedAdminCodes();
