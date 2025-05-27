import React, { useState } from 'react';
import { set, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import axios from "axios";


const ForgotPassword = () => {

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

    const {
        register,
        handleSubmit,
        formState:{ errors },
      } = useForm();
    
  
    const handleForgotPassword = async () => {
  
      try {
        const result = await axios.post(`${API_URL}/forgot-password/`, { email });
        console.log("Forgot Password Result", result)
        toast.success(result.message || 'Reset link sent if the email exists!');
      } catch (err) {
        console.error('Error:', err);
        toast.error('Something went wrong. Please try again.');
      }
    };
  
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-center mb-4">Forgot Password</h2>
          <form onSubmit={handleSubmit(handleForgotPassword)}>
            <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 font-semibold">Email</label>
                <input
                type="email"
                id="email"
                name="email"
                className="w-full mt-1 p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring focus:ring-red-500"
                placeholder="Enter your email"
                {...register("email", { required: "Email is required" })}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>
            <button
              type="submit"
              className="w-full bg-red-700 text-white py-2 rounded-md hover:bg-red-800 transition duration-300"
            >
              Send Reset Link
            </button>
          </form>
        </div>
      </div>
    );
  };
  
  export default ForgotPassword;