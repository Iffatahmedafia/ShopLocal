import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { FaUser, FaUserLock } from "react-icons/fa";
import { IoLogOutOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { logout } from "../redux/slices/authSlice";

const Avatar = () => {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      await fetch(`${API_URL}/logout/`, {
        method: "POST",
        credentials: "include",
      });
      dispatch(logout());
      navigate("/");
    } catch (error) {
      console.error("Logout API call failed:", error);
    }
  };

  const initial = user?.name?.charAt(0)?.toUpperCase() || "U";

  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button
        className="flex items-center gap-2 rounded-full border border-gray-200 dark:border-gray-700
        bg-white/80 dark:bg-gray-900/70
        px-2 py-1.5
        shadow-sm backdrop-blur-sm
        transition-all duration-300
        hover:shadow-md hover:-translate-y-[1px]
        focus:outline-none focus:ring-2 focus:ring-red-500/30"
      >
        <div
          className="flex h-10 w-10 items-center justify-center rounded-full
          border border-gray-200 dark:border-gray-700
          bg-gray-900 text-white
          shadow-sm transition-all duration-300
          group-hover:bg-red-600"
        >
          <FaUser size={16} />
        </div>

        <span
          className="pr-2 text-sm lg:text-base font-medium
          text-red-700 dark:text-slate-200
          whitespace-nowrap max-w-[140px] truncate"
        >
          {user?.name}
        </span>
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-150"
        enterFrom="transform opacity-0 scale-95 translate-y-1"
        enterTo="transform opacity-100 scale-100 translate-y-0"
        leave="transition ease-in duration-100"
        leaveFrom="transform opacity-100 scale-100 translate-y-0"
        leaveTo="transform opacity-0 scale-95 translate-y-1"
      >
        <Menu.Items
          className="absolute right-0 mt-3 w-56 origin-top-right rounded-2xl
          border border-gray-200 dark:border-gray-700
          bg-white dark:bg-gray-800
          p-2 shadow-xl ring-1 ring-black/5
          focus:outline-none z-[9999]"
        >
          <Menu.Item>
            {({ active }) => (
              <Link
                to="/dashboard"
                className={`flex w-full items-center rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  active
                    ? "bg-red-50 text-red-700 dark:bg-gray-700 dark:text-red-400"
                    : "text-gray-700 dark:text-white"
                }`}
              >
                <FaUser className="mr-3" />
                My Account
              </Link>
            )}
          </Menu.Item>

          <Menu.Item>
            {({ active }) => (
              <Link
                to="/profile"
                className={`flex w-full items-center rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  active
                    ? "bg-red-50 text-red-700 dark:bg-gray-700 dark:text-red-400"
                    : "text-gray-700 dark:text-white"
                }`}
              >
                <FaUserLock className="mr-3" />
                Security
              </Link>
            )}
          </Menu.Item>

          <div className="my-2 border-t border-gray-200 dark:border-gray-700" />

          <Menu.Item>
            {({ active }) => (
              <button
                onClick={logoutHandler}
                className={`flex w-full items-center rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  active
                    ? "bg-red-50 text-red-700 dark:bg-gray-700 dark:text-red-400"
                    : "text-red-600"
                }`}
              >
                <IoLogOutOutline className="mr-3" />
                Logout
              </button>
            )}
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default Avatar;