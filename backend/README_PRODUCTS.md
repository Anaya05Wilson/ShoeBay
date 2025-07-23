# Product API Documentation

## Overview
This document describes the complete product management system for the ShoeBay e-commerce application.

## Database Schema

### Product Model (`models/Product.js`)
```javascript
{
  name: String (required),
  brand: String (required),
  category: String (enum: ['sneakers', 'running', 'casual', 'formal', 'sports', 'boots', 'sandals']),
  description: String (required),
  price: Number (required, min: 0),
  originalPrice: Number (optional),
  discount: Number (0-100, default: 0),
  images: [String] (required),
  sizes: [{ size: String, stock: Number }],
  colors: [{ name: String, hex: String }],
  rating: Number (0-5, default: 0),
  numReviews: Number (default: 0),
  reviews: [{ user: ObjectId, rating: Number, comment: String, date: Date }],
  features: [String],
  specifications: { material: String, sole: String, closure: String, weight: String },
  isActive: Boolean (default: true),
  isFeatured: Boolean (default: false),
  tags: [String]
}
```

## API Endpoints

### Base URL: `/api/products`

### 1. Get All Products
**GET** `/api/products`

**Query Parameters:**
- `page` (default: 1) - Page number for pagination
- `limit` (default: 12) - Number of products per page
- `category` - Filter by category
- `brand` - Filter by brand (case-insensitive)
- `minPrice` - Minimum price filter
- `maxPrice` - Maximum price filter
- `sort` (default: 'createdAt') - Sort field
- `order` (default: 'desc') - Sort order ('asc' or 'desc')
- `search` - Text search in name, brand, description
- `featured` - Filter featured products only

**Response:**
```json
{
  "products": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalProducts": 50,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### 2. Get Product by ID
**GET** `/api/products/:id`

**Response:**
```json
{
  "_id": "...",
  "name": "Nike Air Max 270",
  "brand": "Nike",
  "category": "sneakers",
  "price": 150.00,
  "discountedPrice": 124.50,
  "images": [...],
  "sizes": [...],
  "reviews": [...],
  ...
}
```

### 3. Create New Product (Admin)
**POST** `/api/products`
**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "Product Name",
  "brand": "Brand Name",
  "category": "sneakers",
  "description": "Product description",
  "price": 150.00,
  "images": ["/api/assets/image1.jpg"],
  "sizes": [
    { "size": "8", "stock": 20 }
  ],
  "features": ["Feature 1", "Feature 2"]
}
```

### 4. Update Product (Admin)
**PUT** `/api/products/:id`
**Headers:** `Authorization: Bearer <token>`

### 5. Delete Product (Admin)
**DELETE** `/api/products/:id`
**Headers:** `Authorization: Bearer <token>`

### 6. Add Product Review
**POST** `/api/products/:id/reviews`
**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "rating": 5,
  "comment": "Great product!"
}
```

### 7. Search Products
**GET** `/api/products/search/:query`

**Query Parameters:**
- `limit` (default: 10) - Number of results

### 8. Get Products by Category
**GET** `/api/products/category/:category`

**Query Parameters:**
- `limit` (default: 12) - Number of results

### 9. Get Featured Products
**GET** `/api/products/featured/all`

**Query Parameters:**
- `limit` (default: 8) - Number of results

### 10. Get Product Statistics
**GET** `/api/products/stats/overview`

**Response:**
```json
{
  "totalProducts": 50,
  "featuredProducts": 8,
  "categories": 6,
  "brands": 12,
  "categoryList": ["sneakers", "running", "casual"],
  "brandList": ["Nike", "Adidas", "Converse"]
}
```

## Usage Examples

### Frontend Integration

```javascript
// Get all products with filtering
const response = await fetch('/api/products?category=sneakers&minPrice=50&maxPrice=200&sort=price&order=asc');
const data = await response.json();

// Get single product
const product = await fetch(`/api/products/${productId}`);
const productData = await product.json();

// Add review (requires authentication)
const reviewResponse = await fetch(`/api/products/${productId}/reviews`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    rating: 5,
    comment: 'Excellent product!'
  })
});
```

## Database Seeding

To populate your database with sample products:

```bash
cd backend
node seeders/productSeeder.js
```

This will create 5 sample products with realistic data.

## Features

### ✅ Implemented Features
- **CRUD Operations** - Create, Read, Update, Delete products
- **Advanced Filtering** - By category, brand, price range
- **Search Functionality** - Text search across name, brand, description
- **Pagination** - Efficient data loading
- **Sorting** - Multiple sort options
- **Reviews System** - User reviews with ratings
- **Stock Management** - Size-based inventory tracking
- **Featured Products** - Highlight special products
- **Product Statistics** - Overview data for admin dashboard
- **Image Management** - Multiple product images
- **Discount System** - Percentage-based discounts
- **Virtual Fields** - Automatic discounted price calculation

### 🔧 Technical Features
- **MongoDB Text Index** - Optimized search performance
- **Input Validation** - Comprehensive data validation
- **Error Handling** - Detailed error messages
- **Authentication** - JWT-based admin operations
- **Population** - Automatic user data in reviews
- **Timestamps** - Automatic created/updated tracking

## File Structure

```
backend/
├── models/
│   └── Product.js          # Product database schema
├── routes/
│   └── products.js         # Product API endpoints
├── seeders/
│   └── productSeeder.js    # Sample data seeder
├── server.js               # Main server (updated with product routes)
└── README_PRODUCTS.md      # This documentation
```

## Environment Variables

Make sure your `.env` file includes:
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

## Next Steps

1. **Fix MongoDB Connection** - Update your `.env` file with a valid MongoDB URI
2. **Run the Seeder** - Populate your database with sample products
3. **Test the API** - Use tools like Postman or Thunder Client to test endpoints
4. **Frontend Integration** - Connect your React frontend to these endpoints
5. **Image Upload** - Implement file upload for product images
6. **Admin Panel** - Create admin interface for product management

## Error Handling

All endpoints include comprehensive error handling:
- **400** - Bad Request (validation errors)
- **401** - Unauthorized (missing/invalid token)
- **404** - Not Found (product doesn't exist)
- **500** - Internal Server Error (database/server errors)

Each error response includes a descriptive message and optional error details for debugging. 