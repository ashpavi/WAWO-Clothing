import { useState } from "react";
import { FaBars } from "react-icons/fa";
import { Outlet } from "react-router-dom";
import Navbar from "../../../components/store/Navbar";
import AccountSidebar from "../../../components/store/account/AccountSidebar";

export default function AccountLayout() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navbar */}
      <Navbar />

      {/* Page Content */}
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-8">

        <div className="flex gap-8">

          {/* Sidebar */}
          <AccountSidebar isOpen={isOpen} setIsOpen={setIsOpen} />

          {/* Content */}
          <div className="flex-1">

            {/* Mobile Header */}
            <div className="lg:hidden mb-6 flex items-center gap-4">
              <button
                onClick={() => setIsOpen(true)}
                className="p-2 bg-gray-100 rounded-lg"
              >
                <FaBars />
              </button>
              <h1 className="text-lg font-semibold">My Account</h1>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border p-6 min-h-[75vh]">
              <Outlet />
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
