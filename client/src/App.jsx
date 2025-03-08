import { useState } from "react";
import { Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Product from "./pages/Product";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  return (
    <main className="w-full min-h-screen">
      <Routes>
        {/* Layout will be applied to all these routes */}
        <Route element={<Layout favouritesCount={favouritesCount} />}>
          <Route path="/" element={<Home updateFavouritesCount={setFavouritesCount} />} />
          <Route path="/products" element={<Product />} />
          <Route path="/products/:subcategoryId" element={<Product />} />
        </Route>
        
        {/* Login & Register should not have the Navbar */}
        <Route path="/register" element={<Register />} />
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
  );
}

export default App;
