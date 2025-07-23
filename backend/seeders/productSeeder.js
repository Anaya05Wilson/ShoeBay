const mongoose = require('mongoose');
const Product = require('../models/Product');
require('dotenv').config();

const sampleProducts = [
  {
    name: "Nike Air Max 270",
    brand: "Nike",
    category: "sneakers",
    description: "The Nike Air Max 270 delivers unrivaled, all-day comfort. The shoe's design draws inspiration from Air Max icons, showcasing Nike's greatest innovation with its large window and fresh array of colors.",
    price: 150.00,
    originalPrice: 180.00,
    discount: 17,
    images: [
      "/api/assets/nike-air-max-270-1.jpg",
      "/api/assets/nike-air-max-270-2.jpg",
      "/api/assets/nike-air-max-270-3.jpg"
    ],
    sizes: [
      { size: "7", stock: 15 },
      { size: "8", stock: 20 },
      { size: "9", stock: 25 },
      { size: "10", stock: 18 },
      { size: "11", stock: 12 },
      { size: "12", stock: 8 }
    ],
    colors: [
      { name: "White/Black", hex: "#FFFFFF" },
      { name: "Black/Red", hex: "#000000" },
      { name: "Blue/Gray", hex: "#0066CC" }
    ],
    rating: 4.5,
    numReviews: 128,
    features: [
      "Breathable mesh upper",
      "Air Max 270 unit for maximum cushioning",
      "Rubber outsole for durability",
      "Foam midsole for lightweight comfort"
    ],
    specifications: {
      material: "Mesh and synthetic",
      sole: "Rubber",
      closure: "Lace-up",
      weight: "320g"
    },
    isActive: true,
    isFeatured: true,
    tags: ["running", "comfortable", "stylish", "breathable"]
  },
  {
    name: "Adidas Ultraboost 22",
    brand: "Adidas",
    category: "running",
    description: "The adidas Ultraboost 22 running shoes feature a responsive Boost midsole and a Primeknit+ upper that adapts to your foot for a personalized fit. Perfect for long-distance running.",
    price: 190.00,
    originalPrice: 220.00,
    discount: 14,
    images: [
      "/api/assets/adidas-ultraboost-22-1.jpg",
      "/api/assets/adidas-ultraboost-22-2.jpg"
    ],
    sizes: [
      { size: "7", stock: 10 },
      { size: "8", stock: 15 },
      { size: "9", stock: 20 },
      { size: "10", stock: 22 },
      { size: "11", stock: 18 },
      { size: "12", stock: 12 }
    ],
    colors: [
      { name: "Core Black", hex: "#000000" },
      { name: "Cloud White", hex: "#FFFFFF" },
      { name: "Solar Red", hex: "#FF0000" }
    ],
    rating: 4.8,
    numReviews: 95,
    features: [
      "Primeknit+ upper",
      "Responsive Boost midsole",
      "Continental™ Rubber outsole",
      "Linear Energy Push system"
    ],
    specifications: {
      material: "Primeknit+",
      sole: "Continental™ Rubber",
      closure: "Lace-up",
      weight: "310g"
    },
    isActive: true,
    isFeatured: true,
    tags: ["running", "performance", "responsive", "lightweight"]
  },
  {
    name: "Converse Chuck Taylor All Star",
    brand: "Converse",
    category: "casual",
    description: "The iconic Chuck Taylor All Star sneaker features a canvas upper, rubber toe cap, and vulcanized rubber outsole. A timeless classic that goes with everything.",
    price: 65.00,
    originalPrice: 65.00,
    discount: 0,
    images: [
      "/api/assets/converse-chuck-taylor-1.jpg",
      "/api/assets/converse-chuck-taylor-2.jpg"
    ],
    sizes: [
      { size: "6", stock: 25 },
      { size: "7", stock: 30 },
      { size: "8", stock: 35 },
      { size: "9", stock: 40 },
      { size: "10", stock: 35 },
      { size: "11", stock: 25 },
      { size: "12", stock: 20 }
    ],
    colors: [
      { name: "White", hex: "#FFFFFF" },
      { name: "Black", hex: "#000000" },
      { name: "Navy", hex: "#000080" },
      { name: "Red", hex: "#FF0000" }
    ],
    rating: 4.6,
    numReviews: 342,
    features: [
      "Canvas upper",
      "Rubber toe cap",
      "Vulcanized rubber outsole",
      "Iconic Chuck Taylor design"
    ],
    specifications: {
      material: "Canvas",
      sole: "Vulcanized rubber",
      closure: "Lace-up",
      weight: "280g"
    },
    isActive: true,
    isFeatured: false,
    tags: ["casual", "classic", "versatile", "iconic"]
  },
  {
    name: "Vans Old Skool",
    brand: "Vans",
    category: "casual",
    description: "The Vans Old Skool features the iconic side stripe and a durable canvas upper. Perfect for skateboarding and everyday wear.",
    price: 60.00,
    originalPrice: 60.00,
    discount: 0,
    images: [
      "/api/assets/vans-old-skool-1.jpg",
      "/api/assets/vans-old-skool-2.jpg"
    ],
    sizes: [
      { size: "6", stock: 20 },
      { size: "7", stock: 25 },
      { size: "8", stock: 30 },
      { size: "9", stock: 35 },
      { size: "10", stock: 30 },
      { size: "11", stock: 20 },
      { size: "12", stock: 15 }
    ],
    colors: [
      { name: "Black/White", hex: "#000000" },
      { name: "Navy/White", hex: "#000080" },
      { name: "Red/White", hex: "#FF0000" }
    ],
    rating: 4.4,
    numReviews: 156,
    features: [
      "Canvas upper",
      "Iconic side stripe",
      "Vulcanized rubber outsole",
      "Padded collar"
    ],
    specifications: {
      material: "Canvas",
      sole: "Vulcanized rubber",
      closure: "Lace-up",
      weight: "270g"
    },
    isActive: true,
    isFeatured: false,
    tags: ["skateboarding", "casual", "iconic", "durable"]
  },
  {
    name: "New Balance 990v5",
    brand: "New Balance",
    category: "running",
    description: "The New Balance 990v5 features premium pigskin and mesh upper with ENCAP midsole technology for superior support and cushioning.",
    price: 185.00,
    originalPrice: 185.00,
    discount: 0,
    images: [
      "/api/assets/new-balance-990v5-1.jpg",
      "/api/assets/new-balance-990v5-2.jpg"
    ],
    sizes: [
      { size: "7", stock: 12 },
      { size: "8", stock: 18 },
      { size: "9", stock: 22 },
      { size: "10", stock: 25 },
      { size: "11", stock: 20 },
      { size: "12", stock: 15 }
    ],
    colors: [
      { name: "Gray", hex: "#808080" },
      { name: "Navy", hex: "#000080" },
      { name: "Black", hex: "#000000" }
    ],
    rating: 4.7,
    numReviews: 89,
    features: [
      "Premium pigskin and mesh upper",
      "ENCAP midsole technology",
      "Dual density collar foam",
      "Blown rubber outsole"
    ],
    specifications: {
      material: "Pigskin and mesh",
      sole: "Blown rubber",
      closure: "Lace-up",
      weight: "340g"
    },
    isActive: true,
    isFeatured: true,
    tags: ["running", "premium", "support", "cushioning"]
  }
];

const seedProducts = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('🗑️ Cleared existing products');

    // Insert sample products
    const insertedProducts = await Product.insertMany(sampleProducts);
    console.log(`✅ Seeded ${insertedProducts.length} products`);

    // Display sample products
    console.log('\n📋 Sample Products Created:');
    insertedProducts.forEach(product => {
      console.log(`- ${product.name} (${product.brand}) - $${product.price}`);
    });

    console.log('\n🎉 Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run seeder if this file is executed directly
if (require.main === module) {
  seedProducts();
}

module.exports = { seedProducts, sampleProducts }; 