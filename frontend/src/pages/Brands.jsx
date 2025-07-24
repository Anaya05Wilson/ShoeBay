import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Star } from 'lucide-react';
import { productService } from '../services/productService';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Brands = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  // Get search term from URL
  const searchParams = new URLSearchParams(location.search);
  const urlSearchTerm = searchParams.get('q') || '';
  const [searchTerm, setSearchTerm] = useState(urlSearchTerm);

  useEffect(() => {
    setSearchTerm(urlSearchTerm);
  }, [urlSearchTerm]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        if (searchTerm) {
          const data = await productService.getAllProducts({ brand: searchTerm });
          setProducts(data.products || data);
        } else {
          setProducts([]);
        }
      } catch (error) {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [searchTerm]);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/brands?q=${encodeURIComponent(searchTerm)}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-r from-gray-900 to-gray-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Search by Brand</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Find products from your favorite brands.
          </p>
          <div className="max-w-md mx-auto relative">
            <form onSubmit={handleSearch}>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search brands..."
                className="w-full pl-10 pr-4 py-3 bg-white text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
            </form>
          </div>
        </div>
      </section>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">{searchTerm ? `Products for "${searchTerm}"` : 'Search for a brand above'}</h2>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="animate-pulse bg-white rounded-lg shadow-md p-6">
                <div className="h-12 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="flex space-x-2">
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                  <div className="h-6 bg-gray-200 rounded w-12"></div>
                </div>
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product._id} className={`card p-6 group`}>
                <div className="relative mb-4">
                  <img
                    src={product.images && product.images.length > 0 ? `${API_BASE_URL.replace(/\/api$/, '')}/api/products/${product._id}/images/0` : `${API_BASE_URL.replace(/\/api$/, '')}/api/assets/domino-studio.jpg`}
                    alt={product.name}
                    className="w-full aspect-square object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="space-y-2 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{product.brand}</span>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600 ml-1">{product.rating}</span>
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900">{product.name}</h3>
                  <p className="text-sm text-gray-500">{product.category}</p>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-primary-600">${product.price}</span>
                    {product.originalPrice > product.price && (
                      <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Link
                      to={`/products/${product._id}`}
                      className="flex-1 bg-gray-100 text-gray-800 text-center py-2 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : searchTerm ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products found for this brand.</p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Brands;
