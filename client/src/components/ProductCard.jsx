import { useState, useEffect } from "react";
import { FiHeart } from "react-icons/fi";
import { toast } from 'react-toastify';
import axios from "axios";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { fetchFavorites } from "../api";
import { Edit, Trash2 } from "lucide-react";




const ProductCard = ({ product, updateFavouritesCount, type, onClick }) => {
  const { user } = useSelector((state) => state.auth);
  const [favouritesCount, setFavouritesCount] = useState(0)
  const navigate = useNavigate()

  const getFullImageUrl = (image) => {
    if (image=="images/default.jpg") return "https://placehold.co/200"; // fallback
    if (image.startsWith("http")) return image; // full URL, leave it
    if (image.startsWith("/")) return image; // already absolute
    return `/${image}`; // add leading slash
  };
  
  
  
  const getFavorites = async () => {
    const data = await fetchFavorites();
    setFavouritesCount(data.length);
    updateFavouritesCount(data.length)
  };

  useEffect(() => {
    getFavorites();
  }, [user]);

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
  const removeFavourites = async (productId) => {

    if (!user) {
      toast.error('You must be logged in to remove from favorites!');
      navigate('/login')
      return;
    }
    try {
      console.log(user.id)
      setFavouritesCount(favouritesCount - 1);
      // updateFavouritesCount(favouritesCount + 1);
      // Send a request to the backend to add the product to the favorites
      const response = await axios.delete(`http://localhost:8000/api/favorites/remove/${productId}/`, 
        {
          headers: {
              "Content-Type": "application/json",
          },
          withCredentials:true
        });
      if (response.status === 204) {
        getFavorites();
        // setFavouritesCount(prev => prev + 1)
        // updateFavouritesCount(favouritesCount + 1); // Update the parent's state (App.js)
        toast.success('Product removed from favorites successfully!')
      } 
    } catch (error) {
      if (error.response && error.response.status === 404) {
        toast.error('This product is not in your favorites!');
      } else {
        toast.error('An error occurred. Please try again later.');
      }
      setFavouritesCount(favouritesCount + 1);
      // updateFavouritesCount(favouritesCount - 1);
    }
    updateFavouritesCount(favouritesCount)
  }; 

  return (
   
    <div className="bg-white dark:bg-gray-800 h-auto flex flex-col rounded-xl shadow-lg overflow-hidden transition-transform transform hover:-translate-y-2 hover:shadow-xl group cursor-pointer"
      onClick={onClick}
    >
      {/* Product Image */}
      <div className="flex justify-center items-center mb-3 bg-white dark:bg-gray-800 rounded-t-xl">
      <img
        src={getFullImageUrl(product.image)}
        alt={product.name}
        className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
      />
      </div>

      {/* Product Details */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{product.name}</h3>
        <p className="text-gray-500 dark:text-gray-400 font-medium">Brand: {product.brand}</p>
       
        {/* Where to Buy */}
        <div className="mt-4 flex-grow">
        <h3 className="text-md font-semibold dark:text-gray-100 mb-3">Where to Buy</h3>
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">
            <span className="font-semibold">Retail Store:</span> {product.offline_store || "Not Available"}
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
        {type == "add" ? (
        <button
          onClick={() => handleFavourites(product.id)}
          className="mt-4 w-full flex items-center justify-center gap-2 bg-red-700 hover:bg-red-800 text-white py-2 rounded-lg transition-all duration-300 font-semibold shadow-md hover:shadow-lg active:scale-95"
        >
          <FiHeart size={20} className="transition-transform duration-300 group-hover:scale-110" /> Add to Favorites
        </button>
        ):(
        <button
          onClick={() => removeFavourites(product.id)}
          className="mt-4 w-full flex items-center justify-center gap-2 bg-red-700 hover:bg-red-800 text-white px-2 py-2 rounded-lg transition-all duration-300 font-semibold shadow-md hover:shadow-lg active:scale-95"
        >
          <Trash2 size={18} className="transition-transform duration-300 group-hover:scale-110" /> Remove
        </button>
        )
      }
      </div>
    </div>
  );
};

export default ProductCard;
