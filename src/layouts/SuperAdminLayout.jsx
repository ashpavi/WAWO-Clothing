import { useState } from "react";
import { Outlet } from "react-router-dom";

import { FaBars } from "react-icons/fa";
import SuperAdminSidebar from "../components/superAdmin/SuperAdminSidebar";

export default function SuperAdminLayout() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="h-screen flex bg-white overflow-hidden">

      {/* Sidebar */}
      <SuperAdminSidebar isOpen={isOpen} setIsOpen={setIsOpen} />

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
          <h1 className="font-semibold">Super Admin Panel</h1>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 lg:p-10">
          <Outlet />
        </div>

      </div>
    </div>
  );
}
