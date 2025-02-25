import { useState } from "react";
import { FiSun, FiMoon, FiShoppingCart, FiHeart } from "react-icons/fi";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";

const categories = [
  { name: "Electronics", image: "test.jpg" },
  { name: "Fashion", image: "test.jpg" },
  { name: "Home Appliances", image: "test.jpg" },
  { name: "Sports", image: "test.jpg" },
];

const products = [
  { name: "Smartphone", price: "$699", image: "test.jpg" },
  { name: "Laptop", price: "$1099", image: "test.jpg" },
  { name: "Headphones", price: "$199", image: "test.jpg" },
  { name: "Smart Watch", price: "$249", image: "test.jpg" },
];

const Home = () => {
  const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");

  return (
    <div className={`${darkMode ? "dark" : ""}`}>
      <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition duration-300">

        {/* Hero Section */}
        <header className="relative w-full h-[400px] bg-cover bg-center" style={{ backgroundImage: "url('/images/hero-bg.jpg')" }}>
          <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white">Find Your Perfect Style</h1>
            <p className="mt-4 text-lg text-gray-300">Explore our latest collection of products at unbeatable prices.</p>
            <a href="/shop" className="mt-6 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg">
              Shop Now
            </a>
          </div>
        </header>

        {/* Top Categories Section */}
        <section className="container mx-auto px-4 py-12">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Top Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <div key={index} className="flex flex-col items-center bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-lg transition">
                <img src={category.image} alt={category.name} className="w-20 h-20 object-cover rounded-full mb-3" />
                <p className="text-lg font-semibold">{category.name}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Top Products Section */}
        <section className="container mx-auto px-4 py-12">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Top Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-lg transition">
                <img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded-md mb-3" />
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <p className="font-bold">{product.price}</p>
                <button className="mt-3 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center justify-center gap-2">
                  <FiHeart /> Add to Favourites
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-100 dark:bg-gray-800 py-6 mt-12">
          <div className="container mx-auto text-center">
            <h3 className="text-lg font-semibold">Follow Us</h3>
            <div className="flex justify-center space-x-4 my-3">
              <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-500"><FaFacebook size={24} /></a>
              <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-500"><FaTwitter size={24} /></a>
              <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-500"><FaInstagram size={24} /></a>
            </div>
            <p className="text-gray-600 dark:text-gray-400">© 2025 Sho Local. All rights reserved.</p>
          </div>
        </footer>

        {/* Dark Mode Toggle */}
        <button
          onClick={() => {
            setDarkMode(!darkMode);
            localStorage.setItem("theme", darkMode ? "light" : "dark");
          }}
          className="fixed bottom-5 right-5 bg-gray-200 dark:bg-gray-700 p-3 rounded-full shadow-lg"
        >
          {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
        </button>
      </div>
    </div>
  );
};

export default Home;
