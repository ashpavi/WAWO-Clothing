import { NavLink, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaBoxOpen,
  FaClipboardList,
  FaSignOutAlt,
  FaTimes,
} from "react-icons/fa";
import { useAuth } from "../../../hooks/useAuth";


export default function AccountSidebar({ isOpen, setIsOpen }) {
  const navigate = useNavigate();
  const { logoutUser } = useAuth();

  const linkStyle =
    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all";

  const handleLogout = async () => {
    try {
      await logoutUser(); 
      navigate("/login"); 
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <>
      {/* Overlay (Mobile) */}
      <div
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden transition ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar */}
      <div
        className={`fixed lg:relative top-0 lg:top-auto left-0 
                    h-full lg:h-auto 
                    w-72 
                    bg-white shadow-sm 
                    rounded-2xl 
                    transform transition-transform duration-300
                    z-50
                    ${
                      isOpen
                        ? "translate-x-0"
                        : "-translate-x-full lg:translate-x-0"
                    }`}
      >
        <div className="flex flex-col h-full p-6">

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-base font-semibold text-gray-900">
                My Account
              </h2>
              <p className="text-xs text-gray-500">
                Manage your profile
              </p>
            </div>

            <button
              className="lg:hidden"
              onClick={() => setIsOpen(false)}
            >
              <FaTimes />
            </button>
          </div>

          {/* Navigation */}
          <nav className="space-y-2 flex-1">

            <NavLink
              to="/account"
              end
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `${linkStyle} ${
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              <FaUser size={14} />
              Dashboard
            </NavLink>

            <NavLink
              to="/account/orders"
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `${linkStyle} ${
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              <FaBoxOpen size={14} />
              My Orders
            </NavLink>

            <NavLink
              to="/account/profile"
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `${linkStyle} ${
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              <FaClipboardList size={14} />
              Profile Settings
            </NavLink>

          </nav>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="mt-auto flex items-center gap-3 px-4 py-3 
                       rounded-xl text-sm font-medium text-red-500 
                       hover:bg-red-50 transition"
          >
            <FaSignOutAlt size={14} />
            Logout
          </button>

        </div>
      </div>
    </>
  );
}
