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
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { setCredentials } from "./redux/slices/authSlice";
import { SearchProvider } from './SearchContext.jsx';
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

const ProtectedRoute = () => {
  const { user } = useSelector((state) => state.auth);

  return user ? <Outlet /> : <Navigate to="/login" replace />;
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
    <SearchProvider> {/* Wrap the entire app with SearchProvider */}
      <main className="w-full min-h-screen">
        <Routes>
          {/* Layout will be applied to all these routes */}
          <Route element={<Layout favouritesCount={favouritesCount} />}>
            <Route path="/" element={<Home updateFavouritesCount={setFavouritesCount} />} />
            <Route path="/products" element={<Product updateFavouritesCount={setFavouritesCount} />} />
            <Route path="/products/:subcategoryId" element={<Product updateFavouritesCount={setFavouritesCount} />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/favorites" element={<FavoriteProduct />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/security" element={<ProfilePage />} />
            </Route>
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
  );
}

export default App;
