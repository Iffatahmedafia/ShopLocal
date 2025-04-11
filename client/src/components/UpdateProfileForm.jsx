import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials } from '../redux/slices/authSlice';
import { fetchUserData } from "../api";
import { toast } from "react-toastify";

const UpdateProfileForm = () => {
  const dispatch = useDispatch();
  const [userData, setUserData] = useState(null);
  const [image, setImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setImage(URL.createObjectURL(file));
  };

  const { register, handleSubmit, setValue, formState: { errors } } = useForm();

  useEffect(() => {
    // Fetch current user data
    const getUserData = async () => {
        const data = await fetchUserData()
        setUserData(data);
        console.log("User Data:",data)
        setValue("name", data.name);
        setValue("email", data.email);
    };
    getUserData();
  }, [setValue]);

  const onSubmit = async (data) => {
    try {
      const res = await axios.put("http://localhost:8000/api/profile/update/", data, { withCredentials: true });
      console.log("Updated Data", res.data)
      setUserData(res.data); // Update UI with new data
      dispatch(setCredentials({ user: res.data }));
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    }
  };

  return (
    
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
            Profile Image
          </label>
          <input type="file" accept="image/*" onChange={handleImageChange} className="w-full mt-1 p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring focus:ring-red-500" />
    
          {image && (
            <img src={image} alt="Preview" className="mt-3 w-16 h-16 rounded-full object-cover" />
          )}
          
        </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-semibold">Name</label>
            <input
              type="text"
              {...register("name", { required: "Name is required" })}
              className="w-full mt-1 p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring focus:ring-red-500"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-semibold">Email</label>
            <input
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: { value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, message: "Invalid email" }
              })}
              className="w-full mt-1 p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring focus:ring-red-500"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>
          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold transition"
          >
            Update Profile
          </button>
        </form>
         );
        };
        
 
export default UpdateProfileForm;
