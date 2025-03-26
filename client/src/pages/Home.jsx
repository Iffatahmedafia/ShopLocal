import { useState, useEffect } from "react";
import { FiSun, FiMoon, FiShoppingCart, FiHeart } from "react-icons/fi";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";
import Navbar from "../components/Navbar"
import { useSelector } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { fetchCategories } from "../api";
import { fetchSubCategories } from "../api";
import { fetchProducts } from "../api";
import { toast } from 'react-toastify';
import axios from "axios";
import Cookies from "js-cookie";
import ProductCard from "../components/ProductCard";

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

const Home = ({ updateFavouritesCount }) => {
  const { user } = useSelector((state) => state.auth);
  console.log("User:", user)
  const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");
  const [favouritesCount, setFavouritesCount] = useState(0)
  const [categories, setCategories] = useState([])
  const [subcategories, setSubcategories] = useState([])
  const [products, setProducts] = useState([])



  useEffect(() => {
    const getCategories = async () => {
      const data = await fetchCategories();
      setCategories(data);
    };
    getCategories();
  }, []);
  

  useEffect(() => {
    const getSubcategories = async () => {
      const data = await fetchSubCategories();
      setSubcategories(data);
    };
    getSubcategories();
  }, []);

  useEffect(() => {
    if (categories.length > 0) {
      const getProducts = async () => {
        const data = await fetchProducts();
        console.log("Products:", data)
        setProducts(data);
      };
      getProducts();
  }
  }, [categories]);

  const handleFavourites = async (productId) => {

    if (!user) {
      toast.error('You must be logged in to add to favorites!');
      return;
    }
    try {
      console.log(user.id)
      // Send a request to the backend to add the product to the favorites
      const response = await axios.post('http://localhost:8000/api/favorites/add/', 
        { product: productId, },
        {
          headers: {
              "Content-Type": "application/json",
          },
          withCredentials:true
        }

      );

      if (response.status === 201) {
        setFavouritesCount(prev => prev + 1)
        updateFavouritesCount(favouritesCount + 1); // Update the parent's state (App.js)
        toast.success('Product added to favorites successfully!')
      } 
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error('This product is already in your favorites!');
      } else {
        toast.error('An error occurred. Please try again later.');
      }
    }
  }; 
  


  return (
    <>
    <div className={`${darkMode ? "dark" : ""}`}>
      <div className="bg-slate dark:bg-gray-900 text-gray-900 dark:text-white transition duration-300">

        {/* Hero Section */}
        <header className="relative w-full h-[400px] bg-cover bg-center" style={{ backgroundImage: "url('/images/hero-bg.jpg')" }}>
          <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white">Find Your Perfect Style</h1>
            <p className="mt-4 text-lg text-gray-300">Explore our latest collection of products at unbeatable prices.</p>
            <a href="/shop" className="mt-6 px-6 py-3 bg-red-700 hover:bg-red-600 text-white font-semibold rounded-lg">
              Shop Now
            </a>
          </div>
        </header>

        {/* Top Categories Section */}
        <section className="container mx-auto px-4 py-12">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Top Categories</h2>
          <Swiper
            spaceBetween={20}
            slidesPerView={2} // Show 2 slides on small screens
            breakpoints={{
              768: { slidesPerView: 4 }, // Show 4 slides on larger screens
            }}
            pagination={{ clickable: true }}
            modules={[Pagination]}
            className="pb-16" // Space for dots
          >
            {categories.map((category, index) => (
              <SwiperSlide key={index}>
                <div className="flex flex-col items-center bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-lg transition">
                  <img src={category.image} alt={category.name} className="w-32 h-32 object-cover rounded-lg border-4 border-gray-300 dark:border-gray-700 mb-3" />
                  <p className="text-lg font-semibold">{category.name}</p>
                </div>
              </SwiperSlide>
              ))}
          </Swiper>
          {/* Swiper Pagination - Inline Style */}
          <style>
            {`
              .swiper-pagination {
                position: relative !important;
                margin-top: 15px;
              }

              .swiper-pagination-bullet {
                background-color: gray !important;
                width: 10px;
                height: 10px;
                opacity: 0.5;
                transition: all 0.3s ease;
              }

              .swiper-pagination-bullet-active {
                background-color: red !important;
                opacity: 1;
              }
            `}
          </style>
        </section>

        {/* Top Products Section */}
        <section className="container mx-auto px-4 py-12">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Top Products</h2>
          <Swiper
            spaceBetween={20}
            slidesPerView={2} // Show 2 slides on small screens
            breakpoints={{
              768: { slidesPerView: 4 }, // Show 4 slides on larger screens
            }}
            pagination={{ clickable: true }}
            modules={[Pagination]}
            className="pb-16" // Space for dots
            >
            {products.map((product, index) => (
              <SwiperSlide key={index}>
                <ProductCard key={product.id} product={product} updateFavouritesCount={updateFavouritesCount} />
              </SwiperSlide>
              ))} 
          </Swiper>
        </section>

        {/* Footer */}
        <footer className="bg-gray-800 dark:bg-gray-800 py-6 mt-12">
          <div className="container mx-auto text-center">
            <h3 className="text-lg text-white font-semibold">Follow Us</h3>
            <div className="flex justify-center space-x-4 my-3">
              <a href="#" className="text-gray-100 dark:text-gray-300 hover:text-red-600"><FaFacebook size={24} /></a>
              <a href="#" className="text-gray-100 dark:text-gray-300 hover:text-red-600"><FaTwitter size={24} /></a>
              <a href="#" className="text-gray-100 dark:text-gray-300 hover:text-red-600"><FaInstagram size={24} /></a>
            </div>
            <p className="text-gray-200 dark:text-gray-400">© 2025 Shop Local. All rights reserved.</p>
          </div>
        </footer>

        {/* Dark Mode Toggle
        <button
          onClick={() => {
            setDarkMode(!darkMode);
            localStorage.setItem("theme", darkMode ? "light" : "dark");
          }}
          className="fixed bottom-5 right-5 bg-gray-200 dark:bg-gray-700 p-3 rounded-full shadow-lg"
        >
          {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
        </button> */}
      </div>
    </div>
    </>
  );
};

export default Home;
