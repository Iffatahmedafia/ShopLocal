// ResetPassword.jsx
import React, { useState } from 'react';
import { useSearchParams, useNavigate } from "react-router-dom";
import { set, useForm } from 'react-hook-form';
import axios from "axios";
import { toast } from 'react-toastify';

const ResetPassword = () => {
  const [params] = useSearchParams();
  const token = params.get("token");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState:{ errors },
  } = useForm();

  const password = watch("password");

  const handleResetPassword = async () => {

    try {
      const result = await axios.post("http://localhost:8000/api/reset-password/", {
        token,
        new_password: data.password,
        confirm_password: data.confirmPassword,
      });
      console.log("Reset Password Result", result)
      toast.success('Password reset successful!');
      navigate('/login');
    } catch (err) {
      console.error('Error:', err);
      toast.error('Something went wrong.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center mb-4">Reset Password</h2>
        <form onSubmit={handleSubmit(handleResetPassword)}>
            <label className="block text-gray-700 dark:text-gray-300 font-semibold">New Password</label>
            <input
                type="password"
                id="password"
                name="password"
                className="w-full mt-1 p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring focus:ring-red-500 pr-10"
                placeholder="New password"
                {...register("password", { required: "New Password is required" })}
            />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
            <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 font-semibold">Confirm Password</label>
                <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    className="w-full mt-1 p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring focus:ring-red-500 pr-10"
                    placeholder="Confirm Password"
                    {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: value =>
                        value === password || "Passwords do not match"
                    })}
                />
                {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
            </div>
            <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition duration-300"
            >
                Reset Password
            </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
