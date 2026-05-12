import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";

const ChangePasswordForm = () => {
//   const [userData, setUserData] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

  const { register, handleSubmit, formState: { errors } } = useForm();


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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Current Password</label>
            <input
              type="password"
              {...register("currentPassword", { required: "Current password is required" })}
              className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-red-500 focus:ring-4 focus:ring-red-100 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:ring-red-900/40"
            />
            {errors.currentPassword && <p className="text-red-500 text-sm">{errors.currentPassword.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">New Password</label>
            <input
              type="password"
              {...register("newPassword", { required: "New password is required", minLength: { value: 6, message: "Password must be at least 6 characters" } })}
              className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-red-500 focus:ring-4 focus:ring-red-100 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:ring-red-900/40"
            />
            {errors.newPassword && <p className="text-red-500 text-sm">{errors.newPassword.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Confirm New Password</label>
            <input
              type="password"
              {...register("confirmPassword", { required: "Please confirm your new password" })}
              className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-red-500 focus:ring-4 focus:ring-red-100 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:ring-red-900/40"
            />
            {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
          </div>
          <button
            type="submit"
            className="w-full rounded-xl bg-red-700 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-red-800">
            Change Password
          </button>
        </form>
  );
};

export default ChangePasswordForm;
