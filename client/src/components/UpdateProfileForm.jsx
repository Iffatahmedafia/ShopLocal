import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useDispatch, useSelector } from 'react-redux';

import { setCredentials } from '../redux/slices/authSlice';
import { fetchUserData } from "../api";
import { toast } from "react-toastify";

const UpdateProfileForm = () => {
  const dispatch = useDispatch();
  const [userData, setUserData] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null); // reference for hidden file input

  const { register, handleSubmit, setValue, formState: { errors } } = useForm();

  useEffect(() => {
    const getUserData = async () => {
      const data = await fetchUserData();
      setUserData(data);
      console.log("User Data:", data);
      setValue("name", data.name);
      setValue("email", data.email);
      setImagePreview(data.imageUrl || null); // Assume imageUrl is in fetched user data
    };
    getUserData();
  }, [setValue]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      // If you want to upload the image as part of formData later, you can save the file here
    }
  };

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


  const triggerFileSelect = () => {
    fileInputRef.current.click();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      
      <div className="flex flex-col items-center space-y-3">
        {/* Avatar */}
        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-300 dark:border-gray-600">
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Avatar Preview"
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-gray-200 dark:bg-gray-700 text-gray-500">
              No Image
            </div>
          )}
        </div>

        {/* Upload Button */}
        <button
          type="button"
          onClick={triggerFileSelect}
          className="border border-red-700 text-red-700 hover:bg-red-700 hover:text-white px-4 py-2 rounded-lg font-semibold transition"
        >
          Upload Image
        </button>

        {/* Hidden file input */}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageChange}
          className="hidden"
        />
      </div>

      {/* Name field */}
      <div>
        <label className="block text-gray-700 dark:text-gray-300 font-semibold">Name</label>
        <input
          type="text"
          {...register("name", { required: "Name is required" })}
          className="w-full mt-1 p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring focus:ring-red-500"
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
      </div>

      {/* Email field */}
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

      {/* Submit button */}
      <button
        type="submit"
        className="w-full bg-red-700 hover:bg-red-800 text-white py-2 rounded-lg font-semibold transition"
      >
        Update Profile
      </button>

    </form>
  );
};

export default UpdateProfileForm;
