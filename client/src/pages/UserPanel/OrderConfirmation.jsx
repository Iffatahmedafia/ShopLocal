import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { fetchOrder } from "../../api";
import { formatMoney, formatOrderDate } from "../../utils/orders";

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrder = async () => {
      const data = await fetchOrder(orderId);
      setOrder(data);
      setLoading(false);
    };

    loadOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="px-4 pb-10 pt-4 sm:px-6 lg:px-8">
        <p className="text-gray-500 dark:text-gray-400">Loading order...</p>
      </div>
    );
  }

  return (
    <div className="px-4 pb-10 pt-4 sm:px-6 lg:px-8">
      <div className="rounded-lg bg-white p-8 shadow-md dark:bg-gray-800">
        <p className="text-sm font-semibold uppercase tracking-wide text-red-700 dark:text-red-400">
          Order placed
        </p>
        <h2 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">Thank you for your order</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Order #{order.id} · {formatOrderDate(order.created_at)} · {order.status}
        </p>

        <div className="mt-8 divide-y divide-gray-200 dark:divide-gray-700">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between gap-4 py-4">
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">{item.product_name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {item.brand_name || "Local brand"} · Qty {item.quantity}
                </p>
              </div>
              <p className="font-semibold text-gray-900 dark:text-white">{formatMoney(item.line_total)}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-between border-t border-gray-200 pt-5 text-lg font-bold text-gray-900 dark:border-gray-700 dark:text-white">
          <span>Total</span>
          <span>{formatMoney(order.total)}</span>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link to="/orders" className="rounded-lg bg-red-700 px-5 py-2 text-center text-sm font-semibold text-white transition hover:bg-red-800">
            View Orders
          </Link>
          <Link to="/products" className="rounded-lg border border-gray-200 px-5 py-2 text-center text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
