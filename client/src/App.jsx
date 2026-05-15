import { Suspense, lazy, useState, useEffect } from "react";
import { Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { setCredentials, logout } from "./redux/slices/authSlice";
import { SearchProvider } from './context/SearchContext.jsx'
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { LookupDataProvider } from "./context/LookupDataContext.jsx";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar.jsx";
import MobileSidebar from "./components/MobileSidebar.jsx";
import Chatbot from "./components/Chatbot.jsx";
import Breadcrumb from "./components/Breadcrumb.jsx";
import Footer from "./components/Footer.jsx";
import { fetchCart } from "./api.js";

const Home = lazy(() => import("./pages/Home"));
const Product = lazy(() => import("./pages/Product"));
const ProductDetail = lazy(() => import("./pages/ProductDetail.jsx"));
const Brand = lazy(() => import("./pages/Brands.jsx"));
const Login = lazy(() => import("./pages/Authentication/Login.jsx"));
const Register = lazy(() => import("./pages/Authentication/Register.jsx"));
const ForgotPassword = lazy(() => import("./pages/Authentication/ForgotPassword.jsx"));
const ResetPassword = lazy(() => import("./pages/Authentication/ResetPassword.jsx"));
const VendorRegistration = lazy(() => import("./pages/Authentication/VendorRegistration.jsx"));
const ProfilePage = lazy(() => import("./pages/Shared/ProfilePage.jsx"));
const Dashboard = lazy(() => import("./pages/Shared/Dashboard.jsx"));
const ProductList = lazy(() => import("./pages/Shared/ProductList.jsx"));
const Trash = lazy(() => import("./pages/Shared/Trash.jsx"));
const BrandDetail = lazy(() => import("./pages/BrandPanel/BrandDetail.jsx"));
const Categories = lazy(() => import("./pages/AdminPanel/Categories.jsx"));
const Users = lazy(() => import("./pages/AdminPanel/Users.jsx"));
const BrandList = lazy(() => import("./pages/AdminPanel/BrandList.jsx"));
const FavoriteProduct = lazy(() => import("./pages/UserPanel/FavoriteProduct.jsx"));
const SavedBrand = lazy(() => import("./pages/UserPanel/SavedBrand.jsx"));
const Cart = lazy(() => import("./pages/UserPanel/Cart.jsx"));
const Checkout = lazy(() => import("./pages/UserPanel/Checkout.jsx"));
const OrderConfirmation = lazy(() => import("./pages/UserPanel/OrderConfirmation.jsx"));
const Orders = lazy(() => import("./pages/Shared/Orders.jsx"));

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const fetchUser = async (dispatch) => {
  try {
    const response = await fetch(`${API_URL}/check_auth/`, {
      method: "GET",
      credentials: "include", // Send cookies for authentication
    });

    const userData = await response.json();

    if (response.ok && userData.authenticated) {
      dispatch(setCredentials({ user: userData.user })); 
      return;
    }

    dispatch(logout());
  } catch (error) {
    console.error("Failed to verify user:", error);
    dispatch(logout());
  }
};

// const ProtectedRoute = () => {
//   const { user } = useSelector((state) => state.auth);
//     return user ? <Outlet /> : <Navigate to="/login" replace />
         
  
// };

const ProtectedRoute = ({ favouritesCount, cartCount }) => {
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
      <div className="w-full fixed top-0 left-0 right-0 z-30">
        <Navbar count={favouritesCount} cartCount={cartCount} />
      </div>

      {/* Mobile Sidebar (only on mobile view) */}
      {isMobile && <MobileSidebar />}

      <div className={`flex-1 flex ${isMobile ? '' : 'mt-32'}`}>
        {/* Desktop Sidebar (hidden on mobile) */}
        {!isMobile && (
          <Sidebar open={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        )}

        {/* Main Content Area */}
        <div
          className={`flex-1 transition-all duration-300 overflow-y-auto bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-white ${
            !isMobile ? (sidebarOpen ? 'ml-64' : 'ml-0') : ''
          }`}
        >
          <div className="px-4 pt-10 sm:px-6 lg:px-8">
            {location.pathname !== '/' && <Breadcrumb />}
          </div>  
          <Outlet />
        </div>
        <Chatbot />  
      </div>
    </div>
  )  
};


function Layout({ favouritesCount, cartCount }) {
  const location = useLocation();
  const hideNavbar = location.pathname === "/login" || location.pathname === "/register";

  return (
    <div>
      {!hideNavbar && <Navbar count={favouritesCount} cartCount={cartCount} />}
      <Outlet /> {/* Renders the child routes inside Layout */}
      <Chatbot />
      <Footer />
    </div>
  );
}

function App() {
  const [favouritesCount, setFavouritesCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const init = async () => {
      await fetchUser(dispatch);
      setLoading(false);
    };
    init();
  }, [dispatch]);

  useEffect(() => {
    const loadCartCount = async () => {
      if (!user) {
        setCartCount(0);
        return;
      }

      const data = await fetchCart();
      setCartCount(data.total_items || 0);
    };

    loadCartCount();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl font-semibold">Loading...</div>
      </div>
    );
  }

  return (
    <ThemeProvider>
    <LookupDataProvider>
    <SearchProvider> {/* Wrap the entire app with SearchProvider */}
      <main className="w-full min-h-screen">
        <Suspense fallback={<div className="flex items-center justify-center h-screen"><div className="text-xl font-semibold">Loading...</div></div>}>
        <Routes>
          {/* Layout will be applied to all these routes */}
          <Route element={<Layout favouritesCount={favouritesCount} cartCount={cartCount} />}>
            <Route path="/" element={<Home updateFavouritesCount={setFavouritesCount} updateCartCount={setCartCount} />} />
            <Route path="/products" element={<Product updateFavouritesCount={setFavouritesCount} updateCartCount={setCartCount} />} />
            <Route path="/products/category/:categoryId" element={<Product updateFavouritesCount={setFavouritesCount} updateCartCount={setCartCount} />} />
            <Route path="/products/subcategory/:subcategoryId" element={<Product updateFavouritesCount={setFavouritesCount} updateCartCount={setCartCount} />} />
            <Route path="/products/sub/:subsubcategoryId" element={<Product updateFavouritesCount={setFavouritesCount} updateCartCount={setCartCount} />} />
            <Route path="/products/:productId" element={<ProductDetail updateCartCount={setCartCount} />} />
            <Route path="/brands" element={<Brand />} />
          </Route>
          <Route element={<ProtectedRoute favouritesCount={favouritesCount} cartCount={cartCount} />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/productlist" element={<ProductList />} />
              <Route path="/trash" element={<Trash />} />
              <Route path="/brand_detail" element={<BrandDetail />} />
              <Route path="/brandlist" element={<BrandList />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/users" element={<Users />} />
              <Route path="/favorites" element={<FavoriteProduct updateFavouritesCount={setFavouritesCount} />} />
              <Route path="/cart" element={<Cart updateCartCount={setCartCount} />} />
              <Route path="/checkout" element={<Checkout updateCartCount={setCartCount} />} />
              <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
              <Route path="/orders" element={<Orders />} />
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
        </Suspense>

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
    </LookupDataProvider>
    </ThemeProvider>
  );
}

export default App;
