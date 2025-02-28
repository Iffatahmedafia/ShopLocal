import { useState } from "react";
import { FiShoppingCart, FiHeart } from "react-icons/fi";
import Navbar from "../components/Navbar"

const allProducts = [
  { id: 1, name: "Smartphone", price: 699, brand: "Apple", image: "test.jpg" },
  { id: 2, name: "Laptop", price: 1099, brand: "Dell", image: "test.jpg" },
  { id: 3, name: "Headphones", price: 199, brand: "Sony", image: "test.jpg" },
  { id: 4, name: "Smart Watch", price: 249, brand: "Samsung", image: "test.jpg" },
  { id: 5, name: "Gaming Console", price: 499, brand: "Sony", image: "test.jpg" },
];

const brands = ["Apple", "Dell", "Sony", "Samsung"];

const Product = () => {
  const [priceRange, setPriceRange] = useState(1500);
  const [selectedBrand, setSelectedBrand] = useState("");

  // Filter products dynamically
  const filteredProducts = allProducts.filter(
    (product) => product.price <= priceRange && (selectedBrand === "" || product.brand === selectedBrand)
  );

  return (
    <>
    <Navbar />
    <div className="bg-slate dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen transition duration-300">
      <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-1/4 bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-4">Filters</h3>

          {/* Price Filter */}
          <div className="mb-6">
            <label className="block font-semibold">Price: ${priceRange}</label>
            <input
              type="range"
              min="100"
              max="1500"
              step="50"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full mt-2"
            />
          </div>

          {/* Brand Filter */}
          <div className="mb-6">
            <label className="block font-semibold">Brand</label>
            <select
              className="w-full mt-2 p-2 bg-white dark:bg-gray-700 rounded-md"
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
            >
              <option value="">All Brands</option>
              {brands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
          </div>

          {/* Reset Filters Button */}
          <button
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg"
            onClick={() => {
              setPriceRange(1500);
              setSelectedBrand("");
            }}
          >
            Reset Filters
          </button>
        </aside>
        {/* Product Grid */}
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-6">Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-lg transition relative">
                {/* Favorite Button */}
                <button className="absolute top-2 right-2 bg-white dark:bg-gray-700 p-2 rounded-full shadow-lg hover:bg-red-100 dark:hover:bg-red-700 transition">
                  <FiHeart size={20} className="text-gray-600 dark:text-gray-300 hover:text-red-500" />
                </button>

                {/* Product Image */}
                <img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded-md mb-3" />
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <p className="text-blue-600 font-bold">${product.price}</p>
                <p className="text-blue-600 font-bold">offline store</p>
                <p className="text-blue-600 font-bold">online link</p>
              </div>
            ))}
          </div>
        </div>

        
      </div>
    </div>
    </>
  );
};

export default Product;
