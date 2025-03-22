import { useState, useEffect } from "react";
import { useForm } from 'react-hook-form';
import { FiEye, FiEyeOff } from "react-icons/fi";
import { toast } from 'react-toastify';
import { fetchCategories } from "../api";

const VendorRegistration = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [categories, setCategories] = useState([]);
  const [step, setStep] = useState(1); // Multi-step form

  const {
    register,
    handleSubmit,
    formState:{ errors },
    watch,
  } = useForm();

  const password = watch("password");

  const provinces = ["Ontario", "Quebec", "British Columbia", "Alberta", "Manitoba", "Saskatchewan", "Nova Scotia"];
//   const categories = ["Retail", "Food & Beverage", "Technology", "Health"];

  useEffect(() => {
      const getCategories = async () => {
        const data = await fetchCategories();
        setCategories(data);
      };
      getCategories();
    }, []);

  const handleSubmitForm = async (data) => {
    console.log(data);
    try {
      const response = await fetch("http://localhost:8000/api/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
          password2: data.confirmPassword,
          is_admin: false,
        }),
      });

      const result = await response.json();
      console.log(result);

      if (response.ok) {
        toast.success("User registered successfully!");
      } else {
        toast.error(result?.error || "Something went wrong");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Handling multi-step form navigation
  const nextStep = () => setStep((prevStep) => prevStep + 1);
  const prevStep = () => setStep((prevStep) => prevStep - 1);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 transition duration-300">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
          Register
        </h2>
        <form onSubmit={handleSubmit(handleSubmitForm)} className="mt-6">
          {/* Step 1: Personal Information */}
          {step === 1 && (
            <div>
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 font-semibold">
                  Business Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-full mt-1 p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring focus:ring-red-500"
                  placeholder="Enter Business name"
                  {...register("name", { required: "Name is required" })}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 font-semibold">
                  Business Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full mt-1 p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring focus:ring-red-500"
                  placeholder="Enter Business email"
                  {...register("email", { required: "Business Email is required" })}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 font-semibold">
                  Business Registration Number
                </label>
                <input
                  type="text"
                  id="registration"
                  name="registration"
                  className="w-full mt-1 p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring focus:ring-red-500"
                  placeholder="Enter Company Registration number"
                  {...register("registration", {
                    required: "Business Registration number is required",
                  })}
                />
                {errors.registration && (
                  <p className="text-red-500 text-sm mt-1">{errors.registration.message}</p>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 font-semibold">
                  Select Business Category
                </label>
                <select
                  id="category"
                  name="category"
                  className="w-full mt-1 p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring focus:ring-red-500"
                  {...register("category", { required: "Category is required" })}
                >
                  <option value="">Select a category</option>
                  {categories.map((category, index) => (
                    <option key={index} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Business Details */}
          {step === 2 && (
            <div>           
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 font-semibold">
                  Phone Number
                </label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  className="w-full mt-1 p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring focus:ring-red-500"
                  placeholder="Enter Business phone number"
                  {...register("phone", { required: "Phone Number is required" })}
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 font-semibold">
                  Business Address
                </label>
                <textarea
                  id="address"
                  name="address"
                  className="w-full mt-1 p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring focus:ring-red-500"
                  placeholder="Enter your business address"
                  rows="3"
                  {...register("address", { required: "Address is required" })}
                />
                {errors.address && (
                  <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 font-semibold">
                  Select Province
                </label>
                <select
                  id="province"
                  name="province"
                  className="w-full mt-1 p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring focus:ring-red-500"
                  {...register("province", { required: "Province is required" })}
                >
                  <option value="">Select a province</option>
                  {provinces.map((province, index) => (
                    <option key={index} value={province}>
                      {province}
                    </option>
                  ))}
                </select>
                {errors.province && (
                  <p className="text-red-500 text-sm mt-1">{errors.province.message}</p>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Password Fields */}
          {step === 3 && (
            <div>
              <div className="mb-4 relative">
                <label className="block text-gray-700 dark:text-gray-300 font-semibold">
                  Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  className="w-full mt-1 p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring focus:ring-red-500"
                  placeholder="Enter your password"
                  {...register("password", { required: "Password is required" })}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                )}
              </div>
              <div className="mb-4 relative">
                <label className="block text-gray-700 dark:text-gray-300 font-semibold">
                  Confirm Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  className="w-full mt-1 p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring focus:ring-red-500"
                  placeholder="Confirm your password"
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: value =>
                      value === password || "Passwords do not match",
                  })}
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
                )}
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex justify-between gap-4">
            {step > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 rounded-lg font-semibold transition"
              >
                Previous
              </button>
            )}
            {step < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold transition"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold transition"
              >
                Register
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default VendorRegistration;
