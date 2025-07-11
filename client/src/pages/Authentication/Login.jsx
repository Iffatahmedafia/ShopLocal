import { useState, useEffect } from "react";
import { set, useForm } from 'react-hook-form';
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';


import { setCredentials } from "../../redux/slices/authSlice";
import { getCookie } from "../../utils/ExtractCookie";



const Login = () => {

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const csrfToken = getCookie('csrftoken');
  console.log('CSRF Token:', csrfToken);
 
  
  const {
    register,
    handleSubmit,
    setValue,
    formState:{ errors },
  } = useForm();



  const handleSubmitForm = async (data) => {
    console.log(data);
    try {
      const response = await fetch(`${API_URL}/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          remember_me: data.rememberMe,
        }),
        credentials: "include",
      });
  
      const result = await response.json();
      console.log("Result",result)
  
      if (response.ok) {
        dispatch(setCredentials({ user: result.user }));
        // Cookies.set("accessToken", result.tokens.access, { expires: 7 }); // Store token in cookies
        toast.success("Login successful!");

         // ✅ Store or clear email based on Remember Me
      if (data.rememberMe) {
        localStorage.setItem("rememberedEmail", data.email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

        // Delay navigation by 1 second
        setTimeout(() => {
          navigate('/');
        }, 1000);
      } else {
        toast.error(result?.error || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setValue("email", savedEmail);
      setRememberMe(true);
    }
  }, [setValue]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 transition duration-300">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">Login</h2>

        <form onSubmit={handleSubmit(handleSubmitForm)} className="mt-6">
          {/* Email Field */}
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

          {/* Password Field */}
          <div className="mb-4 relative">
            <label className="block text-gray-700 dark:text-gray-300 font-semibold">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                className="w-full mt-1 p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring focus:ring-red-500 pr-10"
                placeholder="Enter your password"
                {...register("password", { required: "Password is required" })}
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
              {/* Show/Hide Password Button */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-600 dark:text-gray-300"
              >
                {showPassword ? <FiEye size={20} /> : <FiEyeOff size={20} />}
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex justify-between items-center mb-6">
            <label className="flex items-center text-gray-700 dark:text-gray-300">
              <input
                type="checkbox"
                id="rememberMe"
                name="rememberMe"
                className="mr-2"
                {...register("rememberMe")}
              />
              Remember Me
            </label>
            <Link to="/forgot-password" className="text-red-600 hover:underline"> Forgot Password?</Link>
            {/* <Link to="/forgot-password" className="text-red-500 hover:underline">
              Forgot Password?
            </Link> */}
          </div>

          {/* Submit & Cancel Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              className="w-full bg-red-700 hover:bg-red-800 text-white py-2 rounded-lg font-semibold transition"
            >
              Login
            </button>
            <button
              type="button"
              className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 rounded-lg font-semibold transition"
            >
              Cancel
            </button>
          </div>
        </form>

        {/* Sign Up Link */}
        <p className="mt-4 text-center text-gray-700 dark:text-gray-300">
          Don't have an account?{" "}
          <Link to= "/register" className="text-red-600 hover:underline">Sign Up</Link>
          {/* <Link to="/signup" className="text-red-500 hover:underline">
            Sign Up
          </Link> */}
        </p>
      </div>
    </div>
  );
};

export default Login;
