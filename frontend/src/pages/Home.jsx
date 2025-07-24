import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { productService } from '../services/productService';

const Home = () => {
  const [brands, setBrands] = useState([]);
  const [loadingBrands, setLoadingBrands] = useState(true);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        // Fetch all products, extract unique brands
        const data = await productService.getAllProducts({});
        const products = data.products || data;
        const uniqueBrands = Array.from(new Set(products.map(p => p.brand).filter(Boolean)));
        setBrands(uniqueBrands.slice(0, 6));
      } catch (error) {
        setBrands([]);
      } finally {
        setLoadingBrands(false);
      }
    };
    fetchBrands();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-white text-white">
      {/* Hero */}
      <section className="relative py-20 px-6 text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-tight">
          Discover Your <br />
          <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Next Step</span>
        </h1>
        <p className="text-lg text-gray-300 max-w-xl mx-auto mb-10">
          Step into the future of fashion-forward footwear. Curated for comfort, built for performance.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-gray-200 transition-all duration-300"
        >
          Browse Collection
          <ArrowRight className="ml-2 h-5 w-5" />
        </Link>
      </section>

      {/* Lifestyle Campaign */}
      <section className="px-6 py-16 bg-white text-black">
        <h2 className="text-4xl font-bold mb-12 text-center">Live the Look</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              title: "Streetwear Staples",
              desc: "Fresh kicks built for the urban edge.",
              image: "/campaign/streetwear.jpg",
              link: "/products?category=sneakers"
            },
            {
              title: "Timeless Classics",
              desc: "Elegance crafted for every step.",
              image: "/campaign/classic.jpg",
              link: "/products?category=formal"
            }
          ].map((item, i) => (
            <div key={i} className="relative rounded-2xl overflow-hidden group">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-96 object-cover transform group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-50 transition"></div>
              <div className="absolute bottom-6 left-6 text-white">
                <h3 className="text-3xl font-bold">{item.title}</h3>
                <p className="text-sm mt-1">{item.desc}</p>
                <Link
                  to={item.link}
                  className="inline-block mt-4 px-6 py-2 bg-white text-black font-semibold rounded-full hover:bg-gray-200 transition"
                >
                  Shop Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Style by Vibe */}
      <section className="px-6 py-16 bg-gray-100 text-black">
        <h2 className="text-4xl font-bold mb-12 text-center">Shop by Vibe</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { name: 'Minimalist', image: '/vibes/minimal.jpg', link: '/products?tag=minimal' },
            { name: 'Performance', image: '/vibes/performance.jpg', link: '/products?tag=active' },
            { name: 'Bold & Bright', image: '/vibes/bright.jpg', link: '/products?tag=bold' },
            { name: 'Daily Comfort', image: '/vibes/comfort.jpg', link: '/products?tag=comfort' }
          ].map((vibe, i) => (
            <Link
              key={i}
              to={vibe.link}
              className="relative overflow-hidden rounded-xl group"
            >
              <img
                src={vibe.image}
                alt={vibe.name}
                className="w-full h-64 object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-50 transition"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-xl font-bold">{vibe.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Brands */}
      <section className="py-12 bg-gray-100 px-6 text-black">
        <h2 className="text-2xl font-bold mb-8 text-center">Shop by Brand</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 items-center">
          {loadingBrands ? (
            [...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-200 animate-pulse h-12 rounded-lg" />
            ))
          ) : brands.length > 0 ? (
            brands.map((brand, i) => (
              <Link
                key={brand || i}
                to={`/brands?q=${encodeURIComponent(brand)}`}
                className="bg-gray-100 px-6 py-4 rounded-lg text-center font-bold hover:scale-105 transition-transform"
              >
                {brand}
              </Link>
            ))
          ) : (
            <div className="col-span-6 text-center text-gray-500">No brands found.</div>
          )}
        </div>
      </section>

      {/* Newsletter */}
      {/* <section className="py-16 bg-gray-900 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">Stay in the Loop</h2>
        <p className="mb-6 text-gray-300">
          Get updates on launches, discounts, and new arrivals.
        </p>
        <div className="max-w-md mx-auto flex">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-4 py-3 rounded-l-md text-black focus:outline-none"
          />
          <button className="bg-white text-black px-6 py-3 rounded-r-md font-semibold hover:bg-gray-200 transition-colors">
            Subscribe
          </button>
        </div>
      </section> */}
    </div>
  );
};

export default Home;
