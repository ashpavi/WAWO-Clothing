import {
  FaDollarSign,
  FaUsers,
  FaShoppingCart,
  FaBoxOpen,
  FaTruck,
  FaCheckCircle
} from "react-icons/fa";

import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

import { db } from "../../firebase/firebaseConfig";
import { collection, onSnapshot } from "firebase/firestore";

import { formatPrice } from "../../utils/formatPrice";
import { useAuth } from "../../hooks/useAuth";

export default function AdminDashboard() {

  const { currentUser } = useAuth();

  const [customers, setCustomers] = useState(0);
  const [orders, setOrders] = useState([]);
  const [revenue, setRevenue] = useState(0);
  const [processingOrders, setProcessingOrders] = useState(0);
  const [completedOrders, setCompletedOrders] = useState(0);
  const [productsSold, setProductsSold] = useState(0);

  const [currentTime, setCurrentTime] = useState(new Date());

  /* ================= LIVE CLOCK ================= */
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  /* ================= REAL-TIME USERS ================= */
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
      const customerCount = snapshot.docs.filter(
        (doc) => doc.data().role === "customer"
      ).length;

      setCustomers(customerCount);
    });

    return () => unsubscribe();
  }, []);

  /* ================= REAL-TIME ORDERS ================= */
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "orders"), (snapshot) => {

      const orderList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));

      /* ✅ SORT BY LATEST */
      const sortedOrders = orderList.sort(
        (a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)
      );

      setOrders(sortedOrders);

      /* ===== CALCULATIONS ===== */

      const totalRevenue = sortedOrders.reduce(
        (acc, order) => acc + (order.total || 0),
        0
      );

      setRevenue(totalRevenue);

      const processing = sortedOrders.filter(
        (o) => o.status === "Processing"
      ).length;

      setProcessingOrders(processing);

      const completed = sortedOrders.filter(
        (o) => o.status === "Delivered"
      ).length;

      setCompletedOrders(completed);

      let sold = 0;

      sortedOrders.forEach((order) => {
        order.items?.forEach((item) => {
          sold += item.quantity;
        });
      });

      setProductsSold(sold);

    });

    return () => unsubscribe();
  }, []);

  /* ================= DATE ================= */
  const formattedDate = currentTime.toLocaleDateString("en-GB", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  const formattedTime = currentTime.toLocaleTimeString();

  /* ================= CHART DATA ================= */
  const orderStatusData = [
    { name: "Processing", value: processingOrders },
    { name: "Completed", value: completedOrders },
    {
      name: "Cancelled",
      value: orders.filter(o => o.status === "Cancelled").length
    }
  ];

  return (
    <div className="space-y-10">

      {/* ================= HEADER ================= */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl">

        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
            Admin Dashboard - {currentUser?.name || "Admin"}
          </h1>

          <p className="text-gray-500 text-sm mt-1">
            Here's what's happening with your store today
          </p>
        </div>

        <div className="bg-white border rounded-xl px-4 py-3 shadow-sm text-right">
          <p className="text-sm text-gray-500">{formattedDate}</p>
          <p className="text-lg font-semibold text-gray-900">{formattedTime}</p>
        </div>

      </div>

      {/* ================= STAT CARDS ================= */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">

        <StatCard icon={<FaDollarSign />} title="Total Revenue" value={formatPrice(revenue)} />
        <StatCard icon={<FaShoppingCart />} title="Total Orders" value={orders.length} />
        <StatCard icon={<FaTruck />} title="Processing Orders" value={processingOrders} />
        <StatCard icon={<FaCheckCircle />} title="Completed Orders" value={completedOrders} />
        <StatCard icon={<FaBoxOpen />} title="Products Sold" value={productsSold} />
        <StatCard icon={<FaUsers />} title="Customers" value={customers} />

      </div>

{/* ================= CHART + ORDERS ================= */}
<div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

  {/* ================= CHART ================= */}
  <div className="bg-white rounded-2xl shadow-md p-6">

    <h2 className="font-semibold text-gray-800 mb-4">
      Order Status
    </h2>

    {/* smaller height so it doesn't dominate */}
    <div className="w-full h-64 md:h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={orderStatusData}>
          <CartesianGrid stroke="#f1f5f9" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#2563eb" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>

  </div>

  {/* ================= RECENT ORDERS ================= */}
  <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col">

    <div className="flex items-center justify-between mb-4">
      <h2 className="font-semibold text-gray-800">
        Recent Orders
      </h2>

      <Link
        to="/admin/orders"
        className="text-sm text-blue-600 hover:text-blue-700"
      >
        View All
      </Link>
    </div>

    {/* scrollable if many orders */}
    <div className="space-y-3 overflow-y-auto max-h-72 pr-1">
      {orders.slice(0, 5).map((order) => (
        <OrderRow
          key={order.id}
          id={order.id}
          user={order.customer?.fullName}
          total={formatPrice(order.total)}
          status={order.status}
        />
      ))}
    </div>

  </div>

</div>

    </div>
  );
}

/* ================= STAT CARD ================= */
function StatCard({ icon, title, value }) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition min-w-0">

      <div className="flex items-center gap-3">

        <div className="bg-blue-100 p-2 rounded-lg text-blue-600 shrink-0">
          {icon}
        </div>

        <div className="min-w-0">
          <p className="text-xs text-gray-500">{title}</p>

          <p className="text-base sm:text-lg font-semibold leading-tight whitespace-nowrap">
            {value}
          </p>
        </div>

      </div>

    </div>
  );
}

/* ================= ORDER ROW ================= */
function OrderRow({ id, user, total, status }) {

  const statusColor =
    status === "Delivered"
      ? "bg-green-100 text-green-700"
      : status === "Processing"
      ? "bg-yellow-100 text-yellow-700"
      : status === "Cancelled"
      ? "bg-red-100 text-red-700"
      : "bg-gray-100 text-gray-700";

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-xl hover:bg-gray-50 transition">

      <div className="min-w-0">
        <p className="font-medium text-gray-900 truncate">{id}</p>
        <p className="text-sm text-gray-500 truncate">{user}</p>
      </div>

      <div className="flex items-center gap-6">
        <span className="font-medium text-gray-800">{total}</span>

        <span className={`text-xs px-3 py-1 rounded-full ${statusColor}`}>
          {status}
        </span>
      </div>

    </div>
  );
}