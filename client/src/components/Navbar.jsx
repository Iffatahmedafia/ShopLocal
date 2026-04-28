import { useState, useEffect, useRef } from "react";
import { FiMenu, FiX, FiSun, FiMoon, FiSearch, FiChevronRight, FiChevronDown,FiHeart } from "react-icons/fi";
import { FaUserCircle, FaFolder, FaList, FaShoppingBag, FaTag, FaStore, FaCogs, FaTrademark } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { MdLabel } from 'react-icons/md';   // Material Design

import { fetchCategories, fetchSubCategories, fetchFavorites, fetchSubSubCategories } from "../api";
import { logInteraction } from "../utils/logInteraction.js";
import { useSearch } from "../context/SearchContext.jsx"
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
  const [activeSubCategory, setActiveSubCategory] = useState(null);
  const dropdownRef = useRef(null);
  const [categories, setCategories] = useState([])
  const [subcategories, setSubcategories] = useState([])
  const [subsubcategories, setSubSubcategories] = useState([])
  const [favoritecount, setFavoritecount] = useState(0)
  const { query, updateSearchQuery } = useSearch();

  const handleSearch = (event) => {
    updateSearchQuery(event.target.value);
  };
 

  const handleSearchClick = () => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;
  
    if (user) {
      logInteraction({ userId: user.id, searchQuery: trimmedQuery, action: "search" });
    }
  
    navigate(`/products?search=${encodeURIComponent(trimmedQuery)}`);
  };
  
  
    useEffect(() => {
      const getCategories = async () => {
        const data = await fetchCategories();
        console.log("Fetched Category Data: ", data)
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
      if (subcategories.length > 0) {
        const getSubSubcategories = async () => {
          const data = await fetchSubSubCategories();
          console.log("Fetched sub_subcategories Data: ", data)
          setSubSubcategories(data);
          console.log("SubSubCategories: ",subsubcategories)
        };
        getSubSubcategories();
      }
    }, [subcategories]);
  

    useEffect(() => {
      console.log("Updated SubCategories:", subcategories); // ✅ Logs after state update
    }, [subcategories]); // ✅ Runs whenever subcategories change

    
    useEffect(() => {
      const getFavorites = async () => {
        if (user) {
          const data = await fetchFavorites();
          setFavoritecount(data.length);
        }
      };
    
      getFavorites();
    }, [user]); 
  
 

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

  const handleNavigate = ({ categoryId, subcategoryId, subsubcategoryId }) => {
    if (subsubcategoryId) {
      navigate(`/products/sub/${subsubcategoryId}`);
    } else if (subcategoryId) {
      navigate(`/products/subcategory/${subcategoryId}`);
    } else if (categoryId) {
      navigate(`/products/category/${categoryId}`);
    }
  };
  

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
    <nav className="bg-[#0f1c2e] border-b border-white/10 dark:text-white backdrop-blur-md shadow-sm px-4 py-2 flex justify-between items-center"> 
        {/* Logo */}
        <Link to="/" className="text-xl font-bold ml-2 md:ml-6 whitespace-nowrap text-white">
         Shop <span className="text-red-600">Local</span>
        </Link>
        {/* {user && ( 
          <div className="text-lg font-semibold text-white">
            Welcome, {user.name}
          </div>
        )} */}
     
        <div className="flex items-center space-x-6">
          {/* Favorite Button */}
          <button className="relative bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg hover:bg-red-200 dark:hover:bg-red-700 transition">
            <FiHeart size={16} onClick={() => user? (navigate('/favorites')) : (navigate('/login'))} className="text-gray-600 dark:text-gray-300" />
            {user && count > 0 && ( 
              <span className="absolute -top-2 -right-2 bg-red-600 text-xs text-white px-2 py-1 rounded-full">{count}</span>
            )}
          </button>
          
          {/* Theme Toggle Button */}
          <button
                onClick={toggleDarkMode}
                className="mr-4 p-2 rounded-full bg-white shadow-lg hover:bg-red-200 dark:bg-gray-800 dark:hover:bg-red-700 transition"
              >
                {darkMode ? <FiSun size={16} /> : <FiMoon size={18} />}
          </button>
        </div>
    </nav>
    <nav className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-md border-b border-gray-300 dark:border-gray-700 transition duration-300">
      <div className="px-4 py-3 flex justify-between items-center">
             
        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-2">

          {/* Categories Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-red-50 hover:text-red-700 dark:text-gray-200 dark:hover:bg-gray-800 dark:hover:text-red-400"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <FaList size={18} className="mr-1" />Categories <FiChevronDown className="ml-1" />
            </button>

            {/* Main Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute left-0 mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-50 flex">
                
                {/* Category List */}
                <div className="w-56">
                  {categories.map((category) => (
                    <div key={category.id} className="relative">
                      <button
                        onClick={() => {setActiveCategory(category.name === activeCategory ? null : category.name)
                          setActiveSubCategory(null); // clear subcategory
                        }
                        }
                        className="block w-full text-left text-sm font-medium px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex justify-between"
                      >
                        {category.name} {subcategories.some(sub => sub.category.id === category.id) && <FiChevronRight />}
                      </button>
                    </div>
                  ))}
                </div>

                {/* Subcategories Panel (Fixed Alignment with First Category) */}
                {activeCategory && (
                <div className="absolute top-0 left-full flex items-start">
                  {/* Subcategory Panel */}
                  <div className="w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-50">
                    {subcategories
                      .filter(sub => sub.category.name === activeCategory)
                      .map((sub) => (
                        <button
                          key={sub.id}
                          onClick={() => {
                            setActiveSubCategory(sub.id === activeSubCategory ? null : sub.id)
                            handleNavigate({ subcategoryId: sub.id });
                          }
                          }
                          className="block w-full text-sm font-medium text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex justify-between items-center"
                        >
                          {sub.name}
                          {subsubcategories.some(subsub => subsub.subcategory.id === sub.id) && <FiChevronRight />}
                        </button>
                      ))}
                  </div>

                  {/* Sub-subcategory Panel */}
                  {activeSubCategory && (
                    <div className="w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
                      {subsubcategories
                        .filter(subsub => subsub.subcategory.id === activeSubCategory)
                        .map((subSub) => (
                          <button
                            key={subSub.id}
                            onClick={() => handleNavigate({ subsubcategoryId: subSub.id })}
                            className="block w-full text-left text-sm font-medium px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            {subSub.name}
                          </button>
                        ))}
                    </div>
                  )}
                </div>
                )}  
              </div>
            )}
          </div>
          <Link to="/brands" className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-red-50 hover:text-red-700 dark:text-gray-200 dark:hover:bg-gray-800 dark:hover:text-red-400">
            <FaTag size={18} className="mr-1" />
             Brands
          </Link>
          {!user && (
          <button
            type="button"
            onClick={() => navigate('/vendor_register')}
            className="ml-2 inline-flex items-center rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 transition-all duration-300 hover:bg-red-700 hover:text-white hover:border-red-700"
          >
            Register your business
          </button>
        )}
        </div>

        {/* Search Bar */}
        <div className="flex-1 flex md:justify-center px-2 md:px-4">
          <div className="group flex items-center w-full max-w-full sm:max-w-md md:max-w-xl lg:max-w-2xl rounded-full border border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-gray-900/80 shadow-[0_8px_30px_rgba(0,0,0,0.08)] backdrop-blur-md transition-all duration-300 focus-within:border-red-500 focus-within:shadow-[0_10px_35px_rgba(185,28,28,0.18)] hover:shadow-[0_10px_35px_rgba(0,0,0,0.12)]">
            <div className="pl-4 pr-2 text-gray-400 dark:text-gray-500 transition-colors duration-300 group-focus-within:text-red-600">
              <FiSearch size={20} />
            </div>

            <input
              type="text"
              placeholder="Search for products..."
              className="w-full bg-transparent py-3 pr-2 text-sm sm:text-base text-gray-800 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none"
              value={query}
              onChange={handleSearch}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearchClick();
              }}
            />

            <button
              onClick={handleSearchClick}
              className="m-1.5 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-red-600 to-red-700 px-4 sm:px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:scale-[1.03] hover:from-red-700 hover:to-red-800 active:scale-[0.98]"
            >
              <FiSearch size={16} className="sm:hidden" />
              <span className="hidden sm:inline">Search</span>
            </button>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-3 md:space-x-5">
          {/* <a href="/vendor_register" className="hidden md:flex items-center underline md:text-red-500 hover:text-red-600 text-underline flex items-center">
              Register your business
          </a> */}
          {user ? (
            <div className="flex items-center">
              <Avatar />
            </div>
          ) 
        :
          (
          // Avatar with Sign In 
          <Link to="/login" className="hidden md:flex items-center space-x-1 hover:text-red-700">
            <FaUserCircle size={32} />
            <span className="text-sm font-medium hidden sm:inline">Sign In</span>
          </Link>
          )}
          {/* {!user &&
           <button
              type="button"
              onClick={() => navigate('/vendor_register')}
              className="hidden md:flex items-center bg-red-700 hover:bg-red-800 text-white px-3 py-2 rounded-full transition"
            >
               Register your business
          </button>
          } */}
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
      {isOpen &&  (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-xl">
          <div className="px-4 py-5 space-y-5">
            {/* Register Button */}
            {!user && (
              <button
                type="button"
                onClick={() => navigate('/vendor_register')}
                className="w-full inline-flex items-center justify-center rounded-full 
                bg-red-700 px-5 py-3 text-sm font-semibold text-white 
                shadow-md transition-all duration-300 
                hover:bg-red-800 active:scale-[0.98]"
              >
                Register your business
              </button>
            )}
                
            {/* Categories Dropdown */}
            <div className="relative font-medium" ref={dropdownRef}>
              <button
                className="flex items-center hover:text-red-700"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                Categories <FiChevronDown className="ml-1" />
              </button>

              {/* Main Dropdown Menu */}
              {dropdownOpen && (
                <div className="mt-2 space-y-2 bg-white dark:bg-gray-800 rounded-md p-2">
                  {categories.map((category) => (
                    <div key={category.id} className="relative">
                      <button
                        onClick={() => {
                          setActiveCategory(category.name === activeCategory ? null : category.name)
                          setActiveSubCategory(null); // clear subcategory
                        }        
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
                              <div key={sub.id} className="relative">
                                <button
                                  onClick={() => {
                                    setActiveSubCategory(sub.id === activeSubCategory ? null : sub.id)
                                    handleNavigate({ subcategoryId: sub.id });
                                  }}
                                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex justify-between items-center"
                                >
                                  {sub.name}
                                  {/* Show chevron only if the category has subcategories */}
                                  {subsubcategories.some((subsub) => subsub.subcategory.name === sub.name) && (
                                    <FiChevronDown
                                      className={`ml-1 transition-transform ${
                                        activeSubCategory === sub.id ? "rotate-180" : ""
                                      }`}
                                    />
                                  )}
                                </button>

                                {/* Sub-subcategories */}
                                {activeSubCategory === sub.id && (
                                  <div className="ml-6 mt-1 space-y-1">
                                    {subsubcategories
                                      .filter((subsub) => subsub.subcategory.name === sub.name)
                                      .map((subsub) => (
                                        <button
                                          key={subsub.id}
                                          onClick={() => handleNavigate({ subsubcategoryId: subsub.id })}
                                          className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                                        >
                                          {subsub.name}
                                        </button>
                                      ))}
                                  </div>
                                )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* Brands */}
            <Link to="/brands" className="flex font-medium items-center hover:text-red-700">
              Brands
            </Link>

            {/* Auth Section */}
            {!user && (
              <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-800/70 p-4 text-center">
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="w-full rounded-full 
                  bg-gray-900 px-5 py-3 text-sm font-semibold text-white 
                  shadow-sm transition-all duration-300 
                  hover:bg-red-700 active:scale-[0.98] 
                  dark:bg-white dark:text-gray-900 
                  dark:hover:bg-red-700 dark:hover:text-white"
                >
                  Sign In
                </button>

                <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
                  Don&apos;t have an account?{" "}
                  <Link to="/register" className="font-semibold text-red-600 hover:underline">
                    Sign Up
                  </Link>
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
    </>
  );
};

export default Navbar;
