import { NavLink, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaBoxOpen,
  FaTags,
  FaShoppingCart,
  FaUsers,
  FaSignOutAlt,
  FaTimes,
  FaImage,
  FaUniversity
} from "react-icons/fa";
import { MdOutlineMessage } from "react-icons/md";

import logo from "../../assets/logo.png";
import { useAuth } from "../../hooks/useAuth";

export default function AdminSideBar({ isOpen, setIsOpen }) {

  const navigate = useNavigate();
  const { logoutUser } = useAuth();

  const linkStyle = 
    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200";

  /* ================= LOGOUT ================= */
  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <>
      {/* ================= MOBILE OVERLAY ================= */}
      <div
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden transition ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* ================= SIDEBAR ================= */}
      <div
        className={`fixed lg:static top-0 left-0 h-screen w-64 
                    bg-gray-900 text-white shadow-xl z-50 
                    transform transition-transform duration-300
                    ${
                      isOpen
                        ? "translate-x-0"
                        : "-translate-x-full lg:translate-x-0"
                    }`}
      >
        <div className="flex flex-col h-full px-6 py-6">

          {/* ================= BRAND ================= */}
          <div className="flex items-center justify-between lg:justify-start mb-10">

            <div className="flex items-center gap-3">

              <img
                src={logo}
                alt="LuxeStore Logo"
                className="w-18 h-18 object-contain rounded-full  p-1 shadow-sm"
              />

              <div>
                <h2 className="text-base font-semibold text-white">
                  Admin Panel
                </h2>
              </div>

            </div>

            <button
              className="lg:hidden text-gray-400"
              onClick={() => setIsOpen(false)}
            >
              <FaTimes />
            </button>

          </div>

          {/* ================= NAVIGATION ================= */}
          <nav className="space-y-2 flex-1">

            <NavLink
              to="/admin/adminDashboard"
              end
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `${linkStyle} ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-800"
                }`
              }
            >
              <FaTachometerAlt size={14} />
              Dashboard
            </NavLink>

            <NavLink
              to="/admin/products"
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `${linkStyle} ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-800"
                }`
              }
            >
              <FaBoxOpen size={14} />
              Products
            </NavLink>

            <NavLink
              to="/admin/categories"
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `${linkStyle} ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-800"
                }`
              }
            >
              <FaTags size={14} />
              Categories
            </NavLink>

            <NavLink
              to="/admin/orders"
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `${linkStyle} ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-800"
                }`
              }
            >
              <FaShoppingCart size={14} />
              Orders
            </NavLink>

            <NavLink
              to="/admin/messages"
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `${linkStyle} ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-800"
                }`
              }
            >
              <MdOutlineMessage size={14} />
              Messages
            </NavLink>

            <NavLink
              to="/admin/hero-settings"
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `${linkStyle} ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-800"
                }`
              }
            >
              <FaImage size={14} />
              Hero Banner
            </NavLink>

            <NavLink
              to="/admin/promo-settings"
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `${linkStyle} ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-800"
                }`
              }
            >
              <FaImage size={14} />
              Promo Section
            </NavLink>

            <NavLink
              to="/admin/users"
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `${linkStyle} ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-800"
                }`
              }
            >
              <FaUsers size={14} />
              Users
            </NavLink>

            <NavLink
              to="/admin/bank-details"
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `${linkStyle} ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-800"
                }`
              }
            >
              <FaUniversity size={14} />
              Bank Details
            </NavLink>

          </nav>

          {/* ================= LOGOUT ================= */}
          <button
            onClick={handleLogout}
            className="mt-auto flex items-center gap-3 px-4 py-3 
                       rounded-xl text-sm font-medium text-red-400 
                       hover:bg-red-500/10 transition cursor-pointer"
          >
            <FaSignOutAlt size={14} />
            Logout
          </button>

        </div>
      </div>
    </>
  );
}