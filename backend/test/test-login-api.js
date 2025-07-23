const axios = require('axios');

const testLoginAPI = async () => {
  try {
    console.log('🧪 Testing login API endpoint...\n');
    
    const loginData = {
      email: 'admin@shoebay.com',
      password: 'admin123'
    };

    console.log('📤 Sending login request...');
    console.log('📧 Email:', loginData.email);
    console.log('🔑 Password:', loginData.password);
    console.log('🌐 API URL: http://localhost:5000/api/auth/login\n');

    const response = await axios.post('http://localhost:5000/api/auth/login', loginData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Login successful!');
    console.log('📊 Response status:', response.status);
    console.log('📋 Response data:', JSON.stringify(response.data, null, 2));
    
    if (response.data.user) {
      console.log('\n👤 User details:');
      console.log('   ID:', response.data.user.id);
      console.log('   Username:', response.data.user.username);
      console.log('   Email:', response.data.user.email);
      console.log('   Is Admin:', response.data.user.isAdmin);
      console.log('   Role:', response.data.user.role);
    }

    if (response.data.token) {
      console.log('\n🔑 JWT Token received');
      console.log('   Token preview:', response.data.token.substring(0, 50) + '...');
    }

  } catch (error) {
    console.error('❌ Login failed:', error.message);
    
    if (error.response) {
      console.log('📊 Response status:', error.response.status);
      console.log('📋 Response data:', error.response.data);
    }
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n🔧 Make sure your backend server is running:');
      console.log('   node server.js');
    }
  }
};

// Run if this file is executed directly
if (require.main === module) {
  testLoginAPI();
}

module.exports = { testLoginAPI }; 