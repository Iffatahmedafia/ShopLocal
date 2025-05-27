import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";

const ChangePasswordForm = () => {
//   const [userData, setUserData] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

  const { register, handleSubmit, setValue, formState: { errors } } = useForm();


  const onSubmit = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      await axios.put(`${API_URL}/password/update/`,{
        old_password: data.currentPassword,
        new_password: data.newPassword
      }, { withCredentials: true });

      toast.success("Password updated successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to change password");
    }
  };

  return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-semibold">Current Password</label>
            <input
              type="password"
              {...register("currentPassword", { required: "Current password is required" })}
              className="w-full mt-1 p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring focus:ring-red-500"
            />
            {errors.currentPassword && <p className="text-red-500 text-sm">{errors.currentPassword.message}</p>}
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-semibold">New Password</label>
            <input
              type="password"
              {...register("newPassword", { required: "New password is required", minLength: { value: 6, message: "Password must be at least 6 characters" } })}
              className="w-full mt-1 p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring focus:ring-red-500"
            />
            {errors.newPassword && <p className="text-red-500 text-sm">{errors.newPassword.message}</p>}
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-semibold">Confirm New Password</label>
            <input
              type="password"
              {...register("confirmPassword", { required: "Please confirm your new password" })}
              className="w-full mt-1 p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring focus:ring-red-500"
            />
            {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
          </div>
          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold transition">
            Change Password
          </button>
        </form>
  );
};

export default ChangePasswordForm;
