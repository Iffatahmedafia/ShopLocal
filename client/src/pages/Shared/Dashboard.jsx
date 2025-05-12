import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  fetchUsers,
  fetchBrands,
  fetchCategories,
  fetchProducts,
  fetchFavorites,
  fetchSavedBrands
} from "../../api";
import DashboardCards from "../../components/DashboardCards";

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [savedBrands, setSavedBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  const role = user?.is_admin
    ? "admin"
    : user?.is_brand
    ? "brand"
    : "user";

  useEffect(() => {
    const getUsers = async () => {
      const data = await fetchUsers();
      setUsers(data);
      setLoading(false);
    };
    if (role === "admin") getUsers();
  }, [role]);

  useEffect(() => {
    const getBrands = async () => {
      const data = await fetchBrands();
      setBrands(data);
      setLoading(false);
    };
    getBrands();
  }, []);

  useEffect(() => {
    const getProducts = async () => {
      const data = await fetchProducts();
      const filtered = user?.is_brand
        ? data.filter(
            (product) => product.user === user.id && !product.is_trashed
          )
        : data;
      setProducts(filtered);
      setLoading(false);
    };
    getProducts();
  }, [user]);

  useEffect(() => {
    const getCategories = async () => {
      const data = await fetchCategories();
      setCategories(data);
      setLoading(false);
    };
    getCategories();
  }, []);

  useEffect(() => {
    const getFavoritesProduct = async () => {
      const data = await fetchFavorites();
      if (!data) {
        navigate("/login");
        return;
      }
      setFavorites(data);
    };
    if (role === "user") getFavoritesProduct();
  }, [role, navigate]);

  useEffect(() => {
    const getSavedBrandData = async () => {
      const data = await fetchSavedBrands();
      if (!data) {
        navigate("/login");
        return;
      }
      setSavedBrands(data);
    };
    if (role === "user") getSavedBrandData();
  }, [role, navigate]);

  const stats = {
    users: users.length,
    brands: brands.length,
    pending_brands: brands.filter((b) => b.status === "Pending").length,
    approved_brands: brands.filter((b) => b.status === "Approved").length,
    rejected_brands: brands.filter((b) => b.status === "Rejected").length,
    fav_brands: savedBrands.length,
    products: products.length,
    pending_products: products.filter((p) => p.status === "Pending").length,
    approved_products: products.filter((p) => p.status === "Approved").length,
    rejected_products: products.filter((p) => p.status === "Rejected").length,
    fav_products: favorites.length,
    Categories: categories.length,
  };

  return (
    <div className="md:ml-12 p-6 md:p-2 mt-6">
      <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>
      {!loading && <DashboardCards stats={stats} role={role} />}
    </div>
  );
};

export default Dashboard;
