const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

const testAdminLogin = async () => {
  try {
    console.log('🧪 Testing admin login...\n');
    
    // Connect to MongoDB
    const mongoURI = process.env.MONGO_URI;
    const isAtlas = mongoURI.includes('mongodb+srv://') || mongoURI.includes('atlas');
    
    const options = {
      retryWrites: true,
      w: 'majority',
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000,
      maxPoolSize: 10,
      minPoolSize: 1,
    };

    await mongoose.connect(mongoURI, options);
    console.log(`✅ Connected to MongoDB ${isAtlas ? 'Atlas' : 'Local'} successfully`);

    // Find admin user
    const adminUser = await User.findOne({ email: 'admin@shoebay.com' });
    if (!adminUser) {
      console.log('❌ Admin user not found');
      console.log('💡 Run: node create-admin.js to create admin user');
      await mongoose.disconnect();
      return;
    }

    console.log('✅ Admin user found');
    console.log('📧 Email:', adminUser.email);
    console.log('👑 Role:', adminUser.role);
    console.log('🔐 Is Admin:', adminUser.isAdmin);

    // Test password
    const testPassword = 'admin123';
    const isMatch = await bcrypt.compare(testPassword, adminUser.password);
    
    if (isMatch) {
      console.log('✅ Password is correct');
      
      // Generate JWT token
      const token = jwt.sign({ 
        id: adminUser._id,
        isAdmin: adminUser.isAdmin,
        role: adminUser.role 
      }, process.env.JWT_SECRET || 'shoebay_super_secret', { expiresIn: '1h' });

      console.log('🔑 JWT Token generated successfully');
      console.log('🎫 Token preview:', token.substring(0, 50) + '...');
      
      // Test token verification
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'shoebay_super_secret');
      console.log('✅ Token verification successful');
      console.log('👤 Decoded user ID:', decoded.id);
      console.log('👑 Decoded admin status:', decoded.isAdmin);
      console.log('🎭 Decoded role:', decoded.role);

      console.log('\n🎉 Admin login test successful!');
      console.log('\n📋 Login Credentials:');
      console.log('📧 Email: admin@shoebay.com');
      console.log('🔑 Password: admin123');
      console.log('👑 Role: Admin');
      
    } else {
      console.log('❌ Password is incorrect');
      console.log('💡 The password in database doesn\'t match "admin123"');
      console.log('🔧 Run: node create-admin.js to reset the password');
    }

    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');

  } catch (error) {
    console.error('❌ Error testing admin login:', error.message);
    
    if (error.message.includes('whitelist') || error.message.includes('TLSV1_ALERT_INTERNAL_ERROR')) {
      console.log('\n🔧 To fix MongoDB connection:');
      console.log('1. Go to https://cloud.mongodb.com');
      console.log('2. Select your cluster');
      console.log('3. Click "Network Access" in left sidebar');
      console.log('4. Click "Add IP Address"');
      console.log('5. Click "Allow Access from Anywhere" (0.0.0.0/0)');
      console.log('6. Click "Confirm"');
    }
    
    process.exit(1);
  }
};

// Run if this file is executed directly
if (require.main === module) {
  testAdminLogin();
}

module.exports = { testAdminLogin }; 