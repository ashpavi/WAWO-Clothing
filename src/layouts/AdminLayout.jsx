import { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSideBar from "../components/admin/AdminSideBar.jsx";

import { FaBars } from "react-icons/fa";

export default function AdminLayout() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="h-screen flex bg-white overflow-hidden">

      {/* Sidebar */}
      <AdminSideBar isOpen={isOpen} setIsOpen={setIsOpen} />

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Mobile Top Bar */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b">
          <button
            onClick={() => setIsOpen(true)}
            className="p-2 rounded-lg bg-white border"
          >
            <FaBars />
          </button>
          <h1 className="font-semibold">Admin Panel</h1>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 lg:p-10">
          <Outlet />
        </div>

      </div>
    </div>
  );
}
