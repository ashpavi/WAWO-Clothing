import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import logo from "../assets/logo.png";

export default function SuperAdminLayout() {

  const { logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  return (

    <div className="flex min-h-screen bg-gray-100">

      {/* ================= SIDEBAR ================= */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col justify-between">

        {/* TOP */}
        <div>

          {/* LOGO */}
          <div className="p-6   flex items-center gap-3">

            <img
              src={logo}
              alt="LuxeStore" 
              className="w-18 h-18 object-contain rounded-full  p-1 shadow-sm"
            />

            <div>
              <h1 className="text-base font-semibold text-white">
                Super Admin
              </h1>
            </div>

          </div>

          {/* NAV */}
          <nav className="p-4 space-y-2">

            <NavLink
              to="/superadmin"
              end
              className={({ isActive }) =>
                `block px-4 py-2 rounded-lg text-sm transition ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-800"
                }`
              }
            >
              📊 Overview
            </NavLink>

            <NavLink
              to="/superadmin/manageAdmins"
              className={({ isActive }) =>
                `block px-4 py-2 rounded-lg text-sm transition ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-800"
                }`
              }
            >
              👤 Manage Admins
            </NavLink>

          </nav>

        </div>

        {/* BOTTOM */}
        <div className="p-4 border-t border-gray-800">

          <button
            onClick={handleLogout}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg text-sm"
          >
            Logout
          </button>

        </div>

      </aside>


      {/* ================= CONTENT ================= */}
      <main className="flex-1 p-6">

        <Outlet />

      </main>

    </div>
  );
}