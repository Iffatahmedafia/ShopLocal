import {
  FaTasks,
  FaIndustry,
  FaBoxOpen,
  FaHeart,
  FaTag,
  FaTrashAlt,
  FaUsers,
  FaThList,
  FaChevronDown,
  FaChevronUp,
  FaUserCircle,
  FaLock
} from "react-icons/fa";
import { MdDashboard, MdSettings } from "react-icons/md";

export const getNavLinksByRole = (role) => {
  const baseLinks = [
    { link: 'dashboard', label: 'Dashboard', icon: <MdDashboard size={20} />, roles: ['admin', 'user','brand'] },
    { link: 'brandlist', label: 'Brands', icon: <FaIndustry size={20} />, roles: ['admin'] },
    { link: 'brand_detail', label: 'Brand Detail', icon: <FaIndustry size={20} />, roles: ['brand'] },
    { link: 'saved_brands', label: 'Saved Brand', icon: <FaIndustry size={20} />, roles: ['user'] },
    { link: 'productlist', label: 'Products', icon: <FaBoxOpen size={22} />, roles: ['admin', 'brand'] },
    { link: 'favorites', label: "Favourite Product", icon: <FaHeart size={20} />, roles: ['user'] },
    { link: 'categories', label: 'Categories', icon: <FaThList size={20} />, roles: ['admin'] },
    { link: 'users', label: 'Users', icon: <FaUsers size={22} />, roles: ['admin'] },
    { link: 'trash', label: 'Trash', icon: <FaTrashAlt size={20} />, roles: ['admin','brand'] },
    { link: 'profile', label: 'Settings', icon: <MdSettings size={22} />, roles: ['admin', 'user', 'brand'] },
  ];

  return baseLinks.filter((link) => link.roles.includes(role));
};
