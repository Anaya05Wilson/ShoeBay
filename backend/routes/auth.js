// backend/routes/auth.js

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const verifyToken = require('../middleware/verifyToken'); // ✅ use this

const SECRET = process.env.JWT_SECRET || 'shoebay_super_secret';

// 📝 REGISTER
router.post('/register', async (req, res) => {
  try {
    console.log("📥 Incoming registration data:", req.body);

    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("⚠️ User already exists:", email);
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    console.log("✅ User registered:", username);
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("❌ Registration error:", err);
    res.status(500).json({ message: "Registration failed", error: err.message });
  }
});

// 🔐 LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      console.log("❌ Login failed: User not found");
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("❌ Login failed: Invalid password");
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ 
      id: user._id,
      isAdmin: user.isAdmin,
      role: user.role 
    }, SECRET, { expiresIn: '1h' });

    console.log("✅ Login successful:", email, user.isAdmin ? "(Admin)" : "(User)");
    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
        role: user.role
      },
      token
    });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ message: "Login failed", error: err.message });
  }
});

// 🔒 VERIFY TOKEN
router.get('/verify', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ 
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// 👑 CREATE ADMIN USER
router.post('/create-admin', async (req, res) => {
  try {
    const { username, email, password, adminSecret } = req.body;

    // Check admin secret (you can change this secret)
    if (adminSecret !== 'shoebay_admin_2024') {
      return res.status(403).json({ message: 'Invalid admin secret' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newAdmin = new User({ 
      username, 
      email, 
      password: hashedPassword,
      role: 'admin',
      isAdmin: true
    });
    await newAdmin.save();

    console.log("✅ Admin user created:", username);
    res.status(201).json({ message: "Admin user created successfully" });
  } catch (err) {
    console.error("❌ Admin creation error:", err);
    res.status(500).json({ message: "Admin creation failed", error: err.message });
  }
});

module.exports = router;
