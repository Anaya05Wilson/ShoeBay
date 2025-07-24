import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Filter, Grid, List, Star, Heart, Plus } from 'lucide-react';
import { productService } from '../services/productService';
import { useCart } from '../context/CartContext';
import { useAuth } from '../hooks/useAuth';
import AddProductModal from '../components/AddProductModal';
import EditProductModal from '../components/EditProductModal';
import ProductMenu from '../components/ProductMenu';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('name');
  const [filters, setFilters] = useState({
    category: '',
    brand: '',
    minPrice: '',
    maxPrice: '',
    rating: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [addedMap, setAddedMap] = useState({});
  const [likedMap, setLikedMap] = useState({});
  const [userRatings, setUserRatings] = useState({});
  const [ratingCounts, setRatingCounts] = useState({});

  const { addToCart } = useCart();
  const { user } = useAuth();
  const location = useLocation();

  // Get search term from URL
  const searchParams = new URLSearchParams(location.search);
  const searchTerm = searchParams.get('q')?.toLowerCase() || '';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productService.getAllProducts();
        setProducts(data.products || data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product, '9', 1);
    setAddedMap(prev => ({ ...prev, [product._id]: true }));
    setTimeout(() => {
      setAddedMap(prev => ({ ...prev, [product._id]: false }));
    }, 2000);
  };

  const handleProductAdded = (newProduct) => {
    setProducts(prevProducts => [newProduct, ...prevProducts]);
  };

  const handleProductUpdated = (updatedProduct) => {
    if (updatedProduct === null) {
      // Product was deleted
      setProducts(prevProducts => prevProducts.filter(p => p._id !== selectedProduct._id));
    } else {
      // Product was updated
      setProducts(prevProducts => 
        prevProducts.map(p => p._id === updatedProduct._id ? updatedProduct : p)
      );
    }
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setShowEditModal(true);
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await productService.deleteProduct(productId);
      setProducts(prevProducts => prevProducts.filter(p => p._id !== productId));
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product. Please try again.');
    }
  };

  // Like handler
  const handleLike = (productId) => {
    setLikedMap(prev => ({ ...prev, [productId]: !prev[productId] }));
  };

  // Interactive rating handler
  const handleRate = (productId, rating) => {
    setUserRatings(prev => ({ ...prev, [productId]: rating }));
    setRatingCounts(prev => ({
      ...prev,
      [productId]: (prev[productId] || Math.round((products.find(p => p._id === productId)?.rating || 0))) + rating
    }));
    // Here you would call the backend to submit the rating
  };

  const filteredProducts = products.filter(product => {
    // Search filter
    const matchesSearch = !searchTerm ||
      product.name?.toLowerCase().includes(searchTerm) ||
      product.brand?.toLowerCase().includes(searchTerm) ||
      product.category?.toLowerCase().includes(searchTerm);
    // Other filters
    return (
      matchesSearch &&
      (!filters.category || product.category === filters.category) &&
      (!filters.brand || product.brand === filters.brand) &&
      (!filters.minPrice || product.price >= parseInt(filters.minPrice)) &&
      (!filters.maxPrice || product.price <= parseInt(filters.maxPrice)) &&
      (!filters.rating || product.rating >= parseInt(filters.rating))
    );
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating': {
        const aRating = userRatings[a._id] ?? Math.round(a.rating || 0);
        const bRating = userRatings[b._id] ?? Math.round(b.rating || 0);
        return bRating - aRating;
      }
      case 'name':
      default:
        return a.name.localeCompare(b.name);
    }
  });

  const brands = [...new Set(products.map(p => p.brand))];
  const categories = [...new Set(products.map(p => p.category))];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">All Products</h1>
          <p className="text-gray-600">Discover our complete collection of premium footwear</p>
        </div>

        {/* Admin Add Product Button */}
        {user?.isAdmin && (
          <div className="mb-6">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              <Plus className="h-5 w-5" />
              Add New Product
            </button>
          </div>
        )}

        {/* Filters and Sort */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter className="h-4 w-4" />
              Filters
            </button>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="name">Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Rating</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">View:</span>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'hover:bg-gray-100'}`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'hover:bg-gray-100'}`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters({...filters, category: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
                <select
                  value={filters.brand}
                  onChange={(e) => setFilters({...filters, brand: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">All Brands</option>
                  {brands.map(brand => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Min Price</label>
                <input
                  type="number"
                  value={filters.minPrice}
                  onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="$0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Max Price</label>
                <input
                  type="number"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="$500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Min Rating</label>
                <select
                  value={filters.rating}
                  onChange={(e) => setFilters({...filters, rating: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Any Rating</option>
                  <option value="4">4+ Stars</option>
                  <option value="3">3+ Stars</option>
                  <option value="2">2+ Stars</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Showing {sortedProducts.length} of {products.length} products
          </p>
        </div>

        {/* Products Grid/List */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-200 aspect-square rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className={viewMode === 'grid'
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
            : 'space-y-4'}>
            {sortedProducts.map((product) => (
              <div key={product._id} className={`card p-6 group ${viewMode === 'list' ? 'flex gap-6' : ''}`}>
                <div className={`relative mb-4 ${viewMode === 'list' ? 'w-48 mb-0' : ''}`}>
                  <img
                    src={product.images && product.images.length > 0 
                      ? `http://localhost:5000/api/products/${product._id}/images/0` 
                      : 'http://localhost:5000/api/assets/domino-studio.jpg'}
                    alt={product.name}
                    className="w-full aspect-square object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = 'http://localhost:5000/api/assets/domino-studio.jpg';
                    }}
                  />
                  {product.isNew && (
                    <span className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      New
                    </span>
                  )}
                  {user?.isAdmin && (
                    <span className="absolute top-2 left-2 bg-purple-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      Admin
                    </span>
                  )}
                  {product.originalPrice > product.price && (
                    <span className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      Sale
                    </span>
                  )}
                  {/* Like button */}
                  <button
                    className={`absolute top-2 right-2 p-2 rounded-full shadow-md transition-colors ${likedMap[product._id] ? 'bg-red-100' : 'bg-white'} hover:bg-red-200`}
                    onClick={() => handleLike(product._id)}
                  >
                    <Heart className={`h-4 w-4 ${likedMap[product._id] ? 'text-red-500 fill-red-500' : 'text-gray-600'}`} fill={likedMap[product._id] ? 'currentColor' : 'none'} />
                  </button>
                  
                  {/* Admin Menu */}
                  {user?.isAdmin && (
                    <div className="absolute top-2 left-2">
                      <ProductMenu
                        product={product}
                        onEdit={handleEditProduct}
                        onDelete={handleDeleteProduct}
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{product.brand}</span>
                    <div className="flex items-center gap-1">
                      {/* Interactive star rating */}
                      {Array.from({ length: 5 }).map((_, i) => {
                        const userRating = userRatings[product._id];
                        const avgRating = Math.round(product.rating || 0);
                        const filled = userRating ? i < userRating : i < avgRating;
                        return (
                          <button
                            key={i}
                            type="button"
                            className="focus:outline-none"
                            onClick={() => handleRate(product._id, i + 1)}
                          >
                            <Star className={`h-4 w-4 ${filled ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                          </button>
                        );
                      })}
                      <span className="text-sm text-gray-600 ml-1">{userRatings[product._id] ?? 0}</span>
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900">
                    <Link to={`/products/${product._id}`} className="hover:text-primary-600 transition-colors">
                      {product.name}
                    </Link>
                  </h3>
                  <p className="text-sm text-gray-500">{product.category}</p>
                  {viewMode === 'list' && (
                    <p className="text-sm text-gray-600">{product.description}</p>
                  )}
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-primary-600">
                      ${product.price}
                    </span>
                    {product.originalPrice > product.price && (
                      <span className="text-sm text-gray-500 line-through">
                        ${product.originalPrice}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Link
                      to={`/products/${product._id}`}
                      className="flex-1 bg-gray-100 text-gray-800 text-center py-2 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      View Details
                    </Link>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="flex-1 bg-primary-600 text-white text-center py-2 rounded-lg hover:bg-primary-700 transition-colors font-semibold"
                      disabled={!!addedMap[product._id]}
                    >
                      {addedMap[product._id] ? 'Added!' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {sortedProducts.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products found matching your filters.</p>
            <button
              onClick={() => setFilters({category: '', brand: '', minPrice: '', maxPrice: '', rating: ''})}
              className="mt-4 text-primary-600 hover:text-primary-700 font-medium"
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* Add Product Modal */}
        <AddProductModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onProductAdded={handleProductAdded}
        />

        {/* Edit Product Modal */}
        <EditProductModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedProduct(null);
          }}
          product={selectedProduct}
          onProductUpdated={handleProductUpdated}
        />
      </div>
    </div>
  );
};

export default Products;
