import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { fetchFavorites } from "../api";


const FavoriteProduct = ({ updateFavouritesCount }) => {
  const { user } = useSelector((state) => state.auth);
  console.log(user.id)
  const [favorites, setFavorites] = useState([]);
  const [type, setType] = useState([]);
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      navigate("/login"); // Redirect to login if user is null
      return;
    }

    const getFavorites = async () => {
      const data = await fetchFavorites();
      if (!data){
        console.log("No data")
        navigate('/login')
      }
      setFavorites(data);
    };
    getFavorites();
  }, [user, navigate]);

  // useEffect(() => {
  //   const fetchFavorites = async () => {
  //     try {
  //       const response = await axios.get("http://localhost:8000/api/favorites/", {
  //         withCredentials: true, // Correct way to send user ID
           
  //         });
  //         console.log(response.data)
    
  //       setFavorites(response.data.favorites);
  //     } catch (error) {
  //       console.error("Error fetching favorites:", error);
  //     }
  //   };

  //   fetchFavorites();
  // }, [user]);


  return (
    <div className="md:ml-12 mt-6 p-6 md:p-2">
      <h2 className="text-2xl font-bold text-center text-start mb-4">Favourite Products</h2>
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
        {favorites.length > 0 ? (
          favorites.map((product) => (
            <ProductCard key={product.id} product={product} updateFavouritesCount={updateFavouritesCount} type="delete" />
          ))
        ) : (
          <p className="text-center text-gray-500">No favorite products yet.</p>
        )}
      </div>
    </div>
  );
};

export default FavoriteProduct;