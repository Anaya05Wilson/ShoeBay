const mongoose = require('mongoose');
require('dotenv').config();

console.log('🔍 Checking MongoDB Atlas connection...\n');

// Check if MONGO_URI exists
if (!process.env.MONGO_URI) {
  console.log('❌ MONGO_URI not found in .env file');
  console.log('💡 Add this to your .env file:');
  console.log('MONGO_URI=your_mongodb_atlas_connection_string');
  process.exit(1);
}

console.log('✅ MONGO_URI found in .env file');
console.log('🔗 Connection string:', process.env.MONGO_URI.substring(0, 50) + '...');

// Test connection
const testConnection = async () => {
  try {
    console.log('\n🔄 Testing connection...');
    
    const options = {
      retryWrites: true,
      w: 'majority',
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000,
      maxPoolSize: 10,
      minPoolSize: 1,
    };

    await mongoose.connect(process.env.MONGO_URI, options);
    console.log('✅ Connection successful!');
    
    // Test database operations
    console.log('🧪 Testing database operations...');
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📋 Available collections:', collections.map(c => c.name));
    
    await mongoose.disconnect();
    console.log('✅ Disconnected successfully');
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    
    if (error.message.includes('whitelist')) {
      console.log('\n🔧 SOLUTION: Add your IP to MongoDB Atlas whitelist');
      console.log('1. Go to https://cloud.mongodb.com');
      console.log('2. Select your cluster');
      console.log('3. Click "Network Access" in left sidebar');
      console.log('4. Click "Add IP Address"');
      console.log('5. Click "Allow Access from Anywhere" (0.0.0.0/0)');
      console.log('6. Click "Confirm"');
    }
    
    if (error.message.includes('authentication')) {
      console.log('\n🔧 SOLUTION: Check your username/password');
      console.log('1. Verify username and password in connection string');
      console.log('2. Make sure user has proper permissions');
    }
    
    if (error.message.includes('ENOTFOUND')) {
      console.log('\n🔧 SOLUTION: Check your connection string');
      console.log('1. Verify cluster address is correct');
      console.log('2. Make sure cluster is running');
    }
    
    process.exit(1);
  }
};

testConnection(); 