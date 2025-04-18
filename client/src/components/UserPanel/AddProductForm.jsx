import { useState, useEffect } from "react";
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { fetchCategories, fetchSubCategories, fetchSubSubCategories, fetchBrands } from "../../api";
import DialogWrapper from "../DialogWrapper";
import axios from "axios";
import { useSelector } from "react-redux";

const AddProductForm = ({ open, setOpen, title, onSubmit }) => {
  const { user } = useSelector((state) => state.auth);
  console.log("User:", user)
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedsubcategory, setSelectedsubcategory] = useState("");
  const [subsubcategories, setSubSubcategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [image, setImage] = useState(null);
  const [currentStep, setCurrentStep] = useState(1); // Manage form steps

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const getCategories = async () => {
      const data = await fetchCategories();
      setCategories(data);
    };
    getCategories();
  }, []);

  useEffect(() => {
        if (categories.length > 0) {
          const getSubcategories = async () => {
            const data = await fetchSubCategories();
            console.log("Fetched subcategories: ", data)
            setSubcategories(data);
          };
          getSubcategories();
        }
      }, [categories]);
  
  
  useEffect(() => {
    if (subcategories.length > 0) {
      const getSubSubcategories = async () => {
        const data = await fetchSubSubCategories();
        console.log("Fetched sub_subcategories Data: ", data)
        setSubSubcategories(data);
      };
      getSubSubcategories();
    }
  }, [subcategories]);

  useEffect(() => {
    const getBrands = async () => {
      const data = await fetchBrands();
      console.log("Fetched Brands Data: ", data)
      setBrands(data);
    };
    getBrands();
  }, []);

  const filtered_brand = brands.filter((brand) => brand.user == user.id)
  console.log(filtered_brand)


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file)); // Preview the image
    }
  };

  const handleSubmitForm = async (data) => {
    // Form submission logic here
    console.log(data);
    try {
      const response = await axios.post("http://localhost:8000/api/product/create/", {
          name: data.name,
          description: data.description,
          brand_id: data.brand,
          price: data.price,
          subcategory_id: parseInt(data.category),
          sub_subcategory_id: parseInt(data.subcategory),
          supershop_store: data.store,
          online_store: data.website,
        },{ withCredentials: true }
      )

      console.log(response.data);
      toast.success("Product registered successfully!");
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.response?.data?.error || "Something went wrong");
  }
  };

  // Handle step navigation
  const handleNextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 4)); // Max step is 4
  };

  const handlePreviousStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1)); // Min step is 1
  };

  return (
    <DialogWrapper open={open} setOpen={setOpen} title={title}>
      <form
        onSubmit={handleSubmit(handleSubmitForm)}
        className="space-y-4 max-h-[80vh] overflow-hidden"
      >
        {/* Step 1 - Product Image */}
        {currentStep === 1 && (
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 font-semibold">
              Product Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-2 w-full p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring focus:ring-red-500"
            />
            {image && (
              <div className="mt-2">
                <img src={image} alt="Product" className="w-32 h-32 object-cover" />
              </div>
            )}
            <button
              type="button"
              onClick={handleNextStep}
              className="w-full py-2 bg-red-700 hover:bg-red-800 text-white rounded-lg font-medium mt-4"
            >
              Next
            </button>
          </div>
        )}

        {/* Step 2 - Product Name and Description */}
        {currentStep === 2 && (
          <div>
            <div className="mb-2">
              <label className="block text-gray-700 dark:text-gray-300 font-semibold">
                Product Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="w-full mt-1 p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring focus:ring-red-500"
                placeholder="Enter product name"
                {...register("name", { required: "Name is required" })}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>

            <div className="mb-2">
              <label className="block text-gray-700 dark:text-gray-300 font-semibold">
                Product Description
              </label>
              <input
                type="text"
                id="description"
                name="description"
                className="w-full mt-1 p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring focus:ring-red-500"
                placeholder="Enter Product Description"
                {...register("description")}
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
              )}
            </div>

            <div className="flex justify-between gap-2">
              <button
                type="button"
                onClick={handlePreviousStep}
                className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 rounded-lg font-semibold transition"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={handleNextStep}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold transition"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Step 3 - Product Brand and Price */}
        {currentStep === 3 && (
          <div>
            <div className="mb-2">
              <label className="block text-gray-700 dark:text-gray-300 font-semibold">
                Select Brand
              </label>
              <select
                id="brand"
                name="brand"
                className="w-full mt-1 p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring focus:ring-red-500"
                {...register("brand", { required: "Brand is required"})}
              >
                <option value="">Select Brand</option>
                {filtered_brand.map((brand, index) => (
                  <option key={index} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
              </select>
              {errors.brand && (
                <p className="text-red-500 text-sm mt-1">{errors.brand.message}</p>
              )}
            </div>
            {/* <div className="mb-2">
              <label className="block text-gray-700 dark:text-gray-300 font-semibold">
                Brand Name
              </label>
              <input
                type="text"
                id="brand"
                name="brand"
                className="w-full mt-1 p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring focus:ring-red-500"
                placeholder="Enter Brand name"
                {...register("brand", { required: "Brand name is required" })}
              />
              {errors.brand && (
                <p className="text-red-500 text-sm mt-1">{errors.brand.message}</p>
              )}
            </div> */}

            <div className="mb-2">
              <label className="block text-gray-700 dark:text-gray-300 font-semibold">
                Product Price
              </label>
              <input
                type="number"
                id="price"
                name="price"
                className="w-full mt-1 p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring focus:ring-red-500"
                placeholder="Enter Product Price"
                {...register("price")}
              />
              {errors.price && (
                <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
              )}
            </div>

            <div className="flex justify-between gap-2">
              <button
                type="button"
                onClick={handlePreviousStep}
                className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 rounded-lg font-semibold transition"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={handleNextStep}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold transition"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Step 4 - Category, Store, and Online Link */}
        {currentStep === 4 && (
          <div>
            <div className="mb-2">
              <label className="block text-gray-700 dark:text-gray-300 font-semibold">
                Select Product Category
              </label>
              <select
                id="category"
                name="category"
                className="w-full mt-1 p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring focus:ring-red-500"
                {...register("category", { required: "Category is required",
                  onChange: (e) => setSelectedsubcategory(e.target.value)
                })}
              >
                <option value="">Select a category</option>
                {subcategories.map((category, index) => (
                  <option key={index} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
              )}
            </div>
            <div className="mb-2">
              <label className="block text-gray-700 dark:text-gray-300 font-semibold">
                Select Product SubCategory
              </label>
              <select
                id="subcategory"
                name="subcategory"
                className="w-full mt-1 p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring focus:ring-red-500"
                {...register("subcategory", { required: "SubCategory is required" })}
              >
                <option value="">Select a subcategory</option>
                {subsubcategories
                .filter((subSub) => subSub.subcategory.id === parseInt(selectedsubcategory))
                .map((subcategory, index) => (
                  <option key={index} value={subcategory.id}>
                    {subcategory.name}
                  </option>
                ))}
              </select>
              {errors.subcategory && (
                <p className="text-red-500 text-sm mt-1">{errors.subcategory.message}</p>
              )}
            </div>

            <div className="mb-2">
              <label className="block text-gray-700 dark:text-gray-300 font-semibold">
                Product Retail Store/SuperMarket (if any)
              </label>
              <input
                type="text"
                id="store"
                name="store"
                className="w-full mt-1 p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring focus:ring-red-500"
                placeholder="Enter Product Retail Store/SuperMarket Name"
                {...register("store")}
              />
              {errors.store && (
                <p className="text-red-500 text-sm mt-1">{errors.store.message}</p>
              )}
            </div>

            <div className="mb-2">
              <label className="block text-gray-700 dark:text-gray-300 font-semibold">
                Product Online Store Link (if any)
              </label>
              <input
                type="text"
                id="website"
                name="website"
                className="w-full mt-1 p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring focus:ring-red-500"
                placeholder="Enter Product online link"
                {...register("website")}
              />
              {errors.website && (
                <p className="text-red-500 text-sm mt-1">{errors.website.message}</p>
              )}
            </div>

            {/* Final Submit */}
            <div className="flex justify-between gap-2">
              <button
                type="button"
                onClick={handlePreviousStep}
                className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 rounded-lg font-semibold transition"
              >
                Previous
              </button>
            <button
              type="submit"
              className="w-full py-2 bg-red-700 hover:bg-red-800 text-white rounded-lg font-medium"
            >
              Add Product
            </button>
            </div>
          </div>
        )}
      </form>
    </DialogWrapper>
  );
};

export default AddProductForm;
