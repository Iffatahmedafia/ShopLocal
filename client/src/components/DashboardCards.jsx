import React from "react";
import {
  Users,
  Store,
  CheckCircle,
  AlertTriangle,
  Heart,
  PackageSearch,
  Tags,
  ThumbsDown,
  ShoppingBag,
  Star, StarOff
} from "lucide-react";

const cardConfig = {
  users: {
    icon: <Users className="h-6 w-6 text-blue-600" />,
    title: "Total Users",
    bg: "bg-blue-100 dark:bg-blue-800",
    role: "admin",
  },
  brands: {
    icon: <Store className="h-6 w-6 text-green-600" />,
    title: "Total Brands",
    bg: "bg-green-100 dark:bg-green-800",
    role: "admin",
  },
  pending_brands: {
    icon: <AlertTriangle className="h-6 w-6 text-yellow-600" />,
    title: "Pending Brands",
    bg: "bg-yellow-100 dark:bg-yellow-800",
    role: "admin",
  },
  approved_brands: {
    icon: <CheckCircle className="h-6 w-6 text-emerald-600" />,
    title: "Approved Brands",
    bg: "bg-emerald-100 dark:bg-emerald-800",
    role: "admin",
  },
  rejected_brands: {
    icon: <ThumbsDown className="h-6 w-6 text-red-600" />,
    title: "Rejected Brands",
    bg: "bg-red-100 dark:bg-red-800",
    role: "admin",
  },
  fav_brands: {
    icon: <Star className="h-6 w-6 text-pink-600" />,
    title: "Saved Brands",
    bg: "bg-red-100 dark:bg-red-700",
    role: "user",
  },
  products: {
    icon: <ShoppingBag className="h-6 w-6 text-purple-600" />,
    title: "Total Products",
    bg: "bg-purple-100 dark:bg-purple-700",
    role: "admin,brand",
  },
  pending_products: {
    icon: <PackageSearch className="h-6 w-6 text-yellow-600" />,
    title: "Pending Products",
    bg: "bg-yellow-100 dark:bg-yellow-800",
    role: "admin,brand",
  },
  approved_products: {
    icon: <CheckCircle className="h-6 w-6 text-teal-600" />,
    title: "Approved Products",
    bg: "bg-teal-100 dark:bg-teal-800",
    role: "admin,brand",
  },
  rejected_products: {
    icon: <ThumbsDown className="h-6 w-6 text-red-600" />,
    title: "Rejected Products",
    bg: "bg-red-100 dark:bg-red-800",
    role: "admin,brand",
  },
  fav_products: {
    icon: <Heart className="h-6 w-6 text-fuchsia-600" />,
    title: "Favourite Products",
    bg: "bg-red-100 dark:bg-red-700",
    role: "user",
  },
  Categories: {
    icon: <Tags className="h-6 w-6 text-indigo-600" />,
    title: "Total Categories",
    bg: "bg-indigo-100 dark:bg-indigo-800",
    role: "admin",
  },
};

const DashboardCard = ({ type, value }) => {
  const config = cardConfig[type];
  if (!config) return null;

  return (
    <div className={`rounded-xl shadow-md p-5 flex items-center justify-between transition-transform transform hover:-translate-y-1 hover:shadow-lg cursor-pointer ${config.bg}`}>
      <div>
        <h4 className="text-gray-700 dark:text-white text-sm font-medium">{config.title}</h4>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
      </div>
      <div className="bg-white dark:bg-gray-900 p-2 rounded-full shadow">{config.icon}</div>
    </div>
  );
};

const DashboardCards = ({ stats, role }) => {
  const visibleCards = Object.entries(stats).filter(([key, _]) => {
    const config = cardConfig[key];
    return config && config.role.split(",").map(r => r.trim()).includes(role);
  });

  const cardCount = visibleCards.length;

  // Determine Tailwind grid-cols class for medium and up
  const gridColsMd = 
    cardCount === 1 ? "md:grid-cols-1" :
    cardCount === 2 ? "md:grid-cols-2" :
    cardCount === 3 ? "md:grid-cols-3" :
    "md:grid-cols-4";

  return (
    <div className={`grid grid-cols-1 ${gridColsMd} gap-6 w-full`}>
      {visibleCards.map(([key, value]) => (
        <DashboardCard key={key} type={key} value={value} />
      ))}
    </div>
  );
};

export default DashboardCards;
