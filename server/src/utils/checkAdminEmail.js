const mongoose = require('mongoose');
require('dotenv').config();

const Admin = require('../models/Admin');

async function checkAdminEmail() {
  try {
    console.log('🔍 Checking admin email...\n');
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const email = 'gsfcu@gmail.com';
    
    // Find the admin user
    const admin = await Admin.findOne({ email: email });
    
    if (!admin) {
      console.log(`❌ Admin with email "${email}" NOT FOUND in database\n`);
      
      // List all admin emails
      const allAdmins = await Admin.find({}, 'email name adminId');
      console.log('📋 All Admin accounts in database:');
      if (allAdmins.length === 0) {
        console.log('   (No admin accounts found)');
      } else {
        allAdmins.forEach(admin => {
          console.log(`   - ${admin.email} (Name: ${admin.name}, ID: ${admin.adminId})`);
        });
      }
      
      console.log('\n💡 Suggestion: Create an account with this email first by signing up.');
    } else {
      console.log(`✅ Admin found!`);
      console.log(`   Email: ${admin.email}`);
      console.log(`   Name: ${admin.name}`);
      console.log(`   Admin ID: ${admin.adminId}`);
      console.log(`   Password hash exists: ${!!admin.password}`);
      console.log(`   Password hash valid: ${/^\$2[aby]\$/.test(admin.password)}`);
    }

    console.log('\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkAdminEmail();
