import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { FiArrowLeft, FiExternalLink, FiHeart, FiShoppingCart, FiTag } from "react-icons/fi";
import { MapPin, Store } from "lucide-react";

import { addToCart, fetchBrands, fetchCart, fetchProduct, fetchProducts } from "../api";
import ProductCard from "../components/ProductCard";
import { logInteraction } from "../utils/logInteraction";

const getFullImageUrl = (image) => {
  if (!image || image === "images/default.jpg") return "https://placehold.co/700x520";
  if (image.startsWith("http")) return image;
  if (image.startsWith("/")) return image;
  return `/${image}`;
};

const formatMoney = (value) => {
  if (value === null || value === undefined || value === "") return "Price unavailable";
  const amount = Number(value);
  if (Number.isNaN(amount)) return `$${value}`;
  return amount.toLocaleString("en-CA", {
    style: "currency",
    currency: "CAD",
  });
};

const ProductDetail = ({ updateCartCount }) => {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";
  const { productId } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [product, setProduct] = useState(null);
  const [brands, setBrands] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    const loadProductDetail = async () => {
      setLoading(true);
      try {
        const [productData, brandData, productList] = await Promise.all([
          fetchProduct(productId),
          fetchBrands(),
          fetchProducts(),
        ]);

        setProduct(productData);
        setBrands(brandData);

        const related = productList
          .filter((item) => item.id !== productData.id)
          .filter((item) => {
            const sameBrand = productData.brand_id && item.brand_id === productData.brand_id;
            const sameCategory =
              productData.category && item.category === productData.category;
            const sameComputedCategory =
              productData.computed_category?.id &&
              item.computed_category?.id === productData.computed_category.id;

            return sameBrand || sameCategory || sameComputedCategory;
          })
          .slice(0, 3);

        setRelatedProducts(related);

        if (user) {
          logInteraction({ userId: user.id, productId: productData.id, action: "view" });
        }
      } catch (error) {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    loadProductDetail();
  }, [productId, user]);

  const brand = useMemo(
    () => brands.find((item) => item.id === product?.brand_id),
    [brands, product?.brand_id]
  );

  const categoryName =
    product?.computed_category?.name ||
    product?.category?.name ||
    brand?.category?.name ||
    "Local product";

  const handleAddToCart = async () => {
    if (!user) {
      toast.error("You must be logged in to add to cart!");
      navigate("/login");
      return;
    }

    setAddingToCart(true);
    try {
      await addToCart(product.id, 1);
      const cart = await fetchCart();
      updateCartCount?.(cart.total_items || 0);
      toast.success("Product added to cart successfully!");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        error.response?.data?.product?.[0] ||
        "Could not add product to cart."
      );
    } finally {
      setAddingToCart(false);
    }
  };

  const handleFavorite = async () => {
    if (!user) {
      toast.error("You must be logged in to add to favorites!");
      navigate("/login");
      return;
    }

    try {
      await axios.post(
        `${API_URL}/favorites/add/`,
        { product: product.id },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      toast.success("Product added to favorites successfully!");
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error("This product is already in your favorites!");
      } else {
        toast.error("An error occurred. Please try again later.");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-12 dark:bg-gray-900">
        <div className="mx-auto max-w-6xl animate-pulse">
          <div className="h-6 w-40 rounded bg-gray-200 dark:bg-gray-800" />
          <div className="mt-8 grid gap-8 lg:grid-cols-2">
            <div className="h-[420px] rounded-2xl bg-gray-200 dark:bg-gray-800" />
            <div className="space-y-4">
              <div className="h-10 w-3/4 rounded bg-gray-200 dark:bg-gray-800" />
              <div className="h-6 w-1/3 rounded bg-gray-200 dark:bg-gray-800" />
              <div className="h-32 rounded bg-gray-200 dark:bg-gray-800" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-16 text-center dark:bg-gray-900">
        <h1 className="text-3xl font-bold text-gray-950 dark:text-white">Product not found</h1>
        <p className="mt-3 text-gray-500 dark:text-gray-400">This product may no longer be available.</p>
        <Link
          to="/products"
          className="mt-8 inline-flex rounded-full bg-red-700 px-6 py-3 font-semibold text-white transition hover:bg-red-800"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-red-700 transition hover:text-red-800 dark:text-red-300"
        >
          <FiArrowLeft />
          Back
        </button>

        <section className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="overflow-hidden rounded-2xl border border-red-100/70 bg-gradient-to-b from-red-50/45 via-white to-white p-4 shadow-[0_14px_35px_rgba(15,28,46,0.08)] dark:border-gray-700 dark:from-red-950/10 dark:via-gray-800 dark:to-gray-800">
            <div className="overflow-hidden rounded-xl bg-white dark:bg-gray-900">
              <img
                src={getFullImageUrl(product.image)}
                alt={product.name}
                className="h-[320px] w-full object-cover sm:h-[460px]"
              />
            </div>
          </div>

          <div className="flex flex-col rounded-2xl border border-red-100/70 bg-gradient-to-b from-red-50/45 via-white to-white p-6 shadow-[0_14px_35px_rgba(15,28,46,0.08)] dark:border-gray-700 dark:from-red-950/10 dark:via-gray-800 dark:to-gray-800">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-700 ring-1 ring-red-100 dark:bg-red-900/20 dark:text-red-200 dark:ring-red-900">
                <FiTag />
                {categoryName}
              </span>
              {brand?.canadian_owned && (
                <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-gray-700 ring-1 ring-red-100 dark:bg-gray-900 dark:text-gray-200 dark:ring-gray-700">
                  Canadian Owned
                </span>
              )}
            </div>

            <h1 className="mt-5 text-3xl font-bold leading-tight text-[#111827] dark:text-white sm:text-4xl">
              {product.name}
            </h1>
            <p className="mt-2 text-base font-medium text-gray-500 dark:text-gray-400">
              Brand: <span className="text-gray-800 dark:text-gray-200">{brand?.name || "N/A"}</span>
            </p>

            <div className="mt-5">
              <span className="inline-flex rounded-full bg-red-50 px-4 py-2 text-xl font-bold text-red-700 ring-1 ring-red-100 dark:bg-red-900/20 dark:text-red-200 dark:ring-red-900">
                {formatMoney(product.price)}
              </span>
            </div>

            <p className="mt-6 leading-7 text-gray-600 dark:text-gray-300">
              {product.description || "No description available for this product yet."}
            </p>

            {Array.isArray(product.tags) && product.tags.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-gray-600 ring-1 ring-gray-200 dark:bg-gray-900 dark:text-gray-300 dark:ring-gray-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-6 rounded-xl bg-white/80 p-4 ring-1 ring-red-50 dark:bg-gray-900/50 dark:ring-gray-700">
              <h2 className="text-sm font-semibold text-[#111827] dark:text-gray-100">Where to Buy</h2>
              <div className="mt-3 space-y-3 text-sm text-gray-700 dark:text-gray-300">
                <p className="flex gap-2">
                  <Store className="mt-0.5 h-4 w-4 shrink-0 text-red-700 dark:text-red-300" />
                  <span><span className="font-semibold">Retail Store:</span> {product.retail_store || "Not Available"}</span>
                </p>
                <p className="flex gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-red-700 dark:text-red-300" />
                  <span><span className="font-semibold">Supermarket:</span> {product.supershop_store || "Not Available"}</span>
                </p>
                <p className="flex gap-2">
                  <FiExternalLink className="mt-0.5 h-4 w-4 shrink-0 text-red-700 dark:text-red-300" />
                  <span>
                    <span className="font-semibold">Online:</span>{" "}
                    {product.online_store ? (
                      <a
                        href={product.online_store}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-red-600 hover:underline dark:text-red-400"
                      >
                        Visit store
                      </a>
                    ) : (
                      "Not Available"
                    )}
                  </span>
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={addingToCart}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-red-200 bg-white py-3 font-semibold text-red-700 shadow-sm transition-all duration-300 hover:bg-red-700 hover:text-white hover:shadow-[0_10px_22px_rgba(185,28,28,0.22)] disabled:cursor-not-allowed disabled:opacity-60 dark:border-red-900 dark:bg-gray-800 dark:text-red-300 dark:hover:bg-red-700 dark:hover:text-white"
              >
                <FiShoppingCart />
                {addingToCart ? "Adding..." : "Add to Cart"}
              </button>
              <button
                type="button"
                onClick={handleFavorite}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-red-700 py-3 font-semibold text-white shadow-[0_10px_22px_rgba(185,28,28,0.22)] transition-all duration-300 hover:bg-red-800 active:scale-95"
              >
                <FiHeart />
                Add to Favorites
              </button>
            </div>
          </div>
        </section>

        {relatedProducts.length > 0 && (
          <section className="mt-12 border-t border-gray-200 pt-8 dark:border-gray-700">
            <div className="mb-5 flex items-center justify-between gap-4">
              <h2 className="text-2xl font-bold text-[#111827] dark:text-white">Related Products</h2>
              <Link to="/products" className="text-sm font-semibold text-red-700 hover:text-red-800 dark:text-red-300">
                View all products
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedProducts.map((item) => {
                const relatedBrand = brands.find((brandItem) => brandItem.id === item.brand_id);
                return (
                  <ProductCard
                    key={item.id}
                    product={{ ...item, brandName: relatedBrand?.name || "N/A" }}
                    updateCartCount={updateCartCount}
                    type="add"
                    onClick={() => {
                      if (user) {
                        logInteraction({ userId: user.id, productId: item.id, action: "click" });
                      }
                      navigate(`/products/${item.id}`);
                    }}
                  />
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
