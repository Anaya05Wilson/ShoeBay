const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Product = require('../models/Product');
require('dotenv').config();

const testAdminFunctionality = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // 1. Create admin user if it doesn't exist
    let adminUser = await User.findOne({ email: 'admin@shoebay.com' });
    
    if (!adminUser) {
      console.log('👑 Creating admin user...');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);

      adminUser = new User({
        username: 'admin',
        email: 'admin@shoebay.com',
        password: hashedPassword,
        role: 'admin',
        isAdmin: true
      });
      await adminUser.save();
      console.log('✅ Admin user created');
    } else {
      console.log('✅ Admin user already exists');
    }

    // 2. Login as admin
    console.log('\n🔐 Logging in as admin...');
    const isMatch = await bcrypt.compare('admin123', adminUser.password);
    if (!isMatch) {
      throw new Error('Password verification failed');
    }

    const token = jwt.sign({ 
      id: adminUser._id,
      isAdmin: adminUser.isAdmin,
      role: adminUser.role 
    }, process.env.JWT_SECRET || 'shoebay_super_secret', { expiresIn: '1h' });

    console.log('✅ Admin login successful');
    console.log('🔑 Token generated:', token.substring(0, 50) + '...');

    // 3. Test creating a product (simulate admin API call)
    console.log('\n📦 Testing product creation...');
    
    const testProduct = new Product({
      name: "Test Admin Product",
      brand: "Test Brand",
      category: "sneakers",
      description: "This is a test product created by admin",
      price: 99.99,
      images: ["/api/assets/test-product.jpg"],
      sizes: [
        { size: "8", stock: 10 },
        { size: "9", stock: 15 },
        { size: "10", stock: 12 }
      ],
      colors: [
        { name: "Black", hex: "#000000" },
        { name: "White", hex: "#FFFFFF" }
      ],
      features: ["Test feature 1", "Test feature 2"],
      specifications: {
        material: "Test material",
        sole: "Test sole",
        closure: "Lace-up",
        weight: "300g"
      },
      tags: ["test", "admin", "demo"]
    });

    await testProduct.save();
    console.log('✅ Test product created successfully');
    console.log('📋 Product ID:', testProduct._id);

    // 4. Test updating the product
    console.log('\n✏️ Testing product update...');
    const updatedProduct = await Product.findByIdAndUpdate(
      testProduct._id,
      { price: 89.99, name: "Updated Test Admin Product" },
      { new: true }
    );
    console.log('✅ Product updated successfully');
    console.log('💰 New price:', updatedProduct.price);

    // 5. Test deleting the product
    console.log('\n🗑️ Testing product deletion...');
    await Product.findByIdAndDelete(testProduct._id);
    console.log('✅ Test product deleted successfully');

    // 6. Display admin credentials
    console.log('\n🎉 Admin functionality test completed successfully!');
    console.log('\n📋 ADMIN CREDENTIALS:');
    console.log('📧 Email: admin@shoebay.com');
    console.log('🔑 Password: admin123');
    console.log('👑 Role: Admin');
    console.log('🔐 Token: ' + token.substring(0, 50) + '...');
    
    console.log('\n🚀 You can now:');
    console.log('- Login with these credentials');
    console.log('- Create, update, and delete products');
    console.log('- Access all admin-only endpoints');
    console.log('- Products will be saved in test.products collection');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error testing admin functionality:', error);
    process.exit(1);
  }
};

// Run test if this file is executed directly
if (require.main === module) {
  testAdminFunctionality();
}

module.exports = { testAdminFunctionality }; 