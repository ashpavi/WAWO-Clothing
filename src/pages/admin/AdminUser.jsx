import { useEffect, useState } from "react";
import { FaEye, FaUserSlash, FaUserCheck } from "react-icons/fa";

import { db } from "../../firebase/firebaseConfig";
import {
  collection,
  getDocs,
  doc,
  updateDoc
} from "firebase/firestore";

export default function AdminUser() {

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      const snapshot = await getDocs(collection(db, "users"));

      const userList = snapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        .filter(user => user.role == "customer");

      setUsers(userList);
    };

    fetchUsers();
  }, []);

  const toggleStatus = async (userId, currentStatus) => {
    const newStatus = !currentStatus;

    await updateDoc(doc(db, "users", userId), {
      isBlocked: newStatus
    });

    setUsers(users.map(user =>
      user.id === userId
        ? { ...user, isBlocked: newStatus }
        : user
    ));
  };

  const filteredUsers = users.filter(
    user =>
      user.name?.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase())
  );

  const statusColor = (status) =>
    status
      ? "bg-red-100 text-red-600"
      : "bg-green-100 text-green-600";

  return (
    <div className="p-4 sm:p-6">

      <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">
        User Management
      </h1>

      {/* SEARCH */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-80 px-4 py-2 bg-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden md:block bg-white rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full text-left">

          <thead className="bg-gray-50 text-gray-600 text-sm uppercase">
            <tr>
              <th className="p-4">User</th>
              <th className="p-4">Role</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id} className="border-t hover:bg-gray-50">

                <td className="p-4">
                  <div className="font-medium">{user.name}</div>
                  <div className="text-sm text-gray-500">{user.email}</div>
                </td>

                <td className="p-4 capitalize">{user.role}</td>

                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-sm ${statusColor(user.isBlocked)}`}>
                    {user.isBlocked ? "Blocked" : "Active"}
                  </span>
                </td>

                <td className="p-4 text-center">
                  <div className="flex justify-center gap-4">
                    <button onClick={() => setSelectedUser(user)} className="text-blue-600">
                      <FaEye />
                    </button>

                    <button
                      onClick={() => toggleStatus(user.id, user.isBlocked)}
                      className={user.isBlocked ? "text-green-600" : "text-red-500"}
                    >
                      {user.isBlocked ? <FaUserCheck /> : <FaUserSlash />}
                    </button>
                  </div>
                </td>

              </tr>
            ))}
          </tbody>

        </table>
      </div>

      {/* ================= MOBILE CARDS ================= */}
      <div className="md:hidden space-y-4">

        {filteredUsers.map(user => (

          <div key={user.id} className="bg-white border rounded-xl p-4 shadow-sm">

            {/* USER INFO */}
            <div>
              <p className="font-semibold text-gray-900">
                {user.name}
              </p>
              <p className="text-sm text-gray-500 break-words">
                {user.email}
              </p>
            </div>

            {/* ROLE + STATUS */}
            <div className="flex justify-between items-center mt-3">

              <span className="text-sm capitalize text-gray-600">
                {user.role}
              </span>

              <span className={`text-xs px-2 py-1 rounded-full ${statusColor(user.isBlocked)}`}>
                {user.isBlocked ? "Blocked" : "Active"}
              </span>

            </div>

            {/* ACTIONS */}
            <div className="flex justify-end gap-4 mt-4 border-t pt-3">

              <button
                onClick={() => setSelectedUser(user)}
                className="flex items-center gap-1 text-blue-600 text-sm"
              >
                <FaEye /> View
              </button>

              <button
                onClick={() => toggleStatus(user.id, user.isBlocked)}
                className={`flex items-center gap-1 text-sm ${
                  user.isBlocked
                    ? "text-green-600"
                    : "text-red-500"
                }`}
              >
                {user.isBlocked ? <FaUserCheck /> : <FaUserSlash />}
                {user.isBlocked ? "Unblock" : "Block"}
              </button>

            </div>

          </div>

        ))}

      </div>

      {/* ================= MODAL ================= */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">

          <div className="bg-white w-full max-w-md rounded-xl shadow-xl p-6">

            <h2 className="text-lg sm:text-xl font-bold mb-5">
              User Details
            </h2>

            <div className="space-y-2 text-sm">
              <p><strong>Name:</strong> {selectedUser.name}</p>
              <p><strong>Email:</strong> {selectedUser.email}</p>
              <p><strong>Phone:</strong> {selectedUser.phone || "N/A"}</p>
              <p><strong>Role:</strong> {selectedUser.role}</p>
              <p><strong>Status:</strong> {selectedUser.isBlocked ? "Blocked" : "Active"}</p>
            </div>

            <div className="mt-6 text-right">
              <button
                onClick={() => setSelectedUser(null)}
                className="px-4 py-2 bg-gray-100 rounded-lg"
              >
                Close
              </button>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}