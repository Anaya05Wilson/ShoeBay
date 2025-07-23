import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Star, ArrowRight } from 'lucide-react';
import { productService } from '../services/productService';

const Brands = () => {
  const [brands, setBrands] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const brandsData = await productService.getBrands();
        const productsData = await productService.getAllProducts();

        setBrands(brandsData);
        setFeaturedProducts(productsData.slice(0, 8));
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredBrands = brands.filter(brand =>
    brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    brand.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const featuredBrands = filteredBrands.filter(brand => brand.featured);
  const otherBrands = filteredBrands.filter(brand => !brand.featured);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-gray-900 to-gray-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Explore Brands</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Discover premium footwear from the world's leading brands.
          </p>
          <div className="max-w-md mx-auto relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search brands..."
              className="w-full pl-10 pr-4 py-3 bg-white text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Featured Brands */}
        {featuredBrands.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Featured Brands</h2>
              <span className="text-sm text-gray-500">
                {featuredBrands.length} brands
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {featuredBrands.map((brand) => (
                <Link
                  key={brand.id}
                  to={`/brands/${brand.name.toLowerCase()}`}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 group"
                >
                  <div className="flex items-center space-x-6">
                    <img
                      src={brand.logo}
                      alt={brand.name}
                      className="w-24 h-12 object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{brand.name}</h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{brand.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>Est. {brand.founded}</span>
                        <span>{brand.country}</span>
                        <span>{brand.products} products</span>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-1">
                        {brand.categories?.slice(0, 3).map((category) => (
                          <span key={category} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            {category}
                          </span>
                        ))}
                        {brand.categories?.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            +{brand.categories.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* All Brands */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">{featuredBrands.length > 0 ? 'All Brands' : 'Brands'}</h2>
            <span className="text-sm text-gray-500">{filteredBrands.length} brands</span>
          </div>

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
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {(featuredBrands.length > 0 ? otherBrands : filteredBrands).map((brand) => (
                <Link
                  key={brand.id}
                  to={`/brands/${brand.name.toLowerCase()}`}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 group"
                >
                  <div className="text-center">
                    <img
                      src={brand.logo}
                      alt={brand.name}
                      className="w-full h-16 object-contain mb-4 group-hover:scale-105 transition-transform duration-300"
                    />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{brand.name}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{brand.description}</p>
                    <div className="flex justify-center items-center space-x-3 text-sm text-gray-500 mb-3">
                      <span>Est. {brand.founded}</span>
                      <span>•</span>
                      <span>{brand.products} items</span>
                    </div>
                    <div className="flex flex-wrap justify-center gap-1">
                      {brand.categories?.slice(0, 2).map((category) => (
                        <span key={category} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          {category}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {filteredBrands.length === 0 && !loading && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No brands found matching your search.</p>
              <button
                onClick={() => setSearchTerm('')}
                className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear search
              </button>
            </div>
          )}
        </section>

        {/* Featured Products by Brand */}
        <section>
          {/* <h2 className="text-3xl font-bold text-gray-900 mb-8">Popular Products by Brand</h2> */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-4 group">
                <div className="relative mb-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full aspect-square object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-blue-600">{product.brand}</span>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600 ml-1">{product.rating}</span>
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900">{product.name}</h3>
                  <p className="text-sm text-gray-500">{product.category}</p>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-blue-600">${product.price}</span>
                    {product.originalPrice > product.price && (
                      <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
                    )}
                  </div>
                  <Link
                    to={`/products/${product.id}`}
                    className="block w-full bg-blue-600 text-white text-center py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    View Product
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Brands;
