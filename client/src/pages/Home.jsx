import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiSun, FiMoon, FiShoppingCart, FiHeart, FiShoppingBag, FiShield, FiStar, FiTrendingUp } from "react-icons/fi";
import { FaFacebook, FaTwitter, FaInstagram, FaStore } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import axios from "axios";
import Cookies from "js-cookie";

import { fetchCategories, fetchSubCategories, fetchProducts } from "../api";
import { useTheme } from "../context/ThemeContext"; 
import { useSearch } from "../context/SearchContext"
import { toast } from 'react-toastify';
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";


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

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

  const { user } = useSelector((state) => state.auth);
  console.log("User:", user)
   const navigate = useNavigate()
  // const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");
  const { darkMode } = useTheme(); // Get dark mode state
  const [favouritesCount, setFavouritesCount] = useState(0)
  const [categories, setCategories] = useState([])
  const [subcategories, setSubcategories] = useState([])
  const [products, setProducts] = useState([])
  const { query } = useSearch();



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

  const filteredProducts = products.filter((product) => {
    return (
      product.name.toLowerCase().includes(query.toLowerCase())
    );
  });

  const handleFavourites = async (productId) => {

    if (!user) {
      toast.error('You must be logged in to add to favorites!');
      return;
    }
    try {
      console.log(user.id)
      // Send a request to the backend to add the product to the favorites
      const response = await axios.post(`${API_URL}/api/favorites/add/`, 
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
          <header
            className="relative isolate overflow-hidden"
            style={{
              backgroundImage: "url('/hero_images/hero_banner.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-black/20 to-black/10" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/10 dark:to-black/10" />

            <div className="relative container mx-auto px-6 py-24 md:py-32 lg:py-40">
              <div className="max-w-3xl text-center mx-auto">
                <div className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm text-white backdrop-blur-md shadow-lg mb-6">
                  Discover curated products from local shops
                </div>

                <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white leading-tight">
                  Find Your Perfect Local Products
                </h1>

                <p className="mt-5 text-base md:text-xl text-white/85 max-w-2xl mx-auto leading-relaxed">
                  Explore our local shops and their collections.
                </p>

                <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                  {/* Primary CTA */}
                  <a
                    href="/shop"
                    className="group relative inline-flex items-center gap-2 justify-center rounded-full 
                    bg-gradient-to-r from-red-600 to-red-700 
                    px-8 py-3.5 text-white font-semibold 
                    shadow-[0_10px_30px_rgba(220,38,38,0.35)]
                    transition-all duration-300 
                    hover:from-red-500 hover:to-red-600 
                    hover:scale-105 active:scale-95"
                  >
                    <FiShoppingBag size={18} />
                    <span className="relative z-10">Shop Now</span>

                    {/* subtle glow */}
                    <span className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition duration-300 bg-white/10" />
                  </a>

                  {/* Secondary CTA */}
                  {!user && (
                    <button
                      onClick={() => navigate('/vendor_register')}
                      className="inline-flex items-center gap-2 justify-center rounded-full 
                      border border-white/30 
                      bg-white/10 backdrop-blur-md 
                      px-8 py-3.5 font-semibold text-white
                      transition-all duration-300 
                      hover:bg-white hover:text-red-700 hover:scale-105"
                    >
                      <FaStore size={16} />
                      Register your business
                    </button>
                  )}
                </div>
              </div>
            </div>
          </header>

          {/* Why Us Section */}
          <section className="container mx-auto px-6 py-16">
            <div className="text-center mb-12">
              
              <h2 className="mt-5 text-2xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
                Why Shop Local?
              </h2>

              <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
                We connect you with trusted local businesses and curated products for a smarter, more reliable shopping experience.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <div className="group rounded-2xl border border-gray-200/80 dark:border-gray-700 bg-white/90 dark:bg-gray-800/80 p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-700 shadow-sm dark:bg-red-950/20 dark:text-red-300">
                  <FiShield size={22} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Trusted Local Sellers
                </h3>
                <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-400">
                  Discover verified shops and reliable sellers from your local community with more confidence.
                </p>
              </div>

              <div className="group rounded-2xl border border-gray-200/80 dark:border-gray-700 bg-white/90 dark:bg-gray-800/80 p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-700 shadow-sm dark:bg-red-950/20 dark:text-red-300">
                  <FiStar size={22} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Curated Products
                </h3>
                <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-400">
                  Explore thoughtfully selected products designed to make your shopping experience easier and better.
                </p>
              </div>

              <div className="group rounded-2xl border border-gray-200/80 dark:border-gray-700 bg-white/90 dark:bg-gray-800/80 p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-700 shadow-sm dark:bg-red-950/20 dark:text-red-300">
                  <FiTrendingUp size={22} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Support Local Growth
                </h3>
                <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-400">
                  Help local businesses grow while enjoying a more personal and community-focused marketplace.
                </p>
              </div>
            </div>
          </section>

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
                  <img src={category.image || "https://via.placeholder.com/200"} alt={category.name} className="w-32 h-32 object-cover rounded-lg border-4 border-gray-300 dark:border-gray-700 mb-3" />
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
            {filteredProducts.map((product, index) => (
              <SwiperSlide key={index}>
                <ProductCard key={product.id} product={product} updateFavouritesCount={updateFavouritesCount} type="add" />
              </SwiperSlide>
              ))} 
          </Swiper>
        </section>

         {/* Business CTA */}
        {!user && (
          <section className="py-12 px-4">
            <div className="container mx-auto">
              <div className="relative overflow-hidden rounded-3xl border border-red-200/60 dark:border-red-900/30 bg-red-50/40 dark:bg-red-950/10 0 backdrop-blur-sm shadow-[0_10px_40px_rgba(0,0,0,0.08)]">
                <div className="absolute inset-0 bg-gradient-to-r from-red-100/80 via-white to-transparent dark:from-red-950/20 dark:via-gray-900 dark:to-gray-900" />
                
                <div className="relative px-6 py-12 md:px-12 md:py-14 text-center">
                  <div className="inline-flex items-center rounded-full border border-red-100 dark:border-red-900/40 bg-red-50 dark:bg-red-950/20 px-4 py-1.5 text-sm font-medium text-red-700 dark:text-red-300 mb-5">
                    For local business owners
                  </div>

                  <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
                    Grow your business with Shop Local
                  </h2>

                  <p className="mt-4 max-w-2xl mx-auto text-base md:text-lg leading-relaxed text-gray-600 dark:text-gray-300">
                    Showcase your products, reach nearby customers, and build stronger visibility for your local store.
                  </p>

                  <button
                    onClick={() => navigate('/vendor_register')}
                    className="mt-8 inline-flex items-center rounded-full bg-red-700 px-6 py-3 text-white font-semibold shadow-md transition-all duration-300 hover:bg-red-800 hover:scale-[1.03]"
                  >
                    Register your business
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Footer */}
        {/* <Footer /> */}

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
