const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Product = require('../models/Product');
const verifyToken = require('../middleware/verifyToken');
const verifyAdmin = require('../middleware/verifyAdmin');

// Configure multer for image uploads (store in memory as Buffer)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    // Check file type
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// 📋 GET ALL PRODUCTS (with filtering, sorting, pagination)
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      brand,
      minPrice,
      maxPrice,
      sort = 'createdAt',
      order = 'desc',
      search,
      featured
    } = req.query;

    // Build filter object
    const filter = { isActive: true };
    
    if (category) filter.category = category;
    if (brand) filter.brand = { $regex: brand, $options: 'i' };
    if (featured === 'true') filter.isFeatured = true;
    
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    // Search functionality
    if (search) {
      filter.$text = { $search: search };
    }

    // Build sort object
    const sortObj = {};
    sortObj[sort] = order === 'desc' ? -1 : 1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const products = await Product.find(filter)
      .sort(sortObj)
      .limit(parseInt(limit))
      .skip(skip)
      .populate('reviews.user', 'username');

    // Get total count for pagination
    const total = await Product.countDocuments(filter);

    console.log(`✅ Retrieved ${products.length} products`);
    res.json({
      products,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalProducts: total,
        hasNext: skip + products.length < total,
        hasPrev: parseInt(page) > 1
      }
    });
  } catch (err) {
    console.error('❌ Error fetching products:', err);
    res.status(500).json({ message: 'Error fetching products', error: err.message });
  }
});

// 🔍 SEARCH PRODUCTS
router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const { limit = 10 } = req.query;

    const products = await Product.find(
      { $text: { $search: query }, isActive: true },
      { score: { $meta: 'textScore' } }
    )
      .sort({ score: { $meta: 'textScore' } })
      .limit(parseInt(limit))
      .populate('reviews.user', 'username');

    console.log(`✅ Search results for "${query}": ${products.length} products`);
    res.json(products);
  } catch (err) {
    console.error('❌ Error searching products:', err);
    res.status(500).json({ message: 'Error searching products', error: err.message });
  }
});

// 🏷️ GET PRODUCTS BY CATEGORY
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const { limit = 12 } = req.query;

    const products = await Product.find({
      category: category,
      isActive: true
    })
      .limit(parseInt(limit))
      .populate('reviews.user', 'username');

    console.log(`✅ Retrieved ${products.length} products from category: ${category}`);
    res.json(products);
  } catch (err) {
    console.error('❌ Error fetching products by category:', err);
    res.status(500).json({ message: 'Error fetching products by category', error: err.message });
  }
});

// 🏆 GET FEATURED PRODUCTS
router.get('/featured/all', async (req, res) => {
  try {
    const { limit = 8 } = req.query;

    const products = await Product.find({
      isFeatured: true,
      isActive: true
    })
      .limit(parseInt(limit))
      .populate('reviews.user', 'username');

    console.log(`✅ Retrieved ${products.length} featured products`);
    res.json(products);
  } catch (err) {
    console.error('❌ Error fetching featured products:', err);
    res.status(500).json({ message: 'Error fetching featured products', error: err.message });
  }
});

// 📊 GET PRODUCT STATISTICS
router.get('/stats/overview', async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments({ isActive: true });
    const featuredProducts = await Product.countDocuments({ isFeatured: true, isActive: true });
    const categories = await Product.distinct('category');
    const brands = await Product.distinct('brand');

    const stats = {
      totalProducts,
      featuredProducts,
      categories: categories.length,
      brands: brands.length,
      categoryList: categories,
      brandList: brands
    };

    console.log('✅ Retrieved product statistics');
    res.json(stats);
  } catch (err) {
    console.error('❌ Error fetching product statistics:', err);
    res.status(500).json({ message: 'Error fetching product statistics', error: err.message });
  }
});

// 🔍 GET PRODUCT BY ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('reviews.user', 'username')
      .populate('reviews', '-user');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    console.log(`✅ Retrieved product: ${product.name}`);
    res.json(product);
  } catch (err) {
    console.error('❌ Error fetching product:', err);
    res.status(500).json({ message: 'Error fetching product', error: err.message });
  }
});

// ➕ CREATE NEW PRODUCT WITH IMAGES (Admin only)
router.post('/with-images', verifyAdmin, upload.array('images', 5), async (req, res) => {
  try {
    console.log('🔍 Debug: Received request to /with-images');
    console.log('📋 Request body keys:', Object.keys(req.body));
    console.log('📸 Files received:', req.files ? req.files.length : 0);
    
    // Parse product data from form
    const productData = JSON.parse(req.body.productData);
    console.log('📦 Product data parsed:', productData.name);
    
    // Process uploaded images and store as Buffer
    const processedImages = req.files ? req.files.map(file => ({
      name: file.originalname,
      data: file.buffer,
      contentType: file.mimetype
    })) : [];
    
    console.log('🖼️ Processed images:', processedImages.length);
    
    const newProduct = new Product({
      ...productData,
      images: processedImages
    });

    await newProduct.save();
    console.log(`✅ Created new product with ${processedImages.length} images: ${productData.name}`);
    res.status(201).json({ 
      message: 'Product created successfully with images', 
      product: newProduct,
      imagesUploaded: processedImages.length
    });
  } catch (err) {
    console.error('❌ Error creating product with images:', err);
    console.error('❌ Error details:', err.stack);
    res.status(500).json({ message: 'Error creating product with images', error: err.message });
  }
});

// ➕ CREATE NEW PRODUCT (Admin only)
router.post('/', verifyAdmin, async (req, res) => {
  try {
    const {
      name,
      brand,
      category,
      description,
      price,
      originalPrice,
      discount,
      images = [],
      sizes,
      colors,
      features,
      specifications,
      tags,
      isFeatured
    } = req.body;

    const newProduct = new Product({
      name,
      brand,
      category,
      description,
      price,
      originalPrice,
      discount,
      images,
      sizes,
      colors,
      features,
      specifications,
      tags,
      isFeatured
    });

    await newProduct.save();
    console.log(`✅ Created new product: ${name}`);
    res.status(201).json({ message: 'Product created successfully', product: newProduct });
  } catch (err) {
    console.error('❌ Error creating product:', err);
    res.status(500).json({ message: 'Error creating product', error: err.message });
  }
});

// ✏️ UPDATE PRODUCT (Admin only)
router.put('/:id', verifyAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    console.log(`✅ Updated product: ${product.name}`);
    res.json({ message: 'Product updated successfully', product });
  } catch (err) {
    console.error('❌ Error updating product:', err);
    res.status(500).json({ message: 'Error updating product', error: err.message });
  }
});

// 🗑️ DELETE PRODUCT (Admin only)
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    console.log(`✅ Deleted product: ${product.name}`);
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error('❌ Error deleting product:', err);
    res.status(500).json({ message: 'Error deleting product', error: err.message });
  }
});

// ⭐ ADD REVIEW TO PRODUCT
router.post('/:id/reviews', verifyToken, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const productId = req.params.id;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if user already reviewed this product
    const existingReview = product.reviews.find(
      review => review.user.toString() === req.user.id
    );

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this product' });
    }

    // Add new review
    const newReview = {
      user: req.user.id,
      rating,
      comment
    };

    product.reviews.push(newReview);

    // Update average rating
    const totalRating = product.reviews.reduce((sum, review) => sum + review.rating, 0);
    product.rating = totalRating / product.reviews.length;
    product.numReviews = product.reviews.length;

    await product.save();

    console.log(`✅ Added review to product: ${product.name}`);
    res.status(201).json({ message: 'Review added successfully', product });
  } catch (err) {
    console.error('❌ Error adding review:', err);
    res.status(500).json({ message: 'Error adding review', error: err.message });
  }
});

// 📸 UPLOAD PRODUCT IMAGES (Admin only)
router.post('/:id/images', verifyAdmin, upload.array('images', 5), async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No images uploaded' });
    }

    // Process uploaded images and store as Buffer
    const newImages = req.files.map(file => ({
      name: file.originalname,
      data: file.buffer,
      contentType: file.mimetype
    }));

    // Add new images to product
    product.images = [...product.images, ...newImages];
    await product.save();

    console.log(`✅ Uploaded ${req.files.length} images for product: ${product.name}`);
    res.json({ 
      message: 'Images uploaded successfully', 
      images: newImages.map((_, index) => `/api/products/${productId}/images/${product.images.length - req.files.length + index}`),
      totalImages: product.images.length 
    });
  } catch (err) {
    console.error('❌ Error uploading images:', err);
    res.status(500).json({ message: 'Error uploading images', error: err.message });
  }
});

// 🖼️ GET PRODUCT IMAGE
router.get('/:id/images/:imageIndex', async (req, res) => {
  try {
    const { id, imageIndex } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const index = parseInt(imageIndex);
    if (index < 0 || index >= product.images.length) {
      return res.status(404).json({ message: 'Image not found' });
    }

    const image = product.images[index];
    
    // Set appropriate headers
    res.set('Content-Type', image.contentType);
    res.set('Content-Length', image.data.length);
    
    // Send the image buffer
    res.send(image.data);
  } catch (err) {
    console.error('❌ Error serving image:', err);
    res.status(500).json({ message: 'Error serving image', error: err.message });
  }
});

// 🗑️ DELETE PRODUCT IMAGE (Admin only)
router.delete('/:id/images/:imageIndex', verifyAdmin, async (req, res) => {
  try {
    const { id, imageIndex } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const index = parseInt(imageIndex);
    if (index < 0 || index >= product.images.length) {
      return res.status(400).json({ message: 'Invalid image index' });
    }

    // Remove image from array
    product.images.splice(index, 1)[0];
    await product.save();

    console.log(`✅ Deleted image from product: ${product.name}`);
    res.json({ 
      message: 'Image deleted successfully', 
      remainingImages: product.images.length 
    });
  } catch (err) {
    console.error('❌ Error deleting image:', err);
    res.status(500).json({ message: 'Error deleting image', error: err.message });
  }
});

module.exports = router; 