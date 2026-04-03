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
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from "recharts";

import { db } from "../../firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

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

  /* ================= FETCH DATA ================= */
  useEffect(() => {

    const fetchData = async () => {

      const userSnap = await getDocs(collection(db, "users"));

      const customerCount = userSnap.docs.filter(
        (doc) => doc.data().role === "customer"
      ).length;

      setCustomers(customerCount);

      const orderSnap = await getDocs(collection(db, "orders"));

      const orderList = orderSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));

      setOrders(orderList);

      const totalRevenue = orderList.reduce(
        (acc, order) => acc + (order.total || 0),
        0
      );

      setRevenue(totalRevenue);

      const processing = orderList.filter(
        (o) => o.status === "Processing"
      ).length;

      setProcessingOrders(processing);

      const completed = orderList.filter(
        (o) => o.status === "Delivered"
      ).length;

      setCompletedOrders(completed);

      let sold = 0;

      orderList.forEach((order) => {
        order.items?.forEach((item) => {
          sold += item.quantity;
        });
      });

      setProductsSold(sold);

    };

    fetchData();

  }, []);

  /* ================= FORMAT DATE ================= */

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
          <h1 className="text-3xl font-semibold text-gray-900">
           Admin Dashboard -{currentUser?.name || "Admin"} 
          </h1>

          <p className="text-gray-500 text-sm mt-1">
            Here's what's happening with your store today
          </p>
        </div>

        <div className="bg-white border rounded-xl px-4 py-3 shadow-sm text-right">

          <p className="text-sm text-gray-500">
            {formattedDate} 
          </p>

          <p className="text-lg font-semibold text-gray-900">
            {formattedTime}
          </p>

        </div>

      </div>

      {/* ================= STAT CARDS ================= */}

      <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4">
        <StatCard icon={<FaDollarSign />} title="Total Revenue" value={formatPrice(revenue)} />
        <StatCard icon={<FaShoppingCart />} title="Total Orders" value={orders.length} />
        <StatCard icon={<FaTruck />} title="Processing Orders" value={processingOrders} />
        <StatCard icon={<FaCheckCircle />} title="Completed Orders" value={completedOrders} />
        <StatCard icon={<FaBoxOpen />} title="Products Sold" value={productsSold} />
        <StatCard icon={<FaUsers />} title="Customers" value={customers} />

      </div>

      {/* ================= CHARTS ================= */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

        {/* ORDER STATUS */}
        <div className="bg-white rounded-2xl shadow-md p-8">

          <h2 className="font-semibold text-gray-800 mb-6">
            Order Status
          </h2>

          <div className="h-80">
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

        {/* RECENT ORDERS */}
        <div className="bg-white rounded-2xl shadow-md p-8">

          <div className="flex items-center justify-between mb-6">

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

          <div className="space-y-4">

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

/* ================= COMPONENTS ================= */

function StatCard({ icon, title, value }) {
  return (
    <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm hover:shadow-md transition">

      {/* ICON */}
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="bg-blue-50 p-2 sm:p-3 rounded-lg text-blue-600 text-base sm:text-lg">
          {icon}
        </div>
      </div>

      {/* TITLE */}
      <p className="text-xs sm:text-sm text-gray-500">
        {title}
      </p>

      {/* VALUE */}
      <p className="text-lg sm:text-2xl font-semibold text-gray-900 mt-1">
        {value}
      </p>
    </div>
  );
}

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

      <div>
        <p className="font-medium text-gray-900">{id}</p>
        <p className="text-sm text-gray-500">{user}</p>
      </div>

      <div className="flex items-center gap-6">

        <span className="font-medium text-gray-800">
          {total}
        </span>

        <span className={`text-xs px-3 py-1 rounded-full ${statusColor}`}>
          {status}
        </span>

      </div>

    </div>
  );
}