import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import { fetchOrders, updateOrderStatus } from "../../api";
import { formatMoney, formatOrderDate } from "../../utils/orders";

const statusOptions = ["Pending", "Paid", "Fulfilled", "Cancelled"];

const Orders = () => {
  const { user } = useSelector((state) => state.auth);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      const data = await fetchOrders();
      setOrders(data);
      setLoading(false);
    };

    loadOrders();
  }, []);

  const handleStatusChange = async (orderId, status) => {
    try {
      const updated = await updateOrderStatus(orderId, status);
      setOrders((current) => current.map((order) => (order.id === orderId ? updated : order)));
      toast.success("Order status updated.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not update order status.");
    }
  };

  if (loading) {
    return (
      <div className="px-4 pb-10 pt-4 sm:px-6 lg:px-8">
        <p className="text-gray-500 dark:text-gray-400">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="px-4 pb-10 pt-4 sm:px-6 lg:px-8">
      <h2 className="mb-8 text-3xl font-bold text-gray-900 dark:text-white">Orders</h2>

      {orders.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 bg-white p-10 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <p className="text-gray-600 dark:text-gray-300">No orders yet.</p>
          {!user?.is_admin && !user?.is_brand && (
            <Link
              to="/products"
              className="mt-5 inline-flex rounded-lg bg-red-700 px-5 py-2 text-sm font-semibold text-white transition hover:bg-red-800"
            >
              Browse Products
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="rounded-lg bg-white p-5 shadow-md dark:bg-gray-800">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <Link to={`/order-confirmation/${order.id}`} className="text-lg font-bold text-gray-900 hover:text-red-700 dark:text-white">
                    Order #{order.id}
                  </Link>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {formatOrderDate(order.created_at)} · {order.items.length} item{order.items.length === 1 ? "" : "s"}
                  </p>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                    {order.customer_name} · {order.customer_email}
                  </p>
                </div>

                <div className="text-left md:text-right">
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{formatMoney(order.total)}</p>
                  {user?.is_admin || user?.is_brand ? (
                    <select
                      value={order.status}
                      onChange={(event) => handleStatusChange(order.id, event.target.value)}
                      className="mt-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span className="mt-2 inline-flex rounded-full bg-red-50 px-3 py-1 text-sm font-semibold text-red-700 dark:bg-red-900/30 dark:text-red-200">
                      {order.status}
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-4 border-t border-gray-200 pt-4 dark:border-gray-700">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between gap-3 py-1 text-sm">
                    <span className="text-gray-600 dark:text-gray-300">
                      {item.product_name} x {item.quantity}
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">{formatMoney(item.line_total)}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
