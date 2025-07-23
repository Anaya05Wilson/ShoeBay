import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ShoppingCart from './components/ShoppingCart';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import Cart from './pages/Cart';
import Brands from './pages/Brands';
import Category from './pages/Category';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/products" element={<Products />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/brands" element={<Brands />} />
                <Route path="/category" element={<Category />} />
                <Route path="/categories" element={<Category />} />
                <Route path="/search" element={<Products />} />
                <Route path="*" element={<Home />} />
              </Routes>
            </main>
            <Footer />
            <ShoppingCart />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
