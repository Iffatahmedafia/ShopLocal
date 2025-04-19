import { useState, useEffect } from "react";
import { Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Product from "./pages/Product";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VendorRegistration from "./components/VendorRegistration.jsx";
import ProfilePage from "./pages/ProfilePage";
import FavoriteProduct from "./pages/FavoriteProduct";
import Brand from "./pages/Brands.jsx"
import Sidebar from "./components/Sidebar.jsx";
import ProductList from "./components/UserPanel/ProductList.jsx";
import BrandDetail from "./components/UserPanel/BrandDetail.jsx";
import Dashboard from "./components/UserPanel/Dashboard.jsx";
import Categories from "./pages/AdminPanel/Categories.jsx";
import Users from "./pages/AdminPanel/Users.jsx";
import BrandList from "./pages/AdminPanel/BrandList.jsx";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { setCredentials } from "./redux/slices/authSlice";
import { SearchProvider } from './SearchContext.jsx';
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const fetchUser = async (dispatch) => {
  try {
    const response = await fetch("http://localhost:8000/api/check_auth/", {
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

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen">
      {/* Navbar stays fixed at the top */}
      <div className="w-full fixed top-0 left-0 right-0 z-10">
        <Navbar count={favouritesCount} />
      </div>

      {/* Main content */}
      <div className="flex flex-1 mt-[100px]"> {/* Add margin-top to push content below the navbar */}
        {/* Sidebar remains fixed on the left */}
        <Sidebar open={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        
        {/* Main content area */}
        <div
          className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'} overflow-y-auto`}
        >
          <Outlet /> {/* Renders the child routes inside Layout */}
        </div>
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
    </div>
  );
}

function App() {
  const [favouritesCount, setFavouritesCount] = useState(0);
  const dispatch = useDispatch();

  useEffect(() => {
    fetchUser(dispatch); // Call when the page loads
  }, [dispatch]);
  
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
              <Route path="/brand_detail" element={<BrandDetail />} />
              <Route path="/brandlist" element={<BrandList />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/users" element={<Users />} />
              <Route path="/favorites" element={<FavoriteProduct updateFavouritesCount={setFavouritesCount} />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/security" element={<ProfilePage />} />
            </Route>
          
          {/* Login & Register should not have the Navbar */}
          <Route path="/register" element={<Register />} />
          <Route path="/vendor_register" element={<VendorRegistration />} />
          <Route path="/login" element={<Login />} />
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
