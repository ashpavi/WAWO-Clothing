import { useEffect, useState } from "react";
import {
  FaUsers,
  FaUserShield,
  FaShoppingCart,
  FaDollarSign
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { db } from "../../firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

export default function Overview() {

  const [stats, setStats] = useState({
    users: 0,
    admins: 0,
    orders: 0,
    revenue: 0
  });

  const [recentAdmins, setRecentAdmins] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  /* ================= LIVE TIME ================= */
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  /* ================= FORMAT DATE ================= */
  const formattedDate = currentTime.toLocaleDateString("en-GB", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  const formattedTime = currentTime.toLocaleTimeString();

  /* ================= FETCH DATA ================= */
  useEffect(() => {

    const fetchData = async () => {

      const usersSnap = await getDocs(collection(db, "users"));
      const ordersSnap = await getDocs(collection(db, "orders"));

      const users = usersSnap.docs.map(doc => doc.data());
      const orders = ordersSnap.docs.map(doc => doc.data());

      const admins = users.filter(u => u.role === "admin");

      const totalRevenue = orders.reduce(
        (acc, o) => acc + (o.total || 0),
        0
      );

      setStats({
        users: users.length,
        admins: admins.length,
        orders: orders.length,
        revenue: totalRevenue
      });

      const sortedAdmins = admins.sort(
        (a, b) =>
          new Date(b.createdAt?.seconds * 1000) -
          new Date(a.createdAt?.seconds * 1000)
      );

      setRecentAdmins(sortedAdmins.slice(0, 5));
    };

    fetchData();

  }, []);

  return (
    <div className="space-y-10">

      {/* ================= HEADER ================= */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl">

        <div>
          <h1 className="text-3xl font-semibold text-gray-900">
            Super Admin Dashboard
          </h1>

          <p className="text-gray-500 text-sm mt-1">
            Monitor your platform activity
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

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">

        <StatCard
          icon={<FaDollarSign className="text-green-600" />}
          title="Revenue"
          value={`LKR ${stats.revenue.toLocaleString()}`}
          color="bg-green-100"
        />

        <StatCard
          icon={<FaUsers className="text-blue-600" />}
          title="Users"
          value={stats.users}
          color="bg-blue-100"
        />

        <StatCard
          icon={<FaUserShield className="text-purple-600" />}
          title="Admins"
          value={stats.admins}
          color="bg-purple-100"
        />

        <StatCard
          icon={<FaShoppingCart className="text-orange-500" />}
          title="Orders"
          value={stats.orders}
          color="bg-orange-100"
        />

      </div>

      {/* ================= CONTENT ROW ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* ================= RECENT ADMINS ================= */}
        <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition">

          <div className="flex justify-between items-center mb-5">
            <h2 className="font-semibold text-gray-800">
              Recently Added Admins
            </h2>

            <Link
              to="/superadmin/manageAdmins"
              className="text-sm text-blue-600 hover:underline"
            >
              View All
            </Link>
          </div>

          {recentAdmins.length === 0 ? (
            <p className="text-gray-500 text-sm">
              No admins found
            </p>
          ) : (
            recentAdmins.map((admin, index) => (

              <div
                key={index}
                className="flex justify-between items-center py-3 border-b last:border-none"
              >

                <div>
                  <p className="font-medium">{admin.name}</p>
                  <p className="text-sm text-gray-500">{admin.email}</p>
                </div>

                <span className="text-xs bg-gray-100 px-3 py-1 rounded-full">
                  {admin.createdAt?.toDate
                    ? admin.createdAt.toDate().toLocaleString()
                    : "—"}
                </span>

              </div>

            ))
          )}

        </div>

        {/* ================= ACTIVITY LOG ================= */}
        <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition">

          <h2 className="font-semibold text-gray-800 mb-5">
            Activity Logs
          </h2>

          <div className="space-y-3 text-sm max-h-72 overflow-y-auto pr-2">

            {recentAdmins.map((admin, index) => (

              <div
                key={index}
                className="flex justify-between items-center bg-gray-50 px-4 py-3 rounded-lg"
              >

                <p className="text-gray-700">
                  👤 <span className="font-medium">{admin.name}</span> added
                </p>

                <span className="text-xs text-gray-500">
                  {admin.createdAt?.toDate
                    ? admin.createdAt.toDate().toLocaleString()
                    : "—"}
                </span>

              </div>

            ))}

          </div>

        </div>

      </div>

    </div>
  );
}

/* ================= STAT CARD ================= */

function StatCard({ icon, title, value, color }) {
  return (
    <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm hover:shadow-md transition">

      {/* ICON */}
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className={`p-2 sm:p-3 rounded-lg ${color}`}>
          <div className="text-base sm:text-lg">
            {icon}
          </div>
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