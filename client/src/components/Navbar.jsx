import { useState, useEffect, useRef } from "react";
import { FiMenu, FiX, FiSun, FiMoon, FiSearch, FiChevronRight, FiChevronDown,FiHeart } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";

const categoriesData = [
  {
    name: "Electronics",
    link: "/electronics",
    subcategories: [
      { name: "Mobiles", link: "/mobiles" },
      { name: "Laptops", link: "/laptops" },
      { name: "Accessories", link: "/accessories" },
    ],
  },
  {
    name: "Fashion",
    link: "/fashion",
    subcategories: [
      { name: "Men's Wear", link: "/mens-wear" },
      { name: "Women's Wear", link: "/womens-wear" },
      { name: "Kids", link: "/kids-fashion" },
    ],
  },
  {
    name: "Home Appliances",
    link: "/home-appliances",
    subcategories: [
      { name: "Kitchen", link: "/kitchen" },
      { name: "Living Room", link: "/living-room" },
      { name: "Bedroom", link: "/bedroom" },
    ],
  },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const dropdownRef = useRef(null);

  // Handle theme mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

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
    <div className="flex bg-gray-100 container mx-auto px-2 py-2 items-center justify-end gap-x-4">
      {/* Favorite Button */}
      <button className="bg-white dark:bg-gray-700 p-2 rounded-full shadow-lg hover:bg-red-100 dark:hover:bg-red-700 transition">
        <FiHeart size={18} className="text-gray-600 dark:text-gray-300 hover:text-red-500" />
      </button>
      
      {/* Theme Toggle Button */}
      <button
            onClick={() => setDarkMode(!darkMode)}
            className="mr-4 p-2 rounded-full bg-white shadow-lg hover:bg-red-100 dark:bg-gray-700 transition"
          >
            {darkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
          </button>
    </div>
    <nav className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-md transition duration-300">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        
        {/* Logo */}
        <a href="/" className="text-2xl font-bold">Shop Local</a>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-6 ml-6">

          {/* Categories Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              className="flex items-center hover:text-red-400"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              Categories <FiChevronDown className="ml-1" />
            </button>

            {/* Main Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute left-0 mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 flex">
                
                {/* Category List */}
                 <div className="w-56">
                  {categoriesData.map((category, index) => (
                    <div key={index} className="relative">
                      <button
                        onClick={() => setActiveCategory(category.name === activeCategory ? null : category.name)}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex justify-between"
                      >
                        {category.name} {category.subcategories && <FiChevronRight />}
                      </button>
                    </div>
                  ))}
                </div>

                {/* Subcategories Panel (Fixed Alignment with First Category) */}
                {activeCategory && (
                  <div className="absolute top-0 left-full w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
                    {categoriesData.find(cat => cat.name === activeCategory)?.subcategories.map((sub, subIndex) => (
                      <a key={subIndex} href={sub.link} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                        {sub.name}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
          <a href="/brands" className="hover:text-red-400">Brands</a>
        </div>

        {/* Search Bar */}
        <div className="flex-1 flex justify-center">
          <div className="flex items-center border-2 border-gray-300 dark:border-gray-600 rounded-full overflow-hidden w-[280px] md:w-[500px]">
            <input
              type="text"
              placeholder="Search for products..."
              className="w-full p-2 text-sm text-gray-800 dark:text-white dark:bg-gray-700 focus:outline-none"
            />
            <button className="bg-red-600 text-white px-3 py-2 hover:bg-red-700 flex items-center gap-2">
              <FiSearch size={18} />
              <span className="hidden md:inline">Search</span>
            </button>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-6">
          {/* Avatar with Sign In */}
          <a href="/signin" className="flex items-center space-x-2 hover:text-red-400">
            <FaUserCircle size={28} />
            <span className="text-sm font-semibold">Sign In</span>
          </a>
          {/* Theme Toggle Button */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700"
          >
            {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
          </button>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden">
            {isOpen ? <FiX size={28} /> : <FiMenu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-gray-100 dark:bg-gray-800 p-4 space-y-2 transition duration-300">
          <a href="/shop" className="block hover:text-blue-400">Shop</a>
          <a href="/categories" className="block hover:text-blue-400">Categories</a>
          <a href="/contact" className="block hover:text-blue-400">Contact</a>
        </div>
      )}
    </nav>
    </>
  );
};

export default Navbar;
