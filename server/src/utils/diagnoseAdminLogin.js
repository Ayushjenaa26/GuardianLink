const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const Admin = require('../models/Admin');

async function diagnoseAdminLogin() {
  try {
    console.log('🔍 Starting admin login diagnosis...\n');
    
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Find the admin user
    const admin = await Admin.findOne({ email: 'rfv@gmail.com' });
    
    if (!admin) {
      console.log('❌ Admin user not found in database');
      process.exit(1);
    }

    console.log('📝 Admin Account Found:');
    console.log('   Email:', admin.email);
    console.log('   Name:', admin.name);
    console.log('   Admin ID:', admin.adminId);
    console.log('   Password hash exists:', !!admin.password);
    console.log('   Password hash length:', admin.password?.length);
    console.log('   Password hash starts with:', admin.password?.substring(0, 7));
    console.log('   Is valid bcrypt format ($2a$ or $2b$):', /^\$2[aby]\$/.test(admin.password));

    // Test password verification
    const testPasswords = [
      '12345678Ab@',
      '123456',
      'Qwerty123!',
      'Test1234@'
    ];

    console.log('\n🔐 Testing password verification:\n');

    for (const testPass of testPasswords) {
      try {
        const match = await bcrypt.compare(testPass, admin.password);
        const status = match ? '✅ MATCH' : '❌ NO MATCH';
        console.log(`   "${testPass}": ${status}`);
      } catch (err) {
        console.log(`   "${testPass}": ⚠️ ERROR - ${err.message}`);
      }
    }

    console.log('\n💡 Recommendations:');
    
    // Check if password is properly hashed
    if (!admin.password) {
      console.log('   ⚠️ Password field is empty! Need to set a password.');
    } else if (!/^\$2[aby]\$/.test(admin.password)) {
      console.log('   ⚠️ Password is NOT properly hashed with bcrypt.');
      console.log('   Fix: Reset the password using the fix script.');
    } else {
      console.log('   ✅ Password appears to be properly hashed.');
      console.log('   Try: Use password "12345678Ab@" to sign in.');
    }

    console.log('\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

diagnoseAdminLogin();
