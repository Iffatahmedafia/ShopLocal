import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FiShoppingBag } from "react-icons/fi";

import ProductCard from "../../components/ProductCard";
import { fetchFavorites } from "../../api";


const FavoriteProduct = () => {
  const { user } = useSelector((state) => state.auth);
  console.log(user.id)
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      navigate("/login"); // Redirect to login if user is null
      return;
    }

    const getFavorites = async () => {
      setLoading(true);
      const data = await fetchFavorites();
      if (!data){
        console.log("No data")
        navigate('/login')
      }
      setFavorites(data);
      setLoading(false);
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


  if (loading) {
    return (
      <div className="px-4 pb-10 pt-4 sm:px-6 lg:px-8">
        <p className="text-gray-500 dark:text-gray-400">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="px-4 pb-10 pt-4 sm:px-6 lg:px-8">
      <h2 className="mb-8 text-3xl font-bold text-gray-900 dark:text-white">Favourite Products</h2>
      {favorites.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              type="delete"
              onFavoriteRemoved={(productId) => {
                setFavorites((currentFavorites) =>
                  currentFavorites.filter((item) => item.id !== productId)
                );
              }}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-gray-300 bg-white p-10 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <FiShoppingBag size={36} className="mx-auto mb-3 text-gray-400" />
          <p className="text-gray-600 dark:text-gray-300">No favorite products yet.</p>
          <button
            type="button"
            onClick={() => navigate("/products")}
            className="mt-5 rounded-lg bg-red-700 px-5 py-2 text-sm font-semibold text-white transition hover:bg-red-800"
          >
            Browse Products
          </button>
        </div>
      )}
    </div>
  );
};

export default FavoriteProduct;
