import { LayoutDashboard, Tag, Box, List, Users, Trash2, Settings } from 'lucide-react';
import { FaTasks, FaIndustry, FaBoxOpen, FaHeart, FaTag, FaTrashAlt, FaUsers, FaThList, FaChevronDown, FaChevronUp, FaUserCircle, FaLock } from "react-icons/fa";

export const getNavLinksByRole = (role) => {
  const baseLinks = [
    { link: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard />, roles: ['admin', 'user','brand'] },
    { link: 'brandlist', label: 'Brands', icon: <Tag />, roles: ['admin'] },
    { link: 'brand_detail', label: 'Brand Detail', icon: <Tag />, roles: ['brand'] },
    { link: 'saved_brands', label: 'Saved Brand', icon: <Tag />, roles: ['user'] },
    { link: 'productlist', label: 'Products', icon: <Box />, roles: ['admin', 'brand'] },
    { link: 'favorites', label: "Favourite Product", icon: <FaHeart />, roles: ['user'] },
    { link: 'categories', label: 'Categories', icon: <List />, roles: ['admin'] },
    { link: 'users', label: 'Users', icon: <Users />, roles: ['admin'] },
    { link: 'trash', label: 'Trash', icon: <Trash2 />, roles: ['admin','brand'] },
    { link: 'profile', label: 'Settings', icon: <Settings />, roles: ['admin', 'user', 'brand'] },
  ];

  return baseLinks.filter((link) => link.roles.includes(role));
};
