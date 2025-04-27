import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import { fetchProducts, fetchBrands, fetchCategories } from "../api";
import { logInteraction } from "../utils/logInteraction.js";
import ProductCard from "../components/ProductCard";
import { useSearch } from '../SearchContext.jsx';



const Product = ({ updateFavouritesCount }) => {
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
  const { query } = useSearch();

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

  useEffect(() => {
    if (user && query.trim().length > 0) {
      logInteraction({ userId: user.id, searchQuery: query, action: "search" });
    }
  }, [query]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!user) return;
      // Mock data (remove when backend is ready)
    const mockData = [
      {
        id: 999,
        name: "Test Apple Watch Ultra",
        image: "https://via.placeholder.com/200",
        price: "799.00",
        category: "Electronics",
        tags: ["smartwatch", "apple"]
      },
      {
        id: 998,
        name: "Mock Samsung Galaxy Buds",
        image: "https://via.placeholder.com/200",
        price: "129.99",
        category: "Electronics",
        tags: ["audio", "wireless"]
      }
    ];
      try {
        // const response = await axios.get("/api/recommendations/");
        // setRecommended(response.data.recommendations || []);
        setRecommended(mockData);
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
  
  const filteredProducts = products.filter((product) => {
    const brandName = getBrandName(product.brand_id);
    const categoryName = product.category?.name ?? '';
  
    return (
      (selectedBrands.length === 0 || selectedBrands.includes(brandName)) &&
      (selectedBrandCategories.length === 0 || selectedBrandCategories.includes(categoryName)) &&
      (
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        brandName.toLowerCase().includes(query.toLowerCase())
      )
    );
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
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg"
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
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {filteredProducts.map((product) => {
            console.log("Product Rendering", product);
            return (
              <ProductCard 
                key={product.id} 
                product={product} 
                updateFavouritesCount={updateFavouritesCount} 
                type="add"
                onClick={() => logInteraction({ userId: user?.id, productId: product.id, action: "click" })}
              />
            );
          })}
          </div>
          {console.log("Recommended",recommended.length)}
          {recommended.length > 0 && (
          <div className="my-12 border-t border-gray-300 dark:border-gray-700 pt-8">
            <h3 className="text-2xl font-bold mb-4">Recommended For You</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {recommended.map((item, index) => (
                <ProductCard 
                  key={`rec-${index}`} 
                  product={item} 
                  updateFavouritesCount={updateFavouritesCount} 
                  type="recommend"
                  onClick={() => logInteraction({ userId: user?.id, productId: item.id, action: "click" })}
                />
              ))}
            </div>
          </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Product;
