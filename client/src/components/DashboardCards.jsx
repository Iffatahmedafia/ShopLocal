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
  Star
} from "lucide-react";

const cardConfig = {
  users: {
    icon: <Users className="h-7 w-7" />,
    title: "Total Users",
    accent: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-200",
    role: "admin",
  },
  brands: {
    icon: <Store className="h-7 w-7" />,
    title: "Total Brands",
    accent: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200",
    role: "admin",
  },
  pending_brands: {
    icon: <AlertTriangle className="h-7 w-7" />,
    title: "Pending Brands",
    accent: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-200",
    role: "admin",
  },
  approved_brands: {
    icon: <CheckCircle className="h-7 w-7" />,
    title: "Approved Brands",
    accent: "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-200",
    role: "admin",
  },
  rejected_brands: {
    icon: <ThumbsDown className="h-7 w-7" />,
    title: "Rejected Brands",
    accent: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-200",
    role: "admin",
  },
  fav_brands: {
    icon: <Star className="h-7 w-7" />,
    title: "Saved Brands",
    accent: "bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-200",
    role: "user",
  },
  products: {
    icon: <ShoppingBag className="h-7 w-7" />,
    title: "Total Products",
    accent: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200",
    role: "admin,brand",
  },
  pending_products: {
    icon: <PackageSearch className="h-7 w-7" />,
    title: "Pending Products",
    accent: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-200",
    role: "admin,brand",
  },
  approved_products: {
    icon: <CheckCircle className="h-7 w-7" />,
    title: "Approved Products",
    accent: "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-200",
    role: "admin,brand",
  },
  rejected_products: {
    icon: <ThumbsDown className="h-7 w-7" />,
    title: "Rejected Products",
    accent: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-200",
    role: "admin,brand",
  },
  fav_products: {
    icon: <Heart className="h-7 w-7" />,
    title: "Favourite Products",
    accent: "bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-900/40 dark:text-fuchsia-200",
    role: "user",
  },
  Categories: {
    icon: <Tags className="h-7 w-7" />,
    title: "Total Categories",
    accent: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-200",
    role: "admin",
  },
};

const DashboardCard = ({ type, value }) => {
  const config = cardConfig[type];
  if (!config) return null;

  return (
    <div className="min-h-32 rounded-lg border border-gray-200 bg-white px-6 py-5 shadow-[0_10px_28px_rgba(15,28,46,0.07)] transition-all duration-300 hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-[0_14px_34px_rgba(15,28,46,0.1)] dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600">
      <div className="flex items-start justify-between gap-5">
        <div className="min-w-0">
          <h4 className="min-h-7 text-lg font-semibold leading-7 text-slate-500 dark:text-gray-300">{config.title}</h4>
          <p className="mt-3 text-4xl font-bold leading-none tracking-normal text-black dark:text-white">{value}</p>
        </div>
        <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl ${config.accent}`}>
          {config.icon}
        </div>
      </div>
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
    "md:grid-cols-2";

  return (
    <div className={`grid grid-cols-1 ${gridColsMd} gap-6 w-full`}>
      {visibleCards.map(([key, value]) => (
        <DashboardCard key={key} type={key} value={value} />
      ))}
    </div>
  );
};

export default DashboardCards;
