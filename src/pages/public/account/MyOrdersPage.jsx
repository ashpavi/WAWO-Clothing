import { useState } from "react";
import OrderDetailsModal from "../../../components/store/account/OrderDetailModal";
import { formatPrice } from "../../../utils/formatPrice";
import { useOrders } from "../../../hooks/useOrders";
import { useAuth } from "../../../hooks/useAuth";

export default function MyOrdersPage() {

  const { currentUser } = useAuth();
  const { orders, loading } = useOrders(currentUser?.uid);

  const [selectedOrder, setSelectedOrder] = useState(null);

  if (loading) {
    return (
      <p className="text-gray-500">Loading your orders...</p>
    );
  }

  return (
    <div>

      <h2 className="text-xl sm:text-2xl font-semibold mb-6">
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
            className="border rounded-xl p-4 sm:p-5 hover:shadow-sm transition bg-white"
          >

            {/* TOP SECTION */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">

              {/* ORDER INFO */}
              <div className="space-y-1">

                <p className="text-xs sm:text-sm text-gray-500">
                  {order.createdAt?.toDate?.().toLocaleDateString() || "—"}
                </p>

                <p className="font-semibold text-sm sm:text-base">
                  #{order.id}
                </p>

                <p className="text-sm text-gray-700 font-medium">
                  {formatPrice(order.total)}
                </p>

              </div>

              {/* STATUS */}
              <div>
                <span
                  className={`inline-block px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-medium
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
              </div>

            </div>

            {/* ACTION (separate row for mobile clarity) */}
            <div className="mt-4 flex justify-end">

              <button
                onClick={() => setSelectedOrder(order)}
                className="text-blue-600 text-sm font-medium hover:underline"
              >
                View Details
              </button>

            </div>

          </div>

        ))}

      </div>

      {/* MODAL */}
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}

    </div>
  );
}