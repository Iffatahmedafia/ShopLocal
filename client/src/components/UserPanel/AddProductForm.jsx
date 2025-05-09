import { useState, useEffect, useCallback, useRef } from "react";
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import axios from "axios";
import debounce from "lodash/debounce";
import { useSelector } from "react-redux";
import { fetchCategories, fetchSubCategories, fetchSubSubCategories, fetchBrands } from "../../api";
import DialogWrapper from "../DialogWrapper";


const AddProductForm = ({ open, setOpen, title, type, productData, onSubmit }) => {
  const { user } = useSelector((state) => state.auth);
  console.log("User:", user)
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [subcategories, setSubcategories] = useState([]);
  const [selectedsubcategory, setSelectedsubcategory] = useState("");
  const [subsubcategories, setSubSubcategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [image, setImage] = useState(null);
  const fileInputRef = useRef(null); // reference for hidden file input
  const [currentStep, setCurrentStep] = useState(1); // Manage form steps
  const [suggestedTags, setSuggestedTags] = useState([]);
  const [tagsInput, setTagsInput] = useState('');
  const [generatingTags, setGeneratingTags] = useState(false);

  const {
    register,
    handleSubmit,
    trigger,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (type === "edit" && open && productData) {
      console.log("Edit",productData)
      reset({
        name: productData.name || '',
        description: productData.description || '',
        tags: productData.tags || '',
        price: productData.price || '',
        brand: productData.brand || '',
        subcategory: productData.subcategory.id || '',
        subsubcategory: productData.sub_subcategory.id || '',
        category: productData.category || '',
        store: productData.supershop_store || '',
        website: productData.online_store || '',
      });
      setImage(productData.image_url || null); // If you store image preview
      setSelectedsubcategory(productData.subcategory.id || '');
      setSelectedCategoryId(productData.category || '');
  }
}, [type, open, productData, reset]);

  useEffect(() => {
    if (!open) {
      reset();               // Clear form data
      setImage(null);        // Reset image preview
      setCurrentStep(1);     // Reset to step 1
      setSuggestedTags([]);  // Clear any tag suggestions
      setTagsInput('');
      setSelectedsubcategory('');
      setSelectedCategoryId('');
    }
  }, [open, reset]);

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

  
  const triggerFileSelect = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file)); // Preview the image
    }
  };

  const generateTagsFromAI = async (description) => {
    try {
      setGeneratingTags(true);
      const res = await axios.post("http://localhost:8000/api/generate-tags/", { text: description });
      const tags = res.data.tags;
      setSuggestedTags(tags);
      setTagsInput(tags.join(', '));
    } catch (error) {
      toast.error("Failed to generate tags");
    } finally {
      setGeneratingTags(false);
    }
  };

  const debouncedGenerateTags = useCallback(
    debounce((desc) => generateTagsFromAI(desc), 800),
    []
  );

  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    setValue("description", value);
    // debouncedGenerateTags(value); 
  };


  const handleSubcategoryChange = (e) => {
    const subcategoryId = parseInt(e.target.value);
    setSelectedsubcategory(subcategoryId);
    setValue("subcategory", subcategoryId);
  
    const selectedSub = subcategories.find(sub => sub.id === subcategoryId);
    if (selectedSub?.category?.id) {
      setSelectedCategoryId(selectedSub.category.id);
      setValue("category", selectedSub.category.id); // auto-fill category field
    }
  };

  
  const handleSubmitForm = async (data) => {
    // Form submission logic here
    console.log("Submitted Product Data", data);
    const tagList = data.tags.split(',').map(t => t.trim()).filter(Boolean);
    const FormData = { 
      ...data,
      supershop_store: data.store,
      online_store: data.website,
      tags: tagList };
      
    try {
      if (productData) {
        // If task exists, make PUT request to update it
        const response = await axios.patch(`http://localhost:8000/api/product/update/${productData.id}`,FormData, 
          { withCredentials: true }
        );
        console.log(response.data);
        toast.success("Product updated successfully!");
      }
      else{
        const response = await axios.post("http://localhost:8000/api/product/create/", {
            name: data.name,
            description: data.description,
            brand_id: data.brand,
            price: data.price,
            subcategory_id: parseInt(data.subcategory),
            sub_subcategory_id: parseInt(data.subsubcategory),
            category: parseInt(data.category),
            supershop_store: data.store,
            online_store: data.website,
            tags: tagList,
          },{ withCredentials: true }
        )

        console.log(response.data);
        toast.success("Product addded successfully!");
    }
      onSubmit(FormData)
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.response?.data?.error || "Error saving product.");
  }
  };

  // Handle step navigation
  const handleNextStep = async () => {
    let fieldsToValidate = [];
  
    if (currentStep === 2) {
      fieldsToValidate = ["name", "description","tags"];
    } else if (currentStep === 3) {
      fieldsToValidate = ["price", "brand"];
    }
  
    if (fieldsToValidate.length > 0) {
      const isValid = await trigger(fieldsToValidate);
      if (!isValid) return; // prevent next step if invalid
    }
  
    setCurrentStep((prev) => Math.min(prev + 1, 4)); // limit max step
  };
  

  const handlePreviousStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1)); // Min step is 1
  };

  return (
    <DialogWrapper open={open} setOpen={setOpen} title={title}>
      <form
        onSubmit={handleSubmit(handleSubmitForm)}
        className="space-y-4 max-h-[80vh] overflow-y-auto"
      >
        {/* Step 1 - Product Image */}
        {currentStep === 1 && (
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 font-semibold">
              Product Image
            </label>
            <div className="flex flex-col items-center space-y-4 mt-4 w-full">
              {/* Avatar */}
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-300 dark:border-gray-600">
                {image ? (
                  <img
                    src={image}
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
                className="w-full border border-red-700 text-red-700 hover:bg-red-700 hover:text-white px-4 py-2 rounded-lg font-semibold transition"
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
            {/* <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-2 w-full p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring focus:ring-red-500"
            />
            {image && (
              <div className="mt-2">
                <img src={image} alt="Product" className="w-32 h-32 object-cover" />
              </div>
            )} */}
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
            <div className="mb-4">
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
            
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 font-semibold">
                Product Description
              </label>
              <input
                type="text"
                id="description"
                name="description"
                className="w-full mt-1 p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring focus:ring-red-500"
                placeholder="Enter Product Description"
                {...register("description",{ required: "Description is required" })}
                onChange={handleDescriptionChange}
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 font-semibold">
                Tags (comma separated)
              </label>
              <input
                type="text"
                id="tags"
                name="tags"
                // value={tagsInput}
                // onChange={(e) => setTagsInput(e.target.value)}
                className="w-full mt-1 p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring focus:ring-red-500"
                placeholder="e.g. bluetooth, wireless, fitness"
                {...register("tags", { required: "Tags is required" })}
              />
               {errors.tags && (
                <p className="text-red-500 text-sm mt-1">{errors.tags.message}</p>
              )}
              {/* {generatingTags && <p className="text-sm text-gray-500 mt-1">Suggesting tags...</p>} */}
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
                className="w-full bg-red-700 hover:bg-red-800 text-white py-2 rounded-lg font-semibold transition"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Step 3 - Product Brand and Price */}
        {currentStep === 3 && (
          <div>
            {type === "add" && (
            <div className="mb-4">
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
            )}
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

            <div className="mb-4">
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
                className="w-full bg-red-700 hover:bg-red-800 text-white py-2 rounded-lg font-semibold transition"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Step 4 - Category, Store, and Online Link */}
        {currentStep === 4 && (
          <div>
            <input
                type="hidden"
                id="category"
                {...register("category", { required: "Category is required" })}
              />
            {type === "add" && (
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 font-semibold">
                Select Product Category
              </label>
              <select
                id="subcategory"
                name="subcategory"
                className="w-full mt-1 p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring focus:ring-red-500"
                {...register("subcategory", { required: "Category is required"
                 
                })}
                onChange={handleSubcategoryChange}
              >
                <option value="">Select a category</option>
                {subcategories.map((subcategory, index) => (
                  <option key={index} value={subcategory.id}>
                    {subcategory.name}
                  </option>
                ))}
              </select>
              {errors.subcategory && (
                <p className="text-red-500 text-sm mt-1">{errors.subcategory.message}</p>
              )}
            </div>
            )}
            {type === "add" && (
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 font-semibold">
                Select Product SubCategory
              </label>
              <select
                id="subsubcategory"
                name="subsubcategory"
                className="w-full mt-1 p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring focus:ring-red-500"
                {...register("subsubcategory", { required: "SubCategory is required" })}
              >
                <option value="">Select a subcategory</option>
                {subsubcategories
                .filter((subSub) => subSub.subcategory.id === parseInt(selectedsubcategory))
                .map((subsubcategory, index) => (
                  <option key={index} value={subsubcategory.id}>
                    {subsubcategory.name}
                  </option>
                ))}
              </select>
              {errors.subsubcategory && (
                <p className="text-red-500 text-sm mt-1">{errors.subsubcategory.message}</p>
              )}
            </div>
            )}
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 font-semibold">
                Product Retail Store/SuperMarket Name(s) (if any)
              </label>
              <input
                type="text"
                id="store"
                name="store"
                className="w-full mt-1 p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring focus:ring-red-500"
                placeholder="Dollarama, Food Basics"
                {...register("store")}
              />
              {errors.store && (
                <p className="text-red-500 text-sm mt-1">{errors.store.message}</p>
              )}
            </div>

            <div className="mb-4">
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
              {type === "add" ? "Add Product" : "Save Changes"}
            </button>
            </div>
          </div>
        )}
      </form>
    </DialogWrapper>
  );
};

export default AddProductForm;
