const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const Admin = require('../models/Admin');

async function fixAdminPassword() {
  try {
    console.log('🔐 Starting admin password fix...');
    
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connected to MongoDB');

    // Find the admin user with rfv@gmail.com
    const admin = await Admin.findOne({ email: 'rfv@gmail.com' });
    
    if (!admin) {
      console.log('❌ Admin user not found');
      process.exit(1);
    }

    console.log('📝 Found admin:', admin.email);
    console.log('   Current password hash:', admin.password?.substring(0, 20) + '...');
    console.log('   Is valid bcrypt hash:', admin.password?.startsWith('$2'));

    // Re-hash the password
    const newPassword = '12345678Ab@';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    console.log('🔄 Updating password...');
    
    // Update directly in database to bypass pre-save hook
    await Admin.updateOne(
      { email: 'rfv@gmail.com' },
      { password: hashedPassword }
    );

    console.log('✅ Password updated!');
    console.log('   New password hash:', hashedPassword?.substring(0, 20) + '...');

    // Verify the password works
    const updatedAdmin = await Admin.findOne({ email: 'rfv@gmail.com' });
    const isMatch = await bcrypt.compare(newPassword, updatedAdmin.password);
    
    console.log('🔐 Password verification test:');
    console.log('   Test password:', newPassword);
    console.log('   Verification result:', isMatch ? '✅ PASS' : '❌ FAIL');

    console.log('\n✨ Admin password fix complete!');
    console.log('   Email: rfv@gmail.com');
    console.log('   Password: 12345678Ab@');
    console.log('   Role: Admin');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

fixAdminPassword();
