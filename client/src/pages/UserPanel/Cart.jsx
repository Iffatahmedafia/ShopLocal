import { useCallback, useEffect, useState } from "react";
import { FiMinus, FiPlus, FiTrash2, FiShoppingBag } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

import { clearCart, fetchCart, removeCartItem, updateCartItem } from "../../api";

const getFullImageUrl = (image) => {
  if (!image || image === "images/default.jpg") return "https://placehold.co/200";
  if (image.startsWith("http")) return image;
  if (image.startsWith("/")) return image;
  return `/${image}`;
};

const formatMoney = (value) => {
  const amount = Number(value || 0);
  return amount.toLocaleString("en-CA", {
    style: "currency",
    currency: "CAD",
  });
};

const Cart = ({ updateCartCount }) => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [cart, setCart] = useState({ items: [], total_items: 0, subtotal: "0.00" });
  const [loading, setLoading] = useState(true);
  const [updatingItemId, setUpdatingItemId] = useState(null);

  const loadCart = useCallback(async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    setLoading(true);
    const data = await fetchCart();
    setCart(data);
    updateCartCount?.(data.total_items || 0);
    setLoading(false);
  }, [navigate, updateCartCount, user]);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const handleQuantityChange = async (item, nextQuantity) => {
    if (nextQuantity < 1) return;

    try {
      setUpdatingItemId(item.id);
      await updateCartItem(item.id, nextQuantity);
      await loadCart();
    } catch (error) {
      toast.error(error.response?.data?.quantity?.[0] || "Could not update cart item.");
    } finally {
      setUpdatingItemId(null);
    }
  };

  const handleRemove = async (itemId) => {
    try {
      setUpdatingItemId(itemId);
      await removeCartItem(itemId);
      await loadCart();
      toast.success("Item removed from cart.");
    } catch (error) {
      toast.error("Could not remove item from cart.");
    } finally {
      setUpdatingItemId(null);
    }
  };

  const handleClear = async () => {
    try {
      await clearCart();
      setCart({ items: [], total_items: 0, subtotal: "0.00" });
      updateCartCount?.(0);
      toast.success("Cart cleared.");
    } catch (error) {
      toast.error("Could not clear cart.");
    }
  };

  if (loading) {
    return (
      <div className="md:ml-12 mt-6 p-6 md:p-2">
        <p className="text-gray-500 dark:text-gray-400">Loading cart...</p>
      </div>
    );
  }

  return (
    <div className="md:ml-12 mt-6 p-6 md:p-2">
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Shopping Cart</h2>
        {cart.items.length > 0 && (
          <button
            type="button"
            onClick={handleClear}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-950"
          >
            <FiTrash2 size={16} />
            Clear Cart
          </button>
        )}
      </div>

      {cart.items.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 bg-white p-10 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <FiShoppingBag size={36} className="mx-auto mb-3 text-gray-400" />
          <p className="text-gray-600 dark:text-gray-300">Your cart is empty.</p>
          <button
            type="button"
            onClick={() => navigate("/products")}
            className="mt-5 rounded-lg bg-red-700 px-5 py-2 text-sm font-semibold text-white transition hover:bg-red-800"
          >
            Browse Products
          </button>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-4">
            {cart.items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-4 rounded-lg bg-white p-4 shadow-md dark:bg-gray-800 md:flex-row md:items-center"
              >
                <img
                  src={getFullImageUrl(item.product_detail?.image)}
                  alt={item.product_detail?.name || "Product"}
                  className="h-28 w-full rounded-md object-cover md:w-32"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {item.product_detail?.name || "Product"}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Unit price: {formatMoney(item.unit_price)}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Line total: {formatMoney(item.line_total)}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-3 md:justify-end">
                  <div className="flex h-10 items-center rounded-lg border border-gray-200 dark:border-gray-700">
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(item, item.quantity - 1)}
                      disabled={item.quantity <= 1 || updatingItemId === item.id}
                      className="flex h-10 w-10 items-center justify-center text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 dark:text-gray-200 dark:hover:bg-gray-700"
                    >
                      <FiMinus size={16} />
                    </button>
                    <span className="flex h-10 w-12 items-center justify-center text-sm font-semibold">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(item, item.quantity + 1)}
                      disabled={updatingItemId === item.id}
                      className="flex h-10 w-10 items-center justify-center text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 dark:text-gray-200 dark:hover:bg-gray-700"
                    >
                      <FiPlus size={16} />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemove(item.id)}
                    disabled={updatingItemId === item.id}
                    className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-red-950 dark:text-red-300"
                  >
                    <FiTrash2 size={17} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <aside className="h-fit rounded-lg bg-white p-5 shadow-md dark:bg-gray-800">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Summary</h3>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between text-gray-600 dark:text-gray-300">
                <span>Items</span>
                <span>{cart.total_items}</span>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-3 text-base font-bold text-gray-900 dark:border-gray-700 dark:text-white">
                <span>Subtotal</span>
                <span>{formatMoney(cart.subtotal)}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigate("/checkout")}
              className="mt-6 w-full rounded-lg bg-red-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-800"
            >
              Checkout
            </button>
          </aside>
        </div>
      )}
    </div>
  );
};

export default Cart;
