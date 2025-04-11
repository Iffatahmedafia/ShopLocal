import { useState } from "react";
import UpdateProfileForm from "../components/UpdateProfileForm";
import ChangePasswordForm from "../components/ChangePasswordForm";
import ProfileCard from "../components/ProfileCard";

const ProfilePage = () => {
  const [selectedTab, setSelectedTab] = useState("profile");

  return (
    <div className="min-h-screen px-4 py-10 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      <h1 className="text-2xl font-bold mb-6 text-center md:text-start text-gray-800 dark:text-white">
        My Profile
      </h1>

      <div className="flex flex-col gap-y-8 items-center">
        {/* Profile Card */}
        <ProfileCard />

        {/* Tabs */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => setSelectedTab("profile")}
            className={`pb-2 text-lg font-medium border-b-2 transition-colors ${
              selectedTab === "profile"
                ? "border-red-700 text-red-700 dark:text-red-600"
                : "border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-300"
            }`}
          >
            Update Profile
          </button>
          <button
            onClick={() => setSelectedTab("password")}
            className={`pb-2 text-lg font-medium border-b-2 transition-colors ${
              selectedTab === "password"
                ? "border-red-700 text-red-700 dark:text-red-600"
                : "border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-300"
            }`}
          >
            Change Password
          </button>
        </div>

        {/* Form Card */}
        <div className="w-full max-w-2xl p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-black/50">
          <h2 className="text-2xl mb-6 font-semibold text-center text-gray-700 dark:text-gray-200">
            {selectedTab === "profile" ? "Update Profile" : "Change Password"}
          </h2>

          {selectedTab === "profile" ? <UpdateProfileForm /> : <ChangePasswordForm />}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
