import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";

const ProfileCard = () => {

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

  const [userData, setUserData] = useState(null);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm();

  useEffect(() => {
    // Fetch current user data
    const fetchUserData = async () => {
      try {
        const res = await axios.get(`${API_URL}/profile/`, { withCredentials: true });
        console.log("User Data:",res.data)
        setUserData(res.data);
        setValue("name", res.data.name);
        setValue("email", res.data.email);
      } catch (error) {
        toast.error("Failed to load user data");
      }
    };
    fetchUserData();
  }, [setValue]);


  return (
      <div className="w-full max-w-md flex flex-col items-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-black/50 border border-gray-300 dark:border-gray-700">
        {/* User Avatar */}
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center text-4xl dark:text-white font-bold shadow-md">
          🧑
        </div>

        {/* User Name & Email */}
        <h2 className="text-2xl font-bold dark:text-white mt-4">{userData?.name}</h2>
        <p className="text-gray-600 dark:text-gray-300 text-sm">{userData?.email}</p>

        {/* Additional User Role Display (Optional) */}
        {userData?.is_admin && (
          <span className="mt-2 px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded-full">
            Admin
          </span>
        )}
      </div>

    );
};


export default ProfileCard;
