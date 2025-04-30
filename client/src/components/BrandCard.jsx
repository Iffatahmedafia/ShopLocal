import { useState, useEffect } from "react";
import { FiHeart } from "react-icons/fi";
import { Trash2 } from "lucide-react";
import { toast } from 'react-toastify';
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const BrandCard = ({ brand, category, type }) => {
    const { user } = useSelector((state) => state.auth);
    const [favouritesCount, setFavouritesCount] = useState(0)
    const navigate = useNavigate()



    const handleSave = async (brandId) => {
        if (!user) {
            toast.error('You must be logged in to save the brand!');
            navigate('/login')
            return;
        }
        try {
            console.log(user.id)
            setFavouritesCount(favouritesCount + 1);
            // updateFavouritesCount(favouritesCount + 1);
            // Send a request to the backend to add the product to the favorites
            const response = await axios.post('http://localhost:8000/api/saved_brands/add/', 
            { brand: brandId, },
            {
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials:true
            }

            );
            if (response.status === 201) {
            // setFavouritesCount(prev => prev + 1)
            // updateFavouritesCount(favouritesCount + 1); // Update the parent's state (App.js)
            toast.success('Brand saved successfully!')
            } 
        } catch (error) {
            if (error.response && error.response.status === 400) {
            toast.error('This brand is already in saved collection!');
            } else {
            toast.error('An error occurred. Please try again later.');
            }
            setFavouritesCount(favouritesCount - 1);
            // updateFavouritesCount(favouritesCount - 1);
        }
        
        }; 
        const removeSave = async (brandId) => {

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
            const response = await axios.delete(`http://localhost:8000/api/saved_brands/remove/${brandId}/`, 
            {
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials:true
            });
            if (response.status === 204) {
            // setFavouritesCount(prev => prev + 1)
            // updateFavouritesCount(favouritesCount + 1); // Update the parent's state (App.js)
            toast.success('Brand removed from saved collection successfully!')
            } 
        } catch (error) {
            if (error.response && error.response.status === 404) {
            toast.error('This brand is not in your saved collection!');
            } else {
            toast.error('An error occurred. Please try again later.');
            }
            setFavouritesCount(favouritesCount + 1);
            // updateFavouritesCount(favouritesCount - 1);
        }
        }; 
    

  return (
    <div
        key={brand.id}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl hover:scale-[1.02] transition duration-300 flex flex-col justify-between"
        >
        <div>
            <h2 className="text-2xl font-semibold text-center text-red-700 dark:text-white mb-2">
            {brand.name}
            </h2> 
            <p className="text-gray-600 dark:text-gray-300 text-sm text-center mb-1">
            Category:{" "}
            <span className="font-medium">{category}</span>
            </p>
            <p className="text-gray-600 dark:text-gray-300 text-sm text-center mb-2">
            Province:{" "}
            <span className="font-medium">{brand.province}</span>
            </p>
        </div>
        <hr className="my-4 border-gray-300 dark:border-gray-700" />
        <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">Where to Buy</h3>
            <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Store:{" "}
                    <span className="font-normal text-gray-600 dark:text-gray-400">
                    {brand.store_address || "Not Available"}
                    </span>
                </p>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Supermarket:{" "}
                    <span className="font-normal text-gray-600 dark:text-gray-400">
                    {brand.store_address || "Not Available"}
                    </span>
                </p>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Website:{" "}
                    {brand.website_link ? (
                    <a
                        href={brand.website_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                        {new URL(brand.website_link).hostname}
                    </a>
                    ) : (
                    <span className="font-normal text-gray-600 dark:text-gray-400">
                        Not Available
                    </span>
                    )}
                </p>
                {/* Add to Save Button */}
                {type == "add" ? (
                <button
                onClick={() => handleSave(brand.id)}
                className="mt-4 w-full flex items-center justify-center gap-2 bg-red-700 hover:bg-red-800 text-white py-2 rounded-lg transition-all duration-300 font-semibold shadow-md hover:shadow-lg active:scale-95"
                >
                <FiHeart size={18} className="transition-transform duration-300 group-hover:scale-110" /> Save
                </button>
                ):(
                <button
                onClick={() => removeSave(brand.id)}
                className="mt-4 w-full flex items-center justify-center gap-2 bg-red-700 hover:bg-red-800 text-white px-2 py-2 rounded-lg transition-all duration-300 font-semibold shadow-md hover:shadow-lg active:scale-95"
                >
                <Trash2 size={18} className="transition-transform duration-300 group-hover:scale-110" /> Remove
                </button>
                )
                }
            </div>
        </div>
    </div>
      
  )
}

export default BrandCard