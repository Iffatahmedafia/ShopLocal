import { useState, useEffect } from "react";
import { FiShoppingCart, FiHeart } from "react-icons/fi";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "../components/Navbar"
import { fetchProducts } from "../api";
import ProductCard from "../components/ProductCard";
import { useSearch } from '../SearchContext.jsx';

const allProducts = [
  { id: 1, name: "Smartphone", price: 699, brand: "Apple", image: "test.jpg" },
  { id: 2, name: "Laptop", price: 1099, brand: "Dell", image: "test.jpg" },
  { id: 3, name: "Headphones", price: 199, brand: "Sony", image: "test.jpg" },
  { id: 4, name: "Smart Watch", price: 249, brand: "Samsung", image: "test.jpg" },
  { id: 5, name: "Gaming Console", price: 499, brand: "Sony", image: "test.jpg" },
];

const brands = ["Apple", "Dell", "Sony", "Samsung"];

const Product = ({ updateFavouritesCount }) => {
  const { user } = useSelector((state) => state.auth);
  const { subcategoryId } = useParams();
  const { categoryId } = useParams();
  const { subsubcategoryId } = useParams();
  const [priceRange, setPriceRange] = useState(1500);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [products, setProducts] = useState([])
  const { query } = useSearch();

  useEffect(() => {
    const getProducts = async () => {
      const data = await fetchProducts();
      let filtered = data;
  
      if (subsubcategoryId) {
        filtered = data.filter(
          (product) => product.sub_subcategory?.id === parseInt(subsubcategoryId)
        );
        console.log("Filtered by sub-subcategory:", filtered);
      } else if (subcategoryId) {
        filtered = data.filter(
          (product) =>
            product.subcategory?.id === parseInt(subcategoryId) ||
            product.sub_subcategory?.subcategory?.id === parseInt(subcategoryId)
        );
        console.log("Filtered by subcategory:", filtered);
      } else if (categoryId) {
        filtered = data.filter(
          (product) =>
            product.category?.id === parseInt(categoryId) ||
            product.subcategory?.category?.id === parseInt(categoryId) ||
            product.sub_subcategory?.subcategory?.category?.id === parseInt(categoryId)
        );
        console.log("Filtered by category:", filtered);
      } else {
        console.log("No filtering, all products shown.");
      }
  
      setProducts(filtered);
    };
  
    getProducts();
  }, [subsubcategoryId, subcategoryId, categoryId]);
  
  
  

  const handleFavourites = async (productId) => {

    if (!user) {
      toast.error('You must be logged in to add to favorites!');
      return;
    }
    try {
      console.log(user.id)
      
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error('This product is already in your favorites!');
      } else {
        toast.error('An error occurred. Please try again later.');
      }
    }
  }; 
  
 

  // Filter products dynamically
  const filteredProducts = products.filter(
    (product) =>
      product.price <= priceRange &&
      (selectedBrand === "" || product.brand === selectedBrand) &&
      (product.name.toLowerCase().includes(query.toLowerCase()) || product.brand.toLowerCase().includes(query.toLowerCase())) // Apply search query filter
  );

  return (
    <>
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
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} updateFavouritesCount={updateFavouritesCount} type="add" />
            ))}
          </div>
        </div>

        
      </div>
    </div>
    </>
  );
};

export default Product;
