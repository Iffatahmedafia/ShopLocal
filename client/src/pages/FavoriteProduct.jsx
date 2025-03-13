import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ProductCard from "../components/ProductCard";

const FavoriteProduct = () => {
  const { user } = useSelector((state) => state.auth);
  console.log(user.id)
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/favorites/", {
          withCredentials: true, // Correct way to send user ID
           
          });
          console.log(response.data)
    
        setFavorites(response.data.favorites);
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };

    fetchFavorites();
  }, [user]);

  const handleFavourites = async () => {
    console.log("Product")

  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold text-center mb-8">My Favorite Products</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {favorites.length > 0 ? (
          favorites.map((product) => (
            <ProductCard key={product.id} product={product} handleFavourites={handleFavourites} />
          ))
        ) : (
          <p className="text-center text-gray-500">No favorite products yet.</p>
        )}
      </div>
    </div>
  );
};

export default FavoriteProduct;