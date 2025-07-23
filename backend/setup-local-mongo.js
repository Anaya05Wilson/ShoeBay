const fs = require('fs');
const path = require('path');

console.log('🔧 Setting up local MongoDB connection...\n');

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
let envContent = '';

if (fs.existsSync(envPath)) {
  envContent = fs.readFileSync(envPath, 'utf8');
  console.log('📄 Found existing .env file');
} else {
  console.log('📄 Creating new .env file');
}

// Check if MONGO_URI already exists
if (envContent.includes('MONGO_URI=')) {
  console.log('⚠️ MONGO_URI already exists in .env file');
  console.log('💡 Current value:', envContent.match(/MONGO_URI=(.+)/)?.[1] || 'not found');
  console.log('\n🔧 To use local MongoDB, update your .env file with:');
  console.log('MONGO_URI=mongodb://localhost:27017/test');
} else {
  // Add MONGO_URI to .env file
  const newEnvContent = envContent + '\nMONGO_URI=mongodb://localhost:27017/test\nJWT_SECRET=shoebay_super_secret_2024\n';
  fs.writeFileSync(envPath, newEnvContent);
  console.log('✅ Added local MongoDB URI to .env file');
  console.log('🔗 Connection string: mongodb://localhost:27017/test');
}

console.log('\n📋 Next steps:');
console.log('1. Install MongoDB locally (if not already installed)');
console.log('2. Start MongoDB service');
console.log('3. Run: node server.js');
console.log('\n💡 Or use MongoDB Atlas by updating MONGO_URI in .env file');
console.log('   Example: MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/test'); 