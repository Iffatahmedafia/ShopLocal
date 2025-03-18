import { useLocation } from "react-router-dom";
import UpdateProfileForm from "../components/UpdateProfileForm";
import ChangePasswordForm from "../components/ChangePasswordForm";
import ProfileCard from "../components/ProfileCard";

const ProfilePage = () => {
  const location = useLocation();

  return (
    <div className="mt-6 max-w-lg mx-auto bg-gray-100 dark:bg-gray-900 dark:text-white p-6 rounded-lg shadow-md">
        <ProfileCard />
      <h2 className="text-2xl font-semibold text-center mb-4 mt-4">
        {location.pathname === "/profile" ? "Update Profile" : "Change Password"}
      </h2>

      {/* Conditionally render forms based on route */}
      {location.pathname === "/profile" ? <UpdateProfileForm /> : <ChangePasswordForm />}
    </div>
  );
};

export default ProfilePage;