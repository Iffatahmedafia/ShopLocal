import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Pencil } from "lucide-react";
import { fetchBrands, updateBrand, fetchCategories } from "../../api";
import { useSelector } from "react-redux";
import { toast } from 'react-toastify';

const BrandDetail = () => {
  const { user } = useSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [brand, setBrand] = useState(null);
  const [categories, setCategories] =useState([]);

  const provinceOptions = [
    "Ontario",
    "Alberta",
    "British Columbia",
    "Quebec",
    "Manitoba",
    "Saskatchewan",
    "Nova Scotia",
  ];

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  const watchCanadianOwned = watch("canadian_owned");

  useEffect(() => {
      const getCategories = async () => {
        const data = await fetchCategories();
        setCategories(data);
      };
      getCategories();
    }, []);

  useEffect(() => {
    const getBrands = async () => {
      const data = await fetchBrands();
      console.log("Brands", data)
      let filtered = data;
      if (user.is_brand) {
        filtered = data.filter((b) => b.user === user.id);
      }
      const selectedBrand = filtered[0];
      setBrand(selectedBrand);

      reset({
        about: selectedBrand?.about || "",
        phone: selectedBrand?.phone || "",
        category: selectedBrand?.category || "",
        province: selectedBrand?.province || "",
        onlineStore: selectedBrand?.website_link || "",
        offlineStore: selectedBrand?.store_address || "",
        supermarketStore: selectedBrand?.supershop_store || "",
        canadian_owned: selectedBrand?.canadian_owned ? "Yes" : "No",
        manufactured_in: selectedBrand?.manufactured_in || "",
        origin_country: selectedBrand?.origin_country || "",
        
      });
    };
    getBrands();
  }, [user, reset]);

  const onSubmit = async (data) => {
    console.log("Form data", data)
    try {
      const payload = {
        ...data,
        canadian_owned: data.canadian_owned === "Yes",
      };

      if (payload.canadian_owned === true) {
        delete payload.origin_country;
      }
      await updateBrand(brand.id, data);
      setIsEditing(false);
      toast.success("Brand updated successfully!");
    } catch (error) {
      console.error("Failed to update brand:", error);
      toast.error("Error updating brand.");
    }
  };

  if (!brand) return <p>Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md mt-10 relative">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Brand Details</h2>
        <button
          type="button"
          onClick={() => setIsEditing((prev) => !prev)}
          className="text-sm text-blue-600 hover:underline flex items-center gap-1"
        >
          <Pencil size={16} />
          {isEditing ? "Cancel" : "Edit"}
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Brand Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Brand Name</label>
          <input
            type="text"
            value={brand?.name || "N/A"}
            disabled
            className="mt-1 p-2 block w-full rounded-md bg-gray-100 dark:bg-gray-700 border border-gray-300 text-gray-900 dark:text-white"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
          <input
            type="email"
            value={brand?.email || "N/A"}
            disabled
            className="mt-1 p-2 block w-full rounded-md bg-gray-100 dark:bg-gray-700 border border-gray-300 text-gray-900 dark:text-white"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone</label>
          <input
            type="text"
            placeholder="e.g. +18668908"
            {...register("phone")}
            disabled={!isEditing}
            className={`mt-1 p-2 block w-full rounded-md border border-gray-300 dark:border-gray-600 ${
              isEditing ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white" : "bg-gray-100 text-gray-900"
            }`}
          />
        </div>


        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
          <select
            {...register("category")}
            disabled={!isEditing}
            className={`mt-1 p-2 block w-full rounded-md border border-gray-300 dark:border-gray-600 ${
              isEditing ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white" : "bg-gray-100 text-gray-900"
            }`}
          >
            <option value="" disabled>Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Province */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Province</label>
          <select
            {...register("province")}
            disabled={!isEditing}
            className={`mt-1 p-2 block w-full rounded-md border border-gray-300 dark:border-gray-600 ${
              isEditing ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white" : "bg-gray-100 text-gray-900"
            }`}
          >
            {provinceOptions.map((province) => (
              <option key={province} value={province}>{province}</option>

            ))}
          </select>
        </div>


        {/* Canadian Owned */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Canadian Owned?</label>
          <select
            {...register("canadian_owned")}
            disabled={!isEditing}
            className={`mt-1 p-2 block w-full rounded-md border border-gray-300 dark:border-gray-600 ${
              isEditing ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white" : "bg-gray-100 text-gray-900"
            }`}
          >
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>

        {/* Origin Country - only if Canadian Owned is No */}
        {watchCanadianOwned === "No" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Origin Country</label>
            <input
              type="text"
              placeholder="e.g. Bangladesh, China"
              {...register("origin_country")}
              disabled={!isEditing}
              className={`mt-1 p-2 block w-full rounded-md border border-gray-300 dark:border-gray-600 ${
                isEditing ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white" : "bg-gray-100 text-gray-900"
              }`}
            />
          </div>
        )}

        {/* Manufactured In */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Manufactured In</label>
          <input
            type="text"
            placeholder="e.g. Hamilton, Canada"
            {...register("manufactured_in")}
            disabled={!isEditing}
            className={`mt-1 p-2 block w-full rounded-md border border-gray-300 dark:border-gray-600 ${
              isEditing ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white" : "bg-gray-100 text-gray-900"
            }`}
          />
        </div>

        {/* About */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">About Brand</label>
          <textarea
            {...register("about")}
            disabled={!isEditing}
            rows={4}
            className={`mt-1 p-2 block w-full rounded-md border border-gray-300 dark:border-gray-600 ${
              isEditing ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white" : "bg-gray-100 text-gray-900"
            }`}
          />
        </div>

        {/* Online Store */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Online Store (Website)</label>
          <input
            type="url"
            placeholder="https://example.com"
            {...register("onlineStore")}
            disabled={!isEditing}
            className={`mt-1 p-2 block w-full rounded-md border border-gray-300 dark:border-gray-600 ${
              isEditing ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white" : "bg-gray-100 text-gray-900"
            }`}
          />
        </div>

        {/* Offline Store */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Retail Store (Address)</label>
          <input
            type="text"
            placeholder="e.g. 20 Kipling Road"
            {...register("offlineStore")}
            disabled={!isEditing}
            className={`mt-1 p-2 block w-full rounded-md border border-gray-300 dark:border-gray-600 ${
              isEditing ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white" : "bg-gray-100 text-gray-900"
            }`}
          />
        </div>

        {/* Supermarket Store */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Supermarket Name(s)</label>
          <input
            type="text"
            placeholder="e.g., Walmart, Target"
            {...register("supermarketStore")}
            disabled={!isEditing}
            className={`mt-1 p-2 block w-full rounded-md border border-gray-300 dark:border-gray-600 ${
              isEditing ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white" : "bg-gray-100 text-gray-900"
            }`}
          />
        </div>

        {/* Save Button */}
        {isEditing && (
          <button
            type="submit"
            className="w-full bg-red-700 hover:bg-red-800 text-white font-semibold py-2 px-4 rounded-lg"
          >
            Save Changes
          </button>
        )}
      </form>
    </div>
  );
};

export default BrandDetail;
