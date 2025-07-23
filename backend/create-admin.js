const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

const createAdmin = async () => {
  try {
    console.log('🔧 Creating admin user...\n');
    
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

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@shoebay.com' });
    if (existingAdmin) {
      console.log('⚠️ Admin user already exists');
      console.log('📧 Email: admin@shoebay.com');
      console.log('🔑 Password: admin123');
      console.log('👑 Role: Admin');
      
      // Test the password
      const isMatch = await bcrypt.compare('admin123', existingAdmin.password);
      if (isMatch) {
        console.log('✅ Password is correct');
      } else {
        console.log('❌ Password is incorrect, updating...');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);
        existingAdmin.password = hashedPassword;
        await existingAdmin.save();
        console.log('✅ Password updated successfully');
      }
      
      await mongoose.disconnect();
      return;
    }

    // Create admin user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    const adminUser = new User({
      username: 'admin',
      email: 'admin@shoebay.com',
      password: hashedPassword,
      role: 'admin',
      isAdmin: true
    });

    await adminUser.save();

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email: admin@shoebay.com');
    console.log('🔑 Password: admin123');
    console.log('👑 Role: Admin');
    console.log('\n🎉 You can now login with these credentials');

    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');

  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    
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
  createAdmin();
}

module.exports = { createAdmin }; 