import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { fetchSavedBrands, fetchCategories } from "../../api"
import BrandCard from "../../components/BrandCard";



const SavedBrands = () => {
  const { user } = useSelector((state) => state.auth);
  console.log(user.id)
  const [favorites, setFavorites] = useState([]);
  const [categories, setCategories] = useState([]);
  const [type, setType] = useState([]);
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      navigate("/login"); // Redirect to login if user is null
      return;
    }

    const getFavorites = async () => {
      const data = await fetchSavedBrands();
      if (!data){
        console.log("No data")
        navigate('/login')
      }
      setFavorites(data);
    };
    getFavorites();
  }, [user, navigate]);

  useEffect(() => {
      const getCategories = async () => {
        const data = await fetchCategories();
        setCategories(data);
      };
      getCategories();
    }, []);



  return (
    <div className="md:ml-12 mt-6 md:p-2 p-6">
      <h2 className="text-2xl font-bold text-center text-start mb-4">Saved Brands</h2>
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
        {favorites.length > 0 ? (
          favorites.map((brand) => {
            const categoryName =
                categories.find((cat) => cat.id === brand.category)?.name || "N/A";
            return (
            <BrandCard
                key={brand.id}
                brand={brand}
                category={categoryName}
                type="delete"
            />
            );
            })
        ) : (
          <p className="text-center text-gray-500">No Saved Brands yet.</p>
        )}
      </div>
    </div>
  );
};

export default SavedBrands;