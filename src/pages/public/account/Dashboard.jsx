import {
  FaShoppingBag,
  FaTruck,
  FaCheckCircle
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { useOrders } from "../../../hooks/useOrders";

export default function Dashboard() {

  const { currentUser } = useAuth();

  // 🔥 Correct: only fetch current user's orders
  const { orders, loading } = useOrders(currentUser?.uid);

  const firstName = currentUser?.name?.split(" ")[0] || "User";

  /* ================= LOADING STATE ================= */
  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500">
        Loading your dashboard...
      </div>
    );
  }

  /* ================= ORDER STATS ================= */

  const totalOrders = orders.length;

  const processingOrders = orders.filter(
    (order) => order.status === "Processing"
  ).length;

  const completedOrders = orders.filter(
    (order) => order.status === "Delivered"
  ).length;

  const recentOrders = orders.slice(0, 5);

  return (

    <div className="space-y-10">

      {/* ================= HEADER ================= */}
      <div className="space-y-3">
        <h2 className="text-3xl font-semibold text-gray-900">
          Welcome, <span className="text-blue-600">{firstName}</span> 👋
        </h2>

        <p className="text-gray-500 text-sm">
          Here’s an overview of your account activity.
        </p>
      </div>

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* TOTAL */}
        <div className="group bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Orders</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                {totalOrders}
              </p>
            </div>
            <div className="bg-blue-100 p-4 rounded-full">
              <FaShoppingBag className="text-blue-600" size={18} />
            </div>
          </div>
        </div>

        {/* PROCESSING */}
        <div className="group bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Processing</p>
              <p className="text-3xl font-bold text-yellow-500 mt-2">
                {processingOrders}
              </p>
            </div>
            <div className="bg-yellow-100 p-4 rounded-full">
              <FaTruck className="text-yellow-500" size={18} />
            </div>
          </div>
        </div>

        {/* COMPLETED */}
        <div className="group bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Completed</p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {completedOrders}
              </p>
            </div>
            <div className="bg-green-100 p-4 rounded-full">
              <FaCheckCircle className="text-green-600" size={18} />
            </div>
          </div>
        </div>

      </div>

      {/* ================= RECENT ORDERS ================= */}
      <div className="bg-white rounded-2xl shadow-md p-6">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
          <h3 className="font-semibold text-lg text-gray-800">
            Recent Orders
          </h3>

          <Link
            to="/account/orders"
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            View All
          </Link>
        </div>

        <div className="space-y-4">

          {recentOrders.length === 0 ? (
            <p className="text-gray-500 text-sm">
              No orders yet.
            </p>
          ) : (
            recentOrders.map((order) => (

              <div
                key={order.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-xl hover:bg-gray-50 transition"
              >

                <div>
                  <p className="font-medium text-gray-800">
                    #{order.id}
                  </p>

                  <p className="text-sm text-gray-500">
                    {order.createdAt?.toDate?.().toLocaleDateString() || "—"}
                  </p>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium w-fit
                  ${
                    order.status === "Delivered"
                      ? "bg-green-100 text-green-700"
                      : order.status === "Shipped"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {order.status}
                </span>

              </div>

            ))
          )}

        </div>

      </div>

    </div>
  );
}