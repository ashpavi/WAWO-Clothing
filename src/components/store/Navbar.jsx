import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  FaShoppingCart,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { useState, useEffect } from "react";
import logo from "../../assets/logo.png";
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../hooks/useCart";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { totalItems } = useCart();
  const { currentUser, logoutUser } = useAuth();

  const desktopNavClass = ({ isActive }) =>
    `transition-colors duration-200 ${
      isActive ? "text-blue-600 font-semibold" : "text-gray-600 hover:text-blue-600"
    }`;

  const mobileNavClass = ({ isActive }) =>
    `rounded-lg px-2 py-1 transition-colors duration-200 ${
      isActive
        ? "text-blue-700 bg-blue-50 font-semibold"
        : "text-gray-700 hover:text-blue-700 hover:bg-blue-50"
    }`;

  const [isOpen, setIsOpen] = useState(false);

  const getSearchQuery = () => {
    const params = new URLSearchParams(location.search);
    return params.get("search") || "";
  };

  const [searchQuery, setSearchQuery] = useState(getSearchQuery());

  useEffect(() => {
    setSearchQuery(getSearchQuery());
  }, [location.search]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsOpen(false);
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    navigate("/");
  };

  const handleUserClick = () => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    if (currentUser.role === "superadmin") {
      navigate("/superadmin");
    } else if (currentUser.role === "admin") {
      navigate("/admin/adminDashboard");
    } else {
      navigate("/account");
    }
  };

  const firstName = currentUser?.name?.split(" ")[0] || "";

  return (
    <>
      {/* ================= NAVBAR ================= */}
      <nav className="bg-white shadow-sm relative z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

          {/* LEFT */}
          <div className="flex items-center space-x-6">
            <button
              className="md:hidden"
              onClick={() => setIsOpen(true)}
            >
              <FaBars size={20} />
            </button>

            <Link to="/" className="flex items-center space-x-2">
              <img
                src={logo}
                alt="Logo"
                className="w-14 h-14 object-contain rounded-full border-b-1 p-1 shadow-sm"
              />
              
            </Link>

            <div className="hidden md:flex space-x-6 ml-6 font-medium">
              <NavLink to="/" end className={desktopNavClass}>Home</NavLink>
              <NavLink to="/products" className={desktopNavClass}>Shop</NavLink>
              <NavLink to="/aboutUs" className={desktopNavClass}>About Us</NavLink>
              <NavLink to="/contactUs" className={desktopNavClass}>Contact Us</NavLink>
            </div>
          </div>

          {/* SEARCH (Desktop) */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 mx-8"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full bg-gray-100 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </form>

          {/* RIGHT */}
          <div className="flex items-center space-x-6 text-gray-700">

            {/* CART */}
            <Link to="/cart" className="relative">
              <FaShoppingCart className="text-blue-900 hover:text-blue-700" size={18} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded-full">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* ================= NOT LOGGED IN ================= */}
            {!currentUser && (
              <div className="hidden md:flex items-center space-x-4">
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-full text-sm font-medium transition ${
                      isActive
                        ? "bg-blue-500 text-white"
                        : "bg-blue-300 text-black hover:bg-blue-400"
                    }`
                  }
                >
                  Login
                </NavLink>

                <NavLink
                  to="/register"
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-full text-sm font-medium transition ${
                      isActive
                        ? "bg-blue-800 text-white"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`
                  }
                >
                  Register
                </NavLink>
              </div>
            )}

            {/* ================= LOGGED IN ================= */}
            {currentUser && (
              <div className="flex items-center space-x-4">

                <button
                  onClick={handleUserClick}
                  className="flex items-center bg-gray-100 space-x-2 hover:bg-gray-200 px-3 py-2 rounded-full transition cursor-pointer"
                >
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                    {firstName.charAt(0).toUpperCase()}
                  </div>

                  <span className="hidden md:block text-sm font-medium">
                    {firstName}
                  </span>
                </button>

                <button
                  onClick={handleLogout}
                  className="hidden md:block bg-red-500 px-4 py-2 rounded-full text-sm text-white hover:bg-red-600 transition cursor-pointer"
                >
                  Logout
                </button>

              </div>
            )}

          </div>
        </div>
      </nav>

      {/* ================= OVERLAY ================= */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* ================= SIDE DRAWER ================= */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-white shadow-2xl z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 space-y-6">

          <div className="flex justify-between items-center">
            <h2 className="font-semibold">Menu</h2>
            <button onClick={() => setIsOpen(false)}>
              <FaTimes />
            </button>
          </div>

          <form onSubmit={handleSearch}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full bg-gray-100 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </form>

          <div className="flex flex-col space-y-4 font-medium">
            <NavLink to="/" end className={mobileNavClass} onClick={() => setIsOpen(false)}>Home</NavLink>
            <NavLink to="/products" className={mobileNavClass} onClick={() => setIsOpen(false)}>Shop</NavLink>
            <NavLink to="/aboutUs" className={mobileNavClass} onClick={() => setIsOpen(false)}>About Us</NavLink>
            <NavLink to="/contactUs" className={mobileNavClass} onClick={() => setIsOpen(false)}>Contact Us</NavLink>

            {!currentUser && (
              <div className="flex flex-col gap-3 mt-4">

                <NavLink
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `text-center px-4 py-2 rounded-full text-sm font-medium transition ${
                      isActive
                        ? "bg-blue-500 text-white"
                        : "bg-blue-300 text-black hover:bg-blue-400"
                    }`
                  }
                >
                  Login
                </NavLink>

                <NavLink
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `text-center px-4 py-2 rounded-full text-sm font-medium transition ${
                      isActive
                        ? "bg-blue-800 text-white"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`
                  }
                >
                  Register
                </NavLink>

              </div>
            )}

            {currentUser && (
              <>
                

                <button
                  onClick={handleLogout}
                  className="px-4 py-2 mt-5 rounded-full text-sm font-medium transition bg-red-500 text-white hover:bg-red-600"
                >
                  Logout
                </button>
              </>
            )}
          </div>

        </div>
      </div>
    </>
  );
}
