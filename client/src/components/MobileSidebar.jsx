// components/MobileSidebar.jsx
import React from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { getNavLinksByRole } from './NavLinksByRole';
  


const MobileSidebar = () => {
    const { user } = useSelector((state) => state.auth);
    const location = useLocation();
    const path = location.pathname.split("/")[1];
    const { darkMode } = useTheme(); // Get the current theme state
    const role = user?.is_admin
    ? 'admin'
    : user?.is_brand
    ? 'brand'
    : 'user';

    const linkData = getNavLinksByRole(role);

    // const linkData = [
    //     { label: "Dashboard", link: "dashboard", icon: <MdDashboard /> },
    //     { label: "Favourite Products", link: "favorites", icon: <FaHeart /> },
    //     { label: "Settings", link: "profile", icon: <MdSettings /> },
    //     // Show for brand users and admins
    //     ...(user?.is_brand || user?.is_admin
    //       ? [
    //           { label: "Products", link: "productlist", icon: <FaBoxOpen /> },
    //           { label: "Trash", link: "trash", icon: <FaTrashAlt /> },
    //         ]
    //       : []),
    //     ...(user?.is_brand
    //       ? [
    //           { label: "Brand Detail", link: "brand_detail", icon: <FaTag /> },
    //         ]
    //       : []),
    //     // Show only for admins
    //     ...(user?.is_admin
    //       ? [
    //           { label: "Brands", link: "brandlist", icon: <FaThList /> },
    //           { label: "Categories", link: "categories", icon: <FaThList /> },
    //           { label: "Users", link: "users", icon: <FaUsers /> },
    
    //         ]
    //       : []),
       
    //   ];

  return (
    <div className="block md:hidden bg-white shadow-md px-4 py-6 mt-[120px]">
      <div className="flex flex-col gap-3">
        {linkData.map((el) => (
            <Link
                key={el.label}
                to={el.link}
                className={`flex items-center gap-3 rounded-xl p-3 shadow transition transition-all duration-300 ${
                path === el.link.split("/")[0]
                    ? "bg-red-100 text-red-700"
                    : "bg-gray-100 dark:text-white hover:bg-red-100 hover:text-red-700"
                }`}
            >
                {el.icon}
                <span>{el.label}</span>
            </Link>
            ))}
      </div>
    </div>
  );
};

export default MobileSidebar;
