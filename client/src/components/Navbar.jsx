import { useState, useEffect, useRef } from "react";
import { FiMenu, FiX, FiSun, FiMoon, FiSearch, FiChevronRight, FiChevronDown,FiHeart } from "react-icons/fi";
import { FaUserCircle, FaFolder, FaList, FaShoppingBag, FaTag, FaStore, FaCogs, FaTrademark } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { MdLabel } from 'react-icons/md';   // Material Design
import { fetchCategories } from "../api";
import { fetchSubCategories, fetchFavorites } from "../api";
import { useSearch } from '../SearchContext.jsx'
import { useTheme } from "../context/ThemeContext.jsx";
import Avatar from "./Avatar";

// const categoriesData = [
//   {
//     name: "Electronics",
//     link: "/electronics",
//     subcategories: [
//       { name: "Mobiles", link: "/mobiles" },
//       { name: "Laptops", link: "/laptops" },
//       { name: "Accessories", link: "/accessories" },
//     ],
//   },
//   {
//     name: "Fashion",
//     link: "/fashion",
//     subcategories: [
//       { name: "Men's Wear", link: "/mens-wear" },
//       { name: "Women's Wear", link: "/womens-wear" },
//       { name: "Kids", link: "/kids-fashion" },
//     ],
//   },
//   {
//     name: "Home Appliances",
//     link: "/home-appliances",
//     subcategories: [
//       { name: "Kitchen", link: "/kitchen" },
//       { name: "Living Room", link: "/living-room" },
//       { name: "Bedroom", link: "/bedroom" },
//     ],
//   },
// ];

const Navbar = ({ count }) => {
  const { user } = useSelector((state) => state.auth);
  console.log("User:", user)
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false);
  // const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");
  const { darkMode, toggleDarkMode } = useTheme();
  console.log("DarkMode", darkMode)
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null); 
  const dropdownRef = useRef(null);
  const [categories, setCategories] = useState([])
  const [subcategories, setSubcategories] = useState([])
  const [favoritecount, setFavoritecount] = useState(0)
  const { query, updateSearchQuery } = useSearch();

  const handleSearch = (event) => {
    updateSearchQuery(event.target.value);
  };
  console.log(count)

  
    useEffect(() => {
      const getCategories = async () => {
        const data = await fetchCategories();
        setCategories(data);
      };
      getCategories();
    }, []);
    
  
    useEffect(() => {
      if (categories.length > 0) {
        const getSubcategories = async () => {
          const data = await fetchSubCategories();
          console.log("Fetched Data: ", data)
          setSubcategories(data);
          console.log("SubCategories: ",subcategories)
        };
        getSubcategories();
      }
    }, [categories]);
  

    useEffect(() => {
      console.log("Updated SubCategories:", subcategories); // ✅ Logs after state update
    }, [subcategories]); // ✅ Runs whenever subcategories change

    
    useEffect(() => {
      const getFavorites = async () => {
        const data = await fetchFavorites();
        setFavoritecount(data.length);
      };
      getFavorites();
    }, []);
    
  
 

  // Handle theme mode
  // useEffect(() => {
  //   if (darkMode) {
  //     document.documentElement.classList.add("dark");
  //     localStorage.setItem("theme", "dark");
  //   } else {
  //     document.documentElement.classList.remove("dark");
  //     localStorage.setItem("theme", "light");
  //   }
  // }, [darkMode]);
  // useEffect(() => {
  //   const theme = localStorage.getItem("theme") || "light"; 
  //   console.log("Theme", theme)
  //   document.documentElement.classList.toggle("dark", theme === "dark"); 
  //   setDarkMode(theme === "dark");
  // }, []); // Run only on mount

  // const toggleDarkMode = () => {
  //   setDarkMode((prevMode) => {
  //     const newMode = !prevMode;
  //     localStorage.setItem("theme", newMode ? "dark" : "light");
  //     document.documentElement.classList.toggle("dark", newMode);
  //     return newMode;
  //   });
  // };
  

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
        setActiveCategory(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
    <nav className="bg-gray-800 dark:bg-gray-800 text-gray-900 dark:text-white shadow-md px-4 py-2 flex justify-between items-center"> 
        {/* Logo */}
        <a href="/" className="text-2xl font-bold text-white ml-2 md:ml-6 whitespace-nowrap">Shop Local</a>
        {user && ( 
          <div className="dark:text-white text-xl font-semibold">
            Welcome, {user.name}
          </div>
        )}
     
        <div className="flex items-center space-x-6">
          {/* Favorite Button */}
          <button className="relative bg-white dark:bg-gray-700 p-2 rounded-full shadow-lg hover:bg-red-200 dark:hover:bg-red-700 transition">
            <FiHeart size={18} onClick={() => user? (navigate('/favorites')) : (navigate('/login'))} className="text-gray-600 dark:text-gray-300" />
            {user && count > 0 && ( 
              <span className="absolute -top-2 -right-2 bg-red-600 text-xs text-white px-2 py-1 rounded-full">{count}</span>
            )}
          </button>
          
          {/* Theme Toggle Button */}
          <button
                onClick={toggleDarkMode}
                className="mr-4 p-2 rounded-full bg-white shadow-lg hover:bg-red-200 dark:bg-gray-700 transition"
              >
                {darkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
          </button>
        </div>
    </nav>
    <nav className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-md transition duration-300">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
             
        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-6 ml-6">

          {/* Categories Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              className="flex items-center hover:text-red-600"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <FaList size={18} className="mr-2" />Categories <FiChevronDown className="ml-1" />
            </button>

            {/* Main Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute left-0 mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 flex">
                
                {/* Category List */}
                 <div className="w-56">
                  {categories.map((category) => (
                    <div key={category.id} className="relative">
                      <button
                        onClick={() => setActiveCategory(category.name === activeCategory ? null : category.name)}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex justify-between"
                      >
                        {category.name} {subcategories && <FiChevronRight />}
                      </button>
                    </div>
                  ))}
                </div>

                {/* Subcategories Panel (Fixed Alignment with First Category) */}
                {activeCategory && (
                  <div className="absolute top-0 left-full w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
                    {subcategories
                    .filter(sub => sub.category.name === activeCategory)
                    .map((sub) => (
                      <button onClick={() => navigate(`/products/${sub.id}`)} className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                        {sub.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
          <a href="/brands" className="hover:text-red-600 flex items-center">
            <FaTag size={18} className="mr-2" />
             Brands
          </a>
        </div>

        {/* Search Bar */}
        <div className="flex-1 flex md:justify-center px-2">
          <div className="flex items-center border-2 border-gray-300 dark:border-gray-600 rounded-full overflow-hidden w-full max-w-sm md:w-96">
            <input
              type="text"
              placeholder="Search for products..."
              className="w-full p-2 text-sm text-gray-800 dark:text-white dark:bg-gray-700 focus:outline-none"
              value={query}
              onChange={handleSearch}
            />
            <button className="bg-red-700 px-4 py-2 text-white rounded-r-lg hover:bg-red-800">
            Search
          </button>
            {/* <button className="bg-red-600 text-white px-3 py-2 hover:bg-red-700 flex items-center gap-2">
              <FiSearch size={18} />
              <span className="hidden md:inline">Search</span>
            </button> */}
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-6">
          {/* <a href="/vendor_register" className="hidden md:flex items-center underline md:text-red-500 hover:text-red-600 text-underline flex items-center">
              Register your business
          </a> */}
          {user? (<Avatar />):
          (
          // Avatar with Sign In 
          <a href="/login" className="hidden md:flex items-center space-x-2 hover:text-red-600">
            <FaUserCircle size={28} />
            <span className="text-sm font-semibold hidden sm:inline">Sign In</span>
          </a>
          )}
          {!user &&
           <button
              type="button"
              onClick={() => navigate('/vendor_register')}
              className="hidden md:flex items-center bg-red-700 hover:bg-red-600 text-white px-3 py-2 rounded-full transition"
            >
               Register your business
          </button>
          }
          {/* Theme Toggle Button
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700"
          >
            {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
          </button> */}

          {/* Mobile Menu Button */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden">
            {isOpen ? <FiX size={28} /> : <FiMenu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-gray-100 dark:bg-gray-800 p-4 space-y-2 transition duration-300">
          <button
              type="button"
              onClick={() => navigate('/vendor_register')}
              className="w-full flex items-center justify-center bg-red-700 hover:bg-red-600 text-white py-2 transition"
            >
               Register your business
          </button>
          
          {/* Categories Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              className="flex items-center hover:text-red-600"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              Categories <FiChevronDown className="ml-1" />
            </button>

            {/* Main Dropdown Menu */}
            {dropdownOpen && (
              <div className="mt-2 space-y-2 bg-gray-100 dark:bg-gray-800 rounded-md p-2">
                {categories.map((category) => (
                  <div key={category.id} className="relative">
                    <button
                      onClick={() =>
                        setActiveCategory(activeCategory === category.name ? null : category.name)
                      }
                      className="w-full text-left flex items-center justify-between px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md"
                    >
                      {category.name}
                      {/* Show chevron only if the category has subcategories */}
                      {subcategories.some((sub) => sub.category.name === category.name) && (
                        <FiChevronDown
                          className={`ml-1 transition-transform ${
                            activeCategory === category.name ? "rotate-180" : ""
                          }`}
                        />
                      )}
                    </button>

                    {/* Subcategories Panel (Expands under clicked category) */}
                    {activeCategory === category.name && (
                      <div className="ml-6 mt-1 space-y-1">
                        {subcategories
                          .filter((sub) => sub.category.name === category.name)
                          .map((sub) => (
                            <button
                              key={sub.id}
                              onClick={() => navigate(`/products/${sub.id}`)}
                              className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                              {sub.name}
                            </button>
                          ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          <a href="/brands" className="flex items-center hover:text-red-600">Brands</a>
          <hr className="my-4 border-gray-300 dark:border-gray-700" />
          <div className="flex items-center justify-center">
            <button
                type="button"
                onClick={() => navigate('/login')}
                className="bg-gray-300 hover:bg-gray-400 text-red-700 px-2 py-2 rounded-lg transition"
              >
                Sign In
            </button>
          </div>
          <p className="mt-4 text-center text-gray-700 dark:text-gray-300">
            Don't have an account?{" "}
          <a href="/register" className="text-red-500 hover:underline">Sign Up</a>
          {/* <Link to="/signup" className="text-red-500 hover:underline">
            Sign Up
          </Link> */}
          </p>
        </div>
      )}
    </nav>
    </>
  );
};

export default Navbar;
