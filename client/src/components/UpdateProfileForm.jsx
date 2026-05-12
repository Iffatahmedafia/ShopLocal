import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useDispatch } from 'react-redux';

import { setCredentials } from '../redux/slices/authSlice';
import { fetchUserData } from "../api";
import { toast } from "react-toastify";

const UpdateProfileForm = () => {

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

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
      const res = await axios.put(`${API_URL}/profile/update/`, data, { withCredentials: true });
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
      
      <div className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
        {/* Avatar */}
        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-gray-200 bg-white dark:border-gray-600 dark:bg-gray-800">
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

        <div>
          <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">Profile image</p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Upload a clear photo or logo for your account.
          </p>
          {/* Upload Button */}
          <button
            type="button"
            onClick={triggerFileSelect}
            className="mt-3 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-700 hover:text-white dark:border-red-900 dark:bg-red-900/20 dark:text-red-200"
          >
            Upload Image
          </button>
        </div>

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
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Name</label>
        <input
          type="text"
          {...register("name", { required: "Name is required" })}
          className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-red-500 focus:ring-4 focus:ring-red-100 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:ring-red-900/40"
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
      </div>

      {/* Email field */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Email</label>
        <input
          type="email"
          {...register("email", {
            required: "Email is required",
            pattern: { value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, message: "Invalid email" }
          })}
          className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-red-500 focus:ring-4 focus:ring-red-100 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:ring-red-900/40"
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
      </div>

      {/* Submit button */}
      <button
        type="submit"
        className="w-full rounded-xl bg-red-700 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-red-800"
      >
        Update Profile
      </button>

    </form>
  );
};

export default UpdateProfileForm;
