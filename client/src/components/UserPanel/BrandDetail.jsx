import { useState, useEffect } from "react";
import { Pencil } from "lucide-react"; // optional icon
import { fetchBrands } from "../../api";
import { useSelector } from "react-redux";

const brand=[
  {name: "Zara"},
  {email: "zara@example.com"},
  {category: { name: "Clothing" }},
  {about: "Fashion brand"},
  {online_store: "https://zara.com"},
  {retail_store: "Walmart, H&M"}
]

const BrandDetail = ({ onSave }) => {
  const { user } = useSelector((state) => state.auth);
  console.log("User:", user)
  const [isEditing, setIsEditing] = useState(false);
  const [brands, setBrands] = useState([]);

  

  useEffect(() => {
      const getBrands = async () => {
        const data = await fetchBrands();
        console.log("Brands:", data)
        let filtered = data;
        if (user.is_brand) {
          filtered = data.filter(
            (brand) => brand.user === user.id
          );
        }
        setBrands(filtered);
      };
      getBrands();
    
    }, [user]);

   

  const [formData, setFormData] = useState({
    about: brand?.about || "",
    onlineStore: brand?.online_store || "",
    offlineStore: brand?.retail_store || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData); // Call parent with updated data
    setIsEditing(false);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md mt-10 relative">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Brand Details</h2>
        {/* Edit Button */}
        <button
          type="button"
          onClick={() => setIsEditing((prev) => !prev)}
          className="text-sm text-blue-600 hover:underline flex items-center gap-1"
        >
          <Pencil size={16} />
          {isEditing ? "Cancel" : "Edit"}
        </button>

      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
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

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
          <input
            type="text"
            value={brand?.category?.name || "N/A"}
            disabled
            className="mt-1 p-2 block w-full rounded-md bg-gray-100 dark:bg-gray-700 border border-gray-300 text-gray-900 dark:text-white"
          />
        </div>

        {/* About */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">About Brand</label>
          <textarea
            name="about"
            value={formData.about}
            onChange={handleChange}
            disabled={!isEditing}
            rows={4}
            className={`mt-1 p-2 block w-full rounded-md border border-gray-300 dark:border-gray-600 ${
              isEditing ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white" : "bg-gray-100 text-gray-400"
            }`}
          />
        </div>

        {/* Online Store */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Online Store (Website)</label>
          <input
            type="url"
            name="onlineStore"
            value={formData.onlineStore}
            onChange={handleChange}
            disabled={!isEditing}
            placeholder="https://example.com"
            className={`mt-1 p-2 block w-full rounded-md border border-gray-300 dark:border-gray-600 ${
              isEditing ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white" : "bg-gray-100 text-gray-400"
            }`}
          />
        </div>

        {/* Offline Store */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Offline Store Name(s)</label>
          <input
            type="text"
            name="offlineStore"
            value={formData.offlineStore}
            onChange={handleChange}
            disabled={!isEditing}
            placeholder="e.g., Walmart, Target"
            className={`mt-1 p-2 block w-full rounded-md border border-gray-300 dark:border-gray-600 ${
              isEditing ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-red-500 focus:ring-red-500" : "bg-gray-100 text-gray-400"
            }`}
          />
        </div>

        {/* Save Button */}
        {isEditing && (
          <button
            type="submit"
            className="w-full bg-red-700 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg"
          >
            Save Changes
          </button>
        )}
      </form>
    </div>
  );
};

export default BrandDetail;
