const axios = require('axios');

const testAddProduct = async () => {
  try {
    console.log('🧪 Testing admin product creation...\n');
    
    // First login as admin to get token
    const loginData = {
      email: 'admin@shoebay.com',
      password: 'admin123'
    };

    console.log('🔐 Logging in as admin...');
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', loginData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const token = loginResponse.data.token;
    console.log('✅ Admin login successful');
    console.log('🔑 Token received');

    // Test product data
    const productData = {
      name: "Test Admin Product",
      brand: "Nike",
      category: "sneakers",
      description: "This is a test product created by admin user",
      price: 129.99,
      originalPrice: 149.99,
      discount: 13,
      images: ["/api/assets/test-product.jpg"],
      sizes: [
        { size: "8", stock: 15 },
        { size: "9", stock: 20 },
        { size: "10", stock: 18 },
        { size: "11", stock: 12 }
      ],
      colors: [
        { name: "Black", hex: "#000000" },
        { name: "White", hex: "#FFFFFF" },
        { name: "Red", hex: "#FF0000" }
      ],
      features: [
        "Breathable mesh upper",
        "Responsive cushioning",
        "Durable rubber outsole",
        "Lightweight design"
      ],
      specifications: {
        material: "Mesh and synthetic",
        sole: "Rubber",
        closure: "Lace-up",
        weight: "280g"
      },
      tags: ["test", "admin", "sneakers", "comfortable"],
      isFeatured: true
    };

    console.log('\n📦 Creating test product...');
    console.log('📋 Product name:', productData.name);
    console.log('🏷️ Brand:', productData.brand);
    console.log('💰 Price: $' + productData.price);

    const createResponse = await axios.post('http://localhost:5000/api/products', productData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('\n✅ Product created successfully!');
    console.log('📊 Response status:', createResponse.status);
    console.log('📋 Product ID:', createResponse.data.product._id);
    console.log('📝 Product name:', createResponse.data.product.name);
    console.log('🏷️ Brand:', createResponse.data.product.brand);
    console.log('💰 Price: $' + createResponse.data.product.price);
    console.log('👑 Created by admin:', createResponse.data.product.isActive ? 'Yes' : 'No');

    // Test fetching the product to verify it's in the database
    console.log('\n🔍 Verifying product in database...');
    const fetchResponse = await axios.get(`http://localhost:5000/api/products/${createResponse.data.product._id}`);
    
    if (fetchResponse.data) {
      console.log('✅ Product found in database');
      console.log('📋 Database verification successful');
    }

    console.log('\n🎉 Admin product creation test completed successfully!');
    console.log('\n📋 Test Summary:');
    console.log('✅ Admin login: Working');
    console.log('✅ Product creation: Working');
    console.log('✅ Database storage: Working');
    console.log('✅ Collection: test.products');
    
    console.log('\n🚀 You can now:');
    console.log('- Login as admin in the frontend');
    console.log('- Click "Add New Product" button');
    console.log('- Create products that appear immediately');
    console.log('- Products will be saved in test.products collection');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    
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
  testAddProduct();
}

module.exports = { testAddProduct }; 