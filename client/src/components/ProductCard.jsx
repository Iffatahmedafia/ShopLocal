import { useState, useEffect } from "react";
import { FiHeart } from "react-icons/fi";
import { toast } from 'react-toastify';
import axios from "axios";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { fetchFavorites } from "../api";



const ProductCard = ({ product, updateFavouritesCount }) => {
  const { user } = useSelector((state) => state.auth);
  const [favouritesCount, setFavouritesCount] = useState(0)
  const navigate = useNavigate()
  
  
  
  const getFavorites = async () => {
    const data = await fetchFavorites();
    setFavouritesCount(data.length);
    updateFavouritesCount(data.length)
  };

  useEffect(() => {
    getFavorites();
  }, []);

  const handleFavourites = async (productId) => {

    if (!user) {
      toast.error('You must be logged in to add to favorites!');
      navigate('/login')
      return;
    }
    try {
      console.log(user.id)
      setFavouritesCount(favouritesCount + 1);
      // updateFavouritesCount(favouritesCount + 1);
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
        getFavorites();
        // setFavouritesCount(prev => prev + 1)
        // updateFavouritesCount(favouritesCount + 1); // Update the parent's state (App.js)
        toast.success('Product added to favorites successfully!')
      } 
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error('This product is already in your favorites!');
      } else {
        toast.error('An error occurred. Please try again later.');
      }
      setFavouritesCount(favouritesCount - 1);
      // updateFavouritesCount(favouritesCount - 1);
    }
    updateFavouritesCount(favouritesCount)
  }; 
  return (
   
    <div className="bg-white dark:bg-gray-800 h-[28rem] flex flex-col rounded-xl shadow-lg overflow-hidden transition-transform transform hover:-translate-y-2 hover:shadow-xl group">
      {/* Product Image */}
      <div className="flex justify-center items-center h-56 mb-3 bg-white dark:bg-gray-900 rounded-t-xl">
      <img
        src={product.image}
        alt={product.name}
        className="w-48 h-48 object-cover transition-transform duration-300 group-hover:scale-110"
      />
      </div>

      {/* Product Details */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{product.name}</h3>
        <p className="text-gray-500 dark:text-gray-400 font-medium">Brand: {product.brand}</p>

        {/* Where to Buy */}
        <div className="mt-3 flex-grow">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <span className="font-semibold">Offline Store:</span> {product.offline_store || "Not Available"}
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <span className="font-semibold">Online Store: </span> 
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
        <button
          onClick={() => handleFavourites(product.id)}
          className="mt-4 w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition-all duration-300 font-semibold shadow-md hover:shadow-lg active:scale-95"
        >
          <FiHeart size={20} className="transition-transform duration-300 group-hover:scale-110" /> Add to Favorites
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
