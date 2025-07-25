import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { productService } from '../services/productService';
import { useCart } from '../context/CartContext';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://shoebay-backend-7uev.onrender.com/api';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const data = await productService.getProductById(id);
        setProduct(data);
      } catch (err) {
        setError('Product not found');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    // Add first available size if exists, else 'default'
    const size = product.sizes && product.sizes.length > 0 ? product.sizes[0].size : 'default';
    addToCart(product, size, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (error || !product) return <div className="min-h-screen flex items-center justify-center text-red-500">{error || 'Product not found'}</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-8 flex flex-col md:flex-row gap-8">
        <div className="flex-1 flex items-center justify-center">
          <img
            src={product.images && product.images.length > 0 ? `${API_BASE_URL.replace(/\/api$/, '')}/api/products/${product._id}/images/0` : `${API_BASE_URL.replace(/\/api$/, '')}/api/assets/domino-studio.jpg`}
            alt={product.name}
            className="w-full max-w-xs aspect-square object-cover rounded-lg"
          />
        </div>
        <div className="flex-1 space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
          <p className="text-lg text-gray-700">{product.description}</p>
          <div className="flex items-center gap-4">
            <span className="text-xl font-bold text-primary-600">${product.price}</span>
            {product.originalPrice > product.price && (
              <span className="text-base text-gray-500 line-through">${product.originalPrice}</span>
            )}
          </div>
          <div className="text-sm text-gray-500">Brand: {product.brand}</div>
          <div className="text-sm text-gray-500">Category: {product.category}</div>
          <div className="flex gap-4 mt-6">
            <button
              onClick={handleAddToCart}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-semibold"
              disabled={added}
            >
              {added ? 'Added!' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails; 
