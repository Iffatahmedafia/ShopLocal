import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import Fuse from "fuse.js";

import { fetchProducts, fetchBrands, fetchCategories } from "../api";
import { logInteraction } from "../utils/logInteraction.js";
import { useSearch } from "../context/SearchContext.jsx";
import ProductCard from "../components/ProductCard";
import Breadcrumb from "../components/Breadcrumb.jsx";




const Product = ({ updateFavouritesCount }) => {

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

  const { user } = useSelector((state) => state.auth);
  const { subcategoryId } = useParams();
  const { categoryId } = useParams();
  const { subsubcategoryId } = useParams();
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]); // State for selected brands
  const [selectedBrandCategories, setSelectedBrandCategories] = useState([]); // State for selected brand categories
  const [products, setProducts] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const { query, updateSearchQuery } = useSearch();

  // Load search query from URL on page load
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchQuery = params.get("search");
    if (searchQuery) {
      updateSearchQuery(searchQuery);
    } else {
      updateSearchQuery(""); // ✅ Clear if no query in URL
    }
  }, [location.search]);

  useEffect(() => {
      const getBrands = async () => {
        const data = await fetchBrands();
        setBrands(data);
      };
      getBrands();
    }, []);
  
    useEffect(() => {
      const getCategories = async () => {
        const data = await fetchCategories();
        setCategories(data);
      };
      getCategories();
    }, []);

  useEffect(() => {
    const getProducts = async () => {
      const data = await fetchProducts();
      console.log("Product Data", data)
      let filtered = data;

      if (subsubcategoryId) {
        filtered = data.filter(
          (product) => product.sub_subcategory?.id === parseInt(subsubcategoryId)
        );
      } else if (subcategoryId) {
        filtered = data.filter(
          (product) =>
            product.subcategory?.id === parseInt(subcategoryId) ||
            product.sub_subcategory?.subcategory?.id === parseInt(subcategoryId)
        );
      } else if (categoryId) {
        filtered = data.filter(
          (product) =>
            product.category?.id === parseInt(categoryId) ||
            product.subcategory?.category?.id === parseInt(categoryId) ||
            product.sub_subcategory?.subcategory?.category?.id === parseInt(categoryId)
        );
      }

      setProducts(filtered);
      if (user) {
        filtered.slice(0, 5).forEach((product) => {
          logInteraction({ userId: user.id, productId: product.id, action: "view" });
        });
      }
    };

    getProducts();
  }, [subsubcategoryId, subcategoryId, categoryId]);

  // useEffect(() => {
  //   if (user && query.trim().length > 0) {
  //     logInteraction({ userId: user.id, searchQuery: query, action: "search" });
  //   }
  // }, [query]);


  useEffect(() => {
    const fetchRecommendations = async () => {
      console.log("User state: ", user);
      if (!user) {
        console.log("No user, skipping request.");
        return;
      }
    // Mock data (remove when backend is ready)
    // const mockData = [
    //   {
    //     id: 999,
    //     name: "Test Apple Watch Ultra",
    //     image: "https://via.placeholder.com/200",
    //     price: "799.00",
    //     category: "Electronics",
    //     tags: ["smartwatch", "apple"]
    //   },
    //   {
    //     id: 998,
    //     name: "Mock Samsung Galaxy Buds",
    //     image: "https://via.placeholder.com/200",
    //     price: "129.99",
    //     category: "Electronics",
    //     tags: ["audio", "wireless"]
    //   }
    // ];
      try {
        console.log("Fetching recommendations...");
        const response = await axios.get(`${API_URL}/api/recommendations/`, {
          withCredentials: true,
        });
        console.log("Recommendation", response.data.recommendations);
        setRecommended(response.data.recommendations || []);
        // setRecommended(mockData)
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      }
    };
  
    fetchRecommendations();
  }, [user]);

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
  const getBrandName = (brandId) => {
    const brand = brands.find((b) => b.id === brandId);
    return brand ? brand.name : '';
  };
  const getCategoryName = (categoryId) => {
    const category = categories.find((c) => c.id === categoryId);
    return category ? category.name : '';
  };

  // Step 1: Apply Fuse.js if query is present
  let baseProducts = products;
  if (query.trim()) {
    const fuse = new Fuse(products, {
      keys: ["name", "brand.name", "category.name", "tags"],
      threshold: 0.4,
    });
    baseProducts = fuse.search(query).map(result => result.item);
  }
  
  // Step 2: Apply brand/category filters on top
const filteredProducts = baseProducts.filter((product) => {
  const brandName = getBrandName(product.brand_id);
  const categoryName = getCategoryName(product.category);

  const brandMatch =
    selectedBrands.length === 0 || selectedBrands.includes(brandName);
  const categoryMatch =
    selectedBrandCategories.length === 0 || selectedBrandCategories.includes(categoryName);

  return brandMatch && categoryMatch;
});
  
  

  const handleBrandSelection = (e) => {
    const value = e.target.value;
    setSelectedBrands((prevState) =>
      prevState.includes(value) ? prevState.filter((brand) => brand !== value) : [...prevState, value]
    );
  };

  const handleCategorySelection = (e) => {
    const value = e.target.value;
    setSelectedBrandCategories((prevState) =>
      prevState.includes(value) ? prevState.filter((category) => category !== value) : [...prevState, value]
    );
  };

  return (
    <div className="bg-slate dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen transition duration-300">
      <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-1/4 bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-md self-start">
          <h3 className="text-xl font-bold mb-4">Filters</h3>

          {/* Brand Filter (Checkboxes for multiple selection) */}
          <div className="mb-6">
            <h4 className="font-semibold mb-2">Brand</h4>
            {brands.map((brand) => (
              <div key={brand.id} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id={`brand-${brand.id}`}
                  value={brand.name}
                  checked={selectedBrands.includes(brand.name)}
                  onChange={handleBrandSelection}
                  className="mr-2"
                />
                <label htmlFor={`brand-${brand.id}`} className="text-sm">{brand.name}</label>
              </div>
            ))}
          </div>


          {/* Category Filter (Checkboxes for multiple selection) */}
          <div className="mb-6">
            <h4 className="font-semibold mb-2">Category</h4>
            {categories.map((category) => (
              <div key={category.id} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id={`category-${category.id}`}
                  value={category.name}
                  checked={selectedBrandCategories.includes(category.name)}
                  onChange={handleCategorySelection}
                  className="mr-2"
                />
                <label htmlFor={`category-${category.id}`} className="text-sm">{category.name}</label>
              </div>
            ))}
            </div>

          {/* Reset Filters Button */}
          <button
            className="w-full bg-red-700 hover:bg-red-800 text-white py-2 rounded-lg"
            onClick={() => {
              setSelectedBrands([]);
              setSelectedBrandCategories([]);
            }}
          >
            Reset Filters
          </button>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-6">Products</h2>
          {filteredProducts.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400 py-6">
                No products match your filters or search.
              </p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {filteredProducts.map((product) => {
                  const brandName = brands.find((brand) => brand.id == product.brand_id)?.name ||
                  "N/A"
                  return (
                    <ProductCard 
                      key={product.id} 
                      product={{ ...product, brandName }} 
                      updateFavouritesCount={updateFavouritesCount} 
                      type="add"
                      onClick={() => {
                        if (user) {
                          logInteraction({ userId: user.id, productId: product.id, action: "click" });
                        }
                      }}
                    />
                  )
                })}
              </div>
            )}
          {console.log("Recommended",recommended.length)}
          {recommended.length > 0 && (
          <div className="my-12 border-t border-gray-300 dark:border-gray-700 pt-8">
            <h3 className="text-2xl font-bold mb-4">Recommended For You</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {recommended.map((item, index) => {
                const brandName = brands.find((brand) => brand.id == item.brand_id)?.name ||
                "N/A"
                return (
                <ProductCard 
                  key={`rec-${index}`} 
                  product={{ ...item, brandName }} 
                  updateFavouritesCount={updateFavouritesCount} 
                  type="recommend"
                  onClick={() => {
                    if (user) {
                      logInteraction({ userId: user.id, productId: item.id, action: "click" });
                    }
                  }}
                />
                )
              })}
            </div>
          </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Product;
