import React, { useState } from "react";
import {
  MdDashboard,
  MdSettings,
  MdTaskAlt,
} from "react-icons/md";
import { FaTasks, FaIndustry, FaBoxOpen, FaHeart, FaTag, FaTrashAlt, FaUsers, FaThList, FaChevronDown, FaChevronUp, FaUserCircle, FaLock } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { getNavLinksByRole } from "./NavLinksByRole";


const Sidebar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();
  const path = location.pathname.split("/")[1];
  const { darkMode } = useTheme(); // Get the current theme state

  // State for Settings submenu
  const [openSettings, setOpenSettings] = useState(false);
  const role = user?.is_admin
      ? 'admin'
      : user?.is_brand
      ? 'brand'
      : 'user';
  
  const linkData = getNavLinksByRole(role);


  return (
    <div
      className={`fixed top-[100px] left-0 w-64 h-screen overflow-y-auto transition-all duration-300 transform ${
        darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
      }`}
    >
      <div className="h-full flex flex-col gap-5 p-5 shadow-lg">
        {/* Sidebar Header */}
        {/* <h1 className="flex gap-2 items-center text-2xl font-bold">
          Shop Local
        </h1> */}

        {/* Sidebar Links */}
        <div className="flex-1 flex flex-col gap-4 py-4">
          {linkData
          .filter(el => el.label !== 'Settings')
          .map((el) => (
            <Link
              key={el.label}
              to={el.link}
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-300 ${
                path === el.link.split("/")[0]
                  ? "bg-red-100 text-red-700"
                  : "text-gray-700 dark:text-white hover:bg-red-100 hover:text-red-700"
              }`}
            >
              {el.icon}
              <span>{el.label}</span>
            </Link>
          ))}
          {/* Divider */}
        <div className="border-t border-gray-300 dark:border-gray-600 my-4"></div>

         {/* Settings */}
        {linkData
        .filter(el => el.label === 'Settings')
        .map((el) => (
          <Link
            key={el.label}
            to={el.link}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-300 ${
              path === el.link.split("/")[0]
                ? "bg-red-100 text-red-700"
                : "text-gray-700 dark:text-white hover:bg-red-100 hover:text-red-700"
            }`}
          >
            {el.icon}
            <span>{el.label}</span>
          </Link>
        ))}

          {/* Settings Button with Dropdown */}
          {/* <div>
            <button
              className="w-full flex items-center justify-between p-2 text-lg text-gray-700 dark:text-white hover:bg-red-100 hover:text-red-700 rounded-lg transition-all duration-300"
              onClick={() => setOpenSettings(!openSettings)}
            >
              <span className="flex items-center gap-3">
                <MdSettings size={22} />
                <Link to="/profile" className="block px-3 py-1 flex items-center gap-2 rounded-md text-gray-600 hover:bg-red-100 hover:text-red-700"> 
                      Settings
                </Link>
              </span>
            </button> */}

            {/* Sub-links under Settings */}
            {/* {openSettings && (
              <div className="ml-8 mt-1 space-y-2">
                <ul className="ml-4 list-disc space-y-2">
                  <li>
                    <Link to="/profile" className="block px-3 py-1 flex items-center gap-2 rounded-md text-gray-600 hover:bg-red-100 hover:text-red-700"> 
                      Profile
                    </Link>
                  </li>
                </ul>
              </div>
            )} */}
          </div>
        </div>
      </div>
  );
};

export default Sidebar;
