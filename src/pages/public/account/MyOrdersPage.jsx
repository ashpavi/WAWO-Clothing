import { useState } from "react";
import OrderDetailsModal from "../../../components/store/account/OrderDetailModal";
import { formatPrice } from "../../../utils/formatPrice";
import { useOrders } from "../../../hooks/useOrders";
import { useAuth } from "../../../hooks/useAuth";

export default function MyOrdersPage() {

  const { currentUser } = useAuth();

  // 🔥 Only fetch logged-in user's orders
  const { orders, loading } = useOrders(currentUser?.uid);

  const [selectedOrder, setSelectedOrder] = useState(null);

  if (loading) {
    return (
      <p className="text-gray-500">Loading your orders...</p>
    );
  }

  return (

    <div>

      <h2 className="text-2xl font-semibold mb-6">
        My Orders
      </h2>

      {orders.length === 0 && (
        <p className="text-gray-500">
          You haven't placed any orders yet.
        </p>
      )}

      <div className="space-y-4">

        {orders.map((order) => (

          <div
            key={order.id}
            className="border rounded-xl p-5 flex justify-between items-center hover:shadow-sm transition"
          >

            {/* ORDER INFO */}
            <div>
              <p className="text-sm text-gray-500">
                {order.createdAt?.toDate?.().toLocaleDateString() || "—"}
              </p>

              <p className="font-semibold">
                #{order.id}
              </p>

              <p className="text-sm text-gray-600">
                {formatPrice(order.total)}
              </p>
            </div>

            {/* STATUS + ACTION */}
            <div className="flex items-center gap-6">

              <span
                className={`px-4 py-1 rounded-full text-sm font-medium
                ${
                  order.status === "Delivered"
                    ? "bg-green-100 text-green-600"
                    : order.status === "Shipped"
                    ? "bg-blue-100 text-blue-600"
                    : order.status === "Cancelled"
                    ? "bg-red-100 text-red-600"
                    : "bg-yellow-100 text-yellow-600"
                }`}
              >
                {order.status || "Processing"}
              </span>

              <button
                onClick={() => setSelectedOrder(order)}
                className="text-blue-600 hover:underline text-sm"
              >
                View Details
              </button>

            </div>

          </div>

        ))}

      </div>

      {/* ORDER MODAL */}
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}

    </div>
  );
}