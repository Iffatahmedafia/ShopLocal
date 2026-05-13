import { useState } from "react";
import { FaKey, FaUserEdit } from "react-icons/fa";

import ChangePasswordForm from "../../components/ChangePasswordForm";
import ProfileCard from "../../components/ProfileCard";
import UpdateProfileForm from "../../components/UpdateProfileForm";

const ProfilePage = () => {
  const [selectedTab, setSelectedTab] = useState("profile");

  return (
    <div className="px-4 pb-10 pt-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-red-700 dark:text-red-400">
          Account settings
        </p>
        <h1 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
          My Profile
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-gray-600 dark:text-gray-300">
          Manage your account details, profile information, and password.
        </p>
      </div>

      <div className="grid gap-8 xl:grid-cols-[360px_minmax(0,1fr)]">
        <ProfileCard />

        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="border-b border-gray-200 p-4 dark:border-gray-700 sm:p-6">
            <div className="inline-flex rounded-full bg-gray-100 p-1 dark:bg-gray-900">
              <button
                type="button"
                onClick={() => setSelectedTab("profile")}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                  selectedTab === "profile"
                    ? "bg-white text-red-700 shadow-sm dark:bg-gray-700 dark:text-red-300"
                    : "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                }`}
              >
                <FaUserEdit className="text-base" />
                Profile
              </button>
              <button
                type="button"
                onClick={() => setSelectedTab("password")}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                  selectedTab === "password"
                    ? "bg-white text-red-700 shadow-sm dark:bg-gray-700 dark:text-red-300"
                    : "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                }`}
              >
                <FaKey className="text-base" />
                Security
              </button>
            </div>
          </div>

          <div className="p-5 sm:p-8">
            <div className="mb-7">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {selectedTab === "profile" ? "Profile details" : "Password"}
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {selectedTab === "profile"
                  ? "Update the name and email attached to your account."
                  : "Keep your account secure by choosing a strong password."}
              </p>
            </div>

            {selectedTab === "profile" ? <UpdateProfileForm /> : <ChangePasswordForm />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
