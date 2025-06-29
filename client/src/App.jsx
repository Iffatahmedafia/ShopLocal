import { useState, useEffect } from "react";
import { Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { setCredentials } from "./redux/slices/authSlice";
import { SearchProvider } from './context/SearchContext.jsx'
import { ThemeProvider } from "./context/ThemeContext.jsx";

import Home from "./pages/Home";
import Product from "./pages/Product";
import Brand from "./pages/Brands.jsx"

import Login from "./pages/Authentication/Login.jsx";
import Register from "./pages/Authentication/Register.jsx";
import ForgotPassword from "./pages/Authentication/ForgotPassword.jsx";
import ResetPassword from "./pages/Authentication/ResetPassword.jsx";
import VendorRegistration from "./pages/Authentication/VendorRegistration.jsx";

import ProfilePage from "./pages/Shared/ProfilePage.jsx";
import Dashboard from "./pages/Shared/Dashboard.jsx";
import ProductList from "./pages/Shared/ProductList.jsx";
import Trash from "./pages/Shared/Trash.jsx";

import BrandDetail from "./pages/BrandPanel/BrandDetail.jsx";

import Categories from "./pages/AdminPanel/Categories.jsx";
import Users from "./pages/AdminPanel/Users.jsx";
import BrandList from "./pages/AdminPanel/BrandList.jsx";

import FavoriteProduct from "./pages/UserPanel/FavoriteProduct.jsx";
import SavedBrand from "./pages/UserPanel/SavedBrand.jsx";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar.jsx";
import MobileSidebar from "./components/MobileSidebar.jsx";
import Chatbot from "./components/Chatbot.jsx";
import Breadcrumb from "./components/Breadcrumb.jsx";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const fetchUser = async (dispatch) => {
  const localUser = localStorage.getItem("user");
  if (localUser) return; // Already stored

  try {
    const response = await fetch(`${API_BASE}/check_auth/`, {
      method: "GET",
      credentials: "include", // Send cookies for authentication
    });

    if (response.ok) {
      const userData = await response.json();
      console.log("UserData",userData)
       if (userData.authenticated) {
      dispatch(setCredentials({ user: userData.user })); 
      }// Store user in Redux
    }
  } catch (error) {
    console.error("Failed to fetch user:", error);
  }
};

// const ProtectedRoute = () => {
//   const { user } = useSelector((state) => state.auth);
//     return user ? <Outlet /> : <Navigate to="/login" replace />
         
  
// };

const ProtectedRoute = ({ favouritesCount }) => {
  const { user } = useSelector((state) => state.auth);
  const [sidebarOpen, setSidebarOpen] = useState(true);  // Control sidebar visibility
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Fixed Navbar */}
      <div className="w-full fixed top-0 left-0 right-0 z-10">
        <Navbar count={favouritesCount} />
      </div>

      {/* Mobile Sidebar (only on mobile view) */}
      {isMobile && <MobileSidebar />}

      <div className={`flex-1 flex ${isMobile ? '' : 'mt-[100px]'}`}>
        {/* Desktop Sidebar (hidden on mobile) */}
        {!isMobile && (
          <Sidebar open={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        )}

        {/* Main Content Area */}
        <div
          className={`flex-1 transition-all duration-300 overflow-y-auto dark:bg-gray-900 dark:text-white ${
            !isMobile ? (sidebarOpen ? 'ml-64' : 'ml-0') : ''
          }`}
        >
          <div className="mt-4 md:mt-12 md:ml-6">
            {location.pathname !== '/' && <Breadcrumb />}
          </div>  
          <Outlet />
        </div>
        <Chatbot />
      </div>
    </div>
  )  
};


function Layout({ favouritesCount }) {
  const location = useLocation();
  const hideNavbar = location.pathname === "/login" || location.pathname === "/register";

  return (
    <div>
      {!hideNavbar && <Navbar count={favouritesCount} />}
      <Outlet /> {/* Renders the child routes inside Layout */}
      <Chatbot />
    </div>
  );
}

function App() {
  const [favouritesCount, setFavouritesCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const init = async () => {
      await fetchUser(dispatch);
      setLoading(false);
    };
    init();
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl font-semibold">Loading...</div>
      </div>
    );
  }

  return (
    <ThemeProvider>
    <SearchProvider> {/* Wrap the entire app with SearchProvider */}
      <main className="w-full min-h-screen">
        <Routes>
          {/* Layout will be applied to all these routes */}
          <Route element={<Layout favouritesCount={favouritesCount} />}>
            <Route path="/" element={<Home updateFavouritesCount={setFavouritesCount} />} />
            <Route path="/products" element={<Product updateFavouritesCount={setFavouritesCount} />} />
            <Route path="/products/category/:categoryId" element={<Product updateFavouritesCount={setFavouritesCount} />} />
            <Route path="/products/subcategory/:subcategoryId" element={<Product updateFavouritesCount={setFavouritesCount} />} />
            <Route path="/products/sub/:subsubcategoryId" element={<Product updateFavouritesCount={setFavouritesCount} />} />
            <Route path="/brands" element={<Brand />} />
          </Route>
          <Route element={<ProtectedRoute favouritesCount={favouritesCount} />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/productlist" element={<ProductList />} />
              <Route path="/trash" element={<Trash />} />
              <Route path="/brand_detail" element={<BrandDetail />} />
              <Route path="/brandlist" element={<BrandList />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/users" element={<Users />} />
              <Route path="/favorites" element={<FavoriteProduct updateFavouritesCount={setFavouritesCount} />} />
              <Route path="/saved_brands" element={<SavedBrand />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/security" element={<ProfilePage />} />
            </Route>
          
          {/* Login & Register should not have the Navbar */}
          <Route path="/register" element={<Register />} />
          <Route path="/vendor_register" element={<VendorRegistration />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Routes>

        {/* Toast container for showing notifications */}
        <ToastContainer 
          position="top-center" 
          autoClose={3000} 
          hideProgressBar={true} 
          newestOnTop 
          closeOnClick 
          pauseOnHover 
          draggable
        />
      </main>
    </SearchProvider>
    </ThemeProvider>
  );
}

export default App;
