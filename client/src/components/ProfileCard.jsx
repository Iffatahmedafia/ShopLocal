import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const ProfileCard = () => {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get(`${API_URL}/profile/`, { withCredentials: true });
        console.log("User Data:", res.data);
        setUserData(res.data);
      } catch (error) {
        toast.error("Failed to load user data");
      }
    };

    fetchUserData();
  }, [API_URL]);

  const initials = userData?.name
    ? userData.name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "SL";

  const roleLabel = userData?.is_admin
    ? "Admin"
    : userData?.is_brand
    ? "Business"
    : "Customer";

  return (
    <aside className="h-fit rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="rounded-2xl bg-[#0f1c2e] p-5 text-white">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-white text-xl font-bold text-red-700 shadow-md">
            {initials}
          </div>
          <div className="min-w-0">
            <h2 className="truncate text-xl font-bold">{userData?.name || "ShopLocal user"}</h2>
            <p className="truncate text-sm text-gray-300">
              {userData?.email || "Loading account..."}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        <div className="flex items-center justify-between gap-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Role
          </p>
          <span className="inline-flex rounded-full bg-red-50 px-3 py-1 text-sm font-semibold text-red-700 dark:bg-red-900/30 dark:text-red-200">
            {roleLabel}
          </span>
        </div>
        <div className="rounded-xl bg-gray-50 p-4 text-sm leading-6 text-gray-600 dark:bg-gray-900 dark:text-gray-300">
          Your profile information is used across your dashboard, saved items, and account
          security.
        </div>
      </div>
    </aside>
  );
};

export default ProfileCard;
