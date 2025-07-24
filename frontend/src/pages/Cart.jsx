import { Link } from 'react-router-dom';
import { Plus, Minus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Cart = () => {
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    getCartTotal,
    getCartItemsCount 
  } = useCart();

  const handleQuantityChange = (productId, size, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId, size);
    } else {
      updateQuantity(productId, size, newQuantity);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const subtotal = getCartTotal();
  const shipping = subtotal > 100 ? 0 : 10;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <ShoppingBag className="mx-auto h-24 w-24 text-gray-400 mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-gray-600 mt-2">
            {getCartItemsCount()} {getCartItemsCount() === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
          {/* Cart Items */}
          <div className="lg:col-span-7">
            <div className="bg-white shadow-sm rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-medium text-gray-900">Items in Cart</h2>
                  <button
                    onClick={clearCart}
                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    Clear Cart
                  </button>
                </div>
              </div>

              <div className="divide-y divide-gray-200">
                {cartItems.map((item) => (
                  <div key={`${item.id}-${item.size}`} className="p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <img
                          src={item.images && item.images.length > 0
                            ? `${API_BASE_URL.replace(/\/api$/, '')}/api/products/${item.id}/images/0`
                            : `${API_BASE_URL.replace(/\/api$/, '')}/api/assets/domino-studio.jpg`}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                      </div>
                      
                      <div className="ml-6 flex-1">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">
                              {item.name}
                            </h3>
                            <p className="text-sm text-gray-500">{item.brand}</p>
                            <p className="text-sm text-gray-500">Size: {item.size}</p>
                            <p className="text-lg font-semibold text-blue-600 mt-1">
                              {formatPrice(item.price)}
                            </p>
                          </div>
                          
                          <div className="flex flex-col items-end space-y-3">
                            <button
                              onClick={() => removeFromCart(item.id, item.size)}
                              className="text-red-500 hover:text-red-700 transition-colors"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                            
                            <div className="flex items-center space-x-3">
                              <button
                                onClick={() => handleQuantityChange(item.id, item.size, item.quantity - 1)}
                                className="p-1 rounded-full border border-gray-300 hover:bg-gray-50 transition-colors"
                              >
                                <Minus className="h-4 w-4" />
                              </button>
                              
                              <span className="text-lg font-medium w-8 text-center">
                                {item.quantity}
                              </span>
                              
                              <button
                                onClick={() => handleQuantityChange(item.id, item.size, item.quantity + 1)}
                                className="p-1 rounded-full border border-gray-300 hover:bg-gray-50 transition-colors"
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-4 flex justify-between items-center">
                          <span className="text-sm text-gray-500">
                            Item Total: {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-5 mt-8 lg:mt-0">
            <div className="bg-white shadow-sm rounded-lg sticky top-6">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Order Summary</h2>
              </div>
              
              <div className="px-6 py-4 space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {shipping === 0 ? 'Free' : formatPrice(shipping)}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">{formatPrice(tax)}</span>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-gray-900">Total</span>
                    <span className="text-lg font-semibold text-gray-900">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>
                
                {subtotal < 100 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-sm text-yellow-800">
                      Add {formatPrice(100 - subtotal)} more to get free shipping!
                    </p>
                  </div>
                )}
              </div>
              
              <div className="px-6 py-4 border-t border-gray-200 space-y-3">
                <Link
                  to="/checkout"
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center block"
                >
                  Proceed to Checkout
                </Link>
                
                <Link
                  to="/products"
                  className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors text-center block"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Recommended Products */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">You might also like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* This would typically fetch related products */}
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm p-4">
                <div className="aspect-square bg-gray-200 rounded-lg mb-3"></div>
                <h3 className="font-medium text-gray-900 mb-1">Sample Product {i}</h3>
                <p className="text-sm text-gray-500 mb-2">Brand Name</p>
                <p className="text-lg font-semibold text-blue-600">{formatPrice(99.99)}</p>
                <button className="w-full mt-3 bg-blue-600 text-white py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors">
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
