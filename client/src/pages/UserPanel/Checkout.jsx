import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { checkoutCart, fetchCart } from "../../api";
import { formatMoney, getFullImageUrl } from "../../utils/orders";

const Checkout = ({ updateCartCount }) => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [cart, setCart] = useState({ items: [], total_items: 0, subtotal: "0.00" });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    customer_name: user?.name || "",
    customer_email: user?.email || "",
    fulfillment_method: "Pickup",
    address: "",
    notes: "",
  });

  const loadCart = useCallback(async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    setLoading(true);
    const data = await fetchCart();
    setCart(data);
    setLoading(false);
  }, [navigate, user]);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (cart.items.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    try {
      setSubmitting(true);
      const order = await checkoutCart(form);
      updateCartCount?.(0);
      toast.success("Order placed successfully.");
      navigate(`/order-confirmation/${order.id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not place order.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="px-4 pb-10 pt-4 sm:px-6 lg:px-8">
        <p className="text-gray-500 dark:text-gray-400">Loading checkout...</p>
      </div>
    );
  }

  return (
    <div className="px-4 pb-10 pt-4 sm:px-6 lg:px-8">
      <h2 className="mb-8 text-3xl font-bold text-gray-900 dark:text-white">Checkout</h2>

      {cart.items.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 bg-white p-10 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
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
        <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Order Details</h3>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Name</label>
                <input
                  name="customer_name"
                  value={form.customer_name}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none focus:border-red-500 focus:ring-4 focus:ring-red-100 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Email</label>
                <input
                  name="customer_email"
                  type="email"
                  value={form.customer_email}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none focus:border-red-500 focus:ring-4 focus:ring-red-100 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div className="mt-5">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Fulfillment</label>
              <select
                name="fulfillment_method"
                value={form.fulfillment_method}
                onChange={handleChange}
                className="mt-2 w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none focus:border-red-500 focus:ring-4 focus:ring-red-100 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              >
                <option value="Pickup">Pickup</option>
                <option value="Delivery">Delivery</option>
              </select>
            </div>

            <div className="mt-5">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Address</label>
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                rows={3}
                placeholder="Required for delivery, optional for pickup"
                className="mt-2 w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none focus:border-red-500 focus:ring-4 focus:ring-red-100 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              />
            </div>

            <div className="mt-5">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Order Notes</label>
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                rows={3}
                className="mt-2 w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none focus:border-red-500 focus:ring-4 focus:ring-red-100 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              />
            </div>
          </div>

          <aside className="h-fit rounded-lg bg-white p-5 shadow-md dark:bg-gray-800">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Summary</h3>
            <div className="mt-4 space-y-4">
              {cart.items.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <img
                    src={getFullImageUrl(item.product_detail?.image)}
                    alt={item.product_detail?.name || "Product"}
                    className="h-14 w-14 rounded-md object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                      {item.product_detail?.name || "Product"}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Qty {item.quantity} · {formatMoney(item.line_total)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 flex justify-between border-t border-gray-200 pt-4 text-base font-bold text-gray-900 dark:border-gray-700 dark:text-white">
              <span>Total</span>
              <span>{formatMoney(cart.subtotal)}</span>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="mt-6 w-full rounded-lg bg-red-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Placing Order..." : "Place Order"}
            </button>
          </aside>
        </form>
      )}
    </div>
  );
};

export default Checkout;
