import { FiHeart, FiShoppingCart } from "react-icons/fi";
import { toast } from 'react-toastify';
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";

import { addToCart, fetchCart } from "../api";




const ProductCard = ({ product, updateCartCount, type, onClick, onFavoriteRemoved }) => {

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate()

  const getFullImageUrl = (image) => {
    if (!image || image === "images/default.jpg") return "https://placehold.co/200";
    if (image.startsWith("http")) return image; // full URL, leave it
    if (image.startsWith("/")) return image; // already absolute
    return `/${image}`; // add leading slash
  };
  const handleFavourites = async (productId) => {

    if (!user) {
      toast.error('You must be logged in to add to favorites!');
      navigate('/login')
      return;
    }
    try {
      console.log(user.id)
      // Send a request to the backend to add the product to the favorites
      const response = await axios.post(`${API_URL}/favorites/add/`, 
        { product: productId, },
        {
          headers: {
              "Content-Type": "application/json",
          },
          withCredentials:true
        }

      );
      if (response.status === 201) {
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
  const removeFavourites = async (productId) => {

    if (!user) {
      toast.error('You must be logged in to remove from favorites!');
      navigate('/login')
      return;
    }
    try {
      console.log(user.id)
      // Send a request to the backend to add the product to the favorites
      const response = await axios.delete(`${API_URL}/favorites/remove/${productId}/`, 
        {
          headers: {
              "Content-Type": "application/json",
          },
          withCredentials:true
        });
      if (response.status === 204) {
        onFavoriteRemoved?.(productId);
        toast.success('Product removed from favorites successfully!')
      } 
    } catch (error) {
      if (error.response && error.response.status === 404) {
        toast.error('This product is not in your favorites!');
      } else {
        toast.error('An error occurred. Please try again later.');
      }
    }
  }; 

  const refreshCartCount = async () => {
    if (!user) return;
    const cart = await fetchCart();
    updateCartCount?.(cart.total_items || 0);
  };

  const handleAddToCart = async (event, productId) => {
    event.stopPropagation();

    if (!user) {
      toast.error('You must be logged in to add to cart!');
      navigate('/login');
      return;
    }

    try {
      await addToCart(productId, 1);
      await refreshCartCount();
      toast.success('Product added to cart successfully!');
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        error.response?.data?.product?.[0] ||
        'Could not add product to cart.'
      );
    }
  };

  return (
   
    <div className="bg-white dark:bg-gray-800 h-auto flex flex-col rounded-xl shadow-lg overflow-hidden transition-transform transform hover:-translate-y-2 hover:shadow-xl group cursor-pointer"
      onClick={onClick}
    >
      {/* Product Image */}
      <div className="relative flex justify-center items-center mb-3 bg-white dark:bg-gray-800 rounded-t-xl">
        <img
          src={getFullImageUrl(product.image)}
          alt={product.name}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
        />
        {type !== "delete" && (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              handleFavourites(product.id);
            }}
            className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-red-700 shadow-md transition hover:bg-red-50 hover:scale-105 active:scale-95 dark:bg-gray-900/90 dark:text-red-300 dark:hover:bg-gray-800"
            aria-label="Add to favorites"
          >
            <FiHeart size={19} />
          </button>
        )}
      </div>

      {/* Product Details */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{product.name}</h3>
        <p className="text-gray-500 dark:text-gray-400 font-medium">Brand: {product.brandName || "N/A"}</p>
       
        {/* Where to Buy */}
        <div className="mt-4 flex-grow">
        <h3 className="text-md font-semibold dark:text-gray-100 mb-3">Where to Buy</h3>
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">
            <span className="font-semibold">Retail Store:</span> {product.retail_store || "Not Available"}
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">
            <span className="font-semibold">Online: </span> 
            <a 
              href={product.online_store} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-red-500 hover:underline"
            >
              {product.online_store ? product.online_store : " Not Available"}
            </a>
          </p>
        </div>

        {/* Add to Favorites Button */}
        {type == "delete" ? (
          <button
            onClick={(event) => {
              event.stopPropagation();
              removeFavourites(product.id);
            }}
            className="mt-4 w-full flex items-center justify-center gap-2 bg-red-700 hover:bg-red-800 text-white px-2 py-2 rounded-lg transition-all duration-300 font-semibold shadow-md hover:shadow-lg active:scale-95"
          >
            <Trash2 size={18} className="transition-transform duration-300 group-hover:scale-110" /> Remove
          </button>
        ):(
          <button
            onClick={(event) => handleAddToCart(event, product.id)}
            className="mt-4 w-full flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-white py-2.5 font-semibold text-red-700 shadow-sm transition-all duration-300 hover:bg-red-700 hover:text-white hover:shadow-md active:scale-95 dark:border-red-900 dark:bg-gray-800 dark:text-red-300 dark:hover:bg-red-700 dark:hover:text-white"
          >
            <FiShoppingCart size={18} className="transition-transform duration-300 group-hover:scale-110" /> Add to Cart
          </button>
        )
      }
      </div>
    </div>
  );
};

export default ProductCard;
