const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB Connection
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;
    
    // Check if it's a local or Atlas connection
    const isAtlas = mongoURI.includes('mongodb+srv://') || mongoURI.includes('atlas');
    
    const options = {
      retryWrites: true,
      w: 'majority',
    };

    // Add Atlas-specific options with SSL/TLS fixes
    if (isAtlas) {
      // Remove SSL/TLS options that might cause issues
      options.serverSelectionTimeoutMS = 30000;
      options.socketTimeoutMS = 45000;
      options.connectTimeoutMS = 30000;
      options.maxPoolSize = 10;
      options.minPoolSize = 1;
    }

    await mongoose.connect(mongoURI, options);
    console.log(`✅ Connected to MongoDB ${isAtlas ? 'Atlas' : 'Local'} successfully`);
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    
    if (err.message.includes('whitelist') || err.message.includes('TLSV1_ALERT_INTERNAL_ERROR')) {
      console.log('\n🔧 To fix this issue:');
      console.log('1. Go to MongoDB Atlas dashboard: https://cloud.mongodb.com');
      console.log('2. Select your cluster');
      console.log('3. Click "Network Access" in the left sidebar');
      console.log('4. Click "Add IP Address"');
      console.log('5. Click "Allow Access from Anywhere" (0.0.0.0/0) for testing');
      console.log('6. Click "Confirm"');
      console.log('\n🌐 Your current IP might be different from what\'s whitelisted');
      console.log('💡 For development, you can allow access from anywhere (0.0.0.0/0)');
    }
    
    console.log('\n💡 Alternative: Use local MongoDB for testing');
    console.log('   MONGO_URI=mongodb://localhost:27017/test');
    process.exit(1);
  }
};

connectDB();

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5173',
      'http://localhost:5174',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:5174'
    ];
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// ✅ Serve static files
app.use('/api/assets', express.static(path.join(__dirname, 'public/assets')));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
