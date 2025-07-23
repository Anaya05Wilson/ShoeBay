import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Filter, Grid, List, Star, Heart, ShoppingCart,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { productService } from '../services/productService';

const Category = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const urlParams = new URLSearchParams(location.search);
        const categoryFromUrl = urlParams.get('category');
        if (categoryFromUrl) setSelectedCategory(categoryFromUrl);

        const [categoryList, brandList] = await Promise.all([
          productService.getCategories(),
          productService.getBrands(),
        ]);

        setCategories([{ id: 'all', name: 'All Categories' }, ...categoryList]);
        setBrands([{ id: 'all', name: 'All Brands' }, ...brandList]);

        fetchFilteredProducts(); // initial fetch
      } catch (error) {
        console.error('Error fetching initial data:', error.message);
      }
    };

    fetchInitialData();
  }, [location.search]);

  useEffect(() => {
    fetchFilteredProducts();
  }, [selectedCategory, selectedBrand, priceRange, sortBy]);

  const fetchFilteredProducts = async () => {
    setLoading(true);
    try {
      const filters = {
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
        brand: selectedBrand !== 'all' ? selectedBrand : undefined,
        minPrice: priceRange[0],
        maxPrice: priceRange[1],
        sort: sortBy,
      };

      const productsData = await productService.getAllProducts(filters);
      setProducts(productsData);
      setFilteredProducts(productsData);
    } catch (error) {
      console.error('Error fetching products:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    addToCart({
      id: product.id,
      name: product.name,
      brand: product.brand,
      price: product.price,
      image: product.image,
      size: product.sizes?.[0] || 'M',
    });
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);

  const ProductCard = ({ product }) => (
    <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
      <div className="relative">
        <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded-t-lg" />
        {product.isOnSale && (
          <span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-xs rounded">Sale</span>
        )}
        <button className="absolute top-2 right-2 p-2 bg-white rounded-full hover:bg-gray-100">
          <Heart className="h-4 w-4 text-gray-600" />
        </button>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900">{product.name}</h3>
        <p className="text-sm text-gray-500 mb-2">{product.brand}</p>
        <div className="flex items-center mb-2">
          <Star className="h-4 w-4 text-yellow-400 fill-current" />
          <span className="ml-1 text-sm text-gray-600">{product.rating}</span>
        </div>
        <div className="flex items-center space-x-2 mb-3">
          <span className="text-lg font-bold text-gray-900">{formatPrice(product.price)}</span>
          {product.originalPrice > product.price && (
            <span className="text-sm text-gray-500 line-through">{formatPrice(product.originalPrice)}</span>
          )}
        </div>
        <button
          onClick={() => handleAddToCart(product)}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center"
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add to Cart
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {selectedCategory === 'all'
              ? 'All Products'
              : categories.find((cat) => cat.id === selectedCategory)?.name || 'Products'}
          </h1>
          <p className="text-gray-600">{filteredProducts.length} product(s) found</p>
        </div>

        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Filters */}
          <aside className="lg:col-span-1 mb-6 lg:mb-0">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="space-y-6">
                {/* Category Filter */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Categories</h3>
                  {categories.map((category) => (
                    <label key={category.id} className="flex items-center mb-1">
                      <input
                        type="radio"
                        name="category"
                        value={category.id}
                        checked={selectedCategory === category.id}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">{category.name}</span>
                    </label>
                  ))}
                </div>

                {/* Brand Filter */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Brands</h3>
                  {brands.map((brand) => (
                    <label key={brand.id} className="flex items-center mb-1">
                      <input
                        type="radio"
                        name="brand"
                        value={brand.id}
                        checked={selectedBrand === brand.id}
                        onChange={(e) => setSelectedBrand(e.target.value)}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">{brand.name}</span>
                    </label>
                  ))}
                </div>

                {/* Price Filter */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Price Range</h3>
                  <input
                    type="range"
                    min="0"
                    max="500"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>$0</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <section className="lg:col-span-3">
            {/* Sorting and View Toggle */}
            <div className="flex items-center justify-between mb-6">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="name">Sort by Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest First</option>
              </select>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Products */}
            {filteredProducts.length === 0 ? (
              <div className="text-center text-gray-500">No products found.</div>
            ) : (
              <div
                className={`grid gap-6 ${
                  viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'
                }`}
              >
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default Category;
