import { useEffect, useState } from "react";
import { db, firebaseConfig } from "../../firebase/firebaseConfig";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  setDoc,
  addDoc,
  serverTimestamp
} from "firebase/firestore";

import {
  createUserWithEmailAndPassword,
  getAuth
} from "firebase/auth";

import { initializeApp } from "firebase/app";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function ManageAdmins() {

  const [admins, setAdmins] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const [newAdmin, setNewAdmin] = useState({
    name: "",
    email: "",
    password: ""
  });

  const resetForm = () => {
    setNewAdmin({ name: "", email: "", password: "" });
    setShowPassword(false);
  };

  /* ================= SECONDARY AUTH ================= */
  const secondaryApp = initializeApp(firebaseConfig, "Secondary");
  const secondaryAuth = getAuth(secondaryApp);

  /* ================= FETCH ADMINS ================= */
  const fetchAdmins = async () => {
    const snapshot = await getDocs(collection(db, "users"));

    const adminList = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(user => user.role === "admin");

    setAdmins(adminList);
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  /* ================= ADD ADMIN ================= */
  const handleAddAdmin = async () => {

    if (!newAdmin.name || !newAdmin.email || !newAdmin.password) return;

    try {

      const userCredential = await createUserWithEmailAndPassword(
        secondaryAuth,
        newAdmin.email,
        newAdmin.password
      );

      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: newAdmin.name,
        email: newAdmin.email,
        role: "admin",
        isBlocked: false,
        createdAt: new Date()
      });

      // ✅ LOG ACTIVITY
      await addDoc(collection(db, "superAdminLogs"), {
        action: "added",
        name: newAdmin.name,
        email: newAdmin.email,
        createdAt: serverTimestamp(),
      });

      await secondaryAuth.signOut();

      resetForm();
      setShowAddModal(false);
      fetchAdmins();

    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  /* ================= TOGGLE STATUS ================= */
  const toggleStatus = async (admin) => {
    const newStatus = !admin.isBlocked;

    await updateDoc(doc(db, "users", admin.id), {
      isBlocked: newStatus
    });

    // ✅ LOG ACTIVITY
    await addDoc(collection(db, "superAdminLogs"), {
      action: newStatus ? "blocked" : "unblocked",
      name: admin.name,
      email: admin.email,
      createdAt: serverTimestamp(),
    });

    fetchAdmins();
  };

  /* ================= DELETE ================= */
  const confirmDelete = (admin) => {
    setSelectedAdmin(admin);
    setShowDeleteModal(true);
  };

  const deleteAdmin = async () => {
    if (!selectedAdmin) return;

    await deleteDoc(doc(db, "users", selectedAdmin.id));

    //  LOG ACTIVITY
    await addDoc(collection(db, "superAdminLogs"), {
      action: "removed",
      name: selectedAdmin.name,
      email: selectedAdmin.email,
      createdAt: serverTimestamp(),
    });

    setShowDeleteModal(false);
    setSelectedAdmin(null);
    fetchAdmins();
  };
return (
    <div className="bg-gray-50 h-full flex flex-col overflow-hidden">

      <div className="max-w-5xl w-full mx-auto flex flex-col h-full pt-4 pb-2">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-3">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Manage Admins
            </h1>
            <p className="text-sm text-gray-500">
              Add, manage and control admin access
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 text-sm rounded-md"
          >
            + Add Admin
          </button>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-2xl border flex flex-col flex-1 min-h-0 overflow-hidden">

          {admins.length === 0 ? (
            <p className="p-6 text-gray-500 text-sm">
              No admins found
            </p>
          ) : (

            <div className="overflow-y-auto flex-1 min-h-0 px-2 py-2">

              {admins.map((admin) => (

                <div
                  key={admin.id}
                  className="flex justify-between items-center px-4 py-2 border-b last:border-none hover:bg-gray-50 rounded-lg"
                >

                  <div>
                    <p className="font-medium text-gray-900">
                      {admin.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {admin.email}
                    </p>
                  </div>

                  <div className="flex gap-2">

                    <button
                      onClick={() => toggleStatus(admin)}
                      className={`px-3 py-[3px] text-xs rounded-md font-medium ${
                        admin.isBlocked
                          ? "bg-green-100 text-green-600"
                          : "bg-yellow-100 text-yellow-600"
                      }`}
                    >
                      {admin.isBlocked ? "Activate" : "Block"}
                    </button>

                    <button
                      onClick={() => confirmDelete(admin)}
                      className="bg-red-100 text-red-600 px-3 py-[3px] text-xs rounded-md font-medium"
                    >
                      Remove
                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      </div>

      {/* ================= ADD MODAL ================= */}
      {showAddModal && (
        <Modal onClose={() =>{ 
        setShowAddModal(false)
        resetForm()
        }}>

          <h2 className="text-lg font-semibold mb-4">
            Add New Admin
          </h2>

          <div className="space-y-4">

            <input
              type="text"
              placeholder="Name"
              value={newAdmin.name}
              onChange={(e) =>
                setNewAdmin({ ...newAdmin, name: e.target.value })
              }
              className="w-full border px-4 py-2 rounded-lg"
            />

            <input
              type="email"
              placeholder="Email"
              value={newAdmin.email}
              onChange={(e) =>
                setNewAdmin({ ...newAdmin, email: e.target.value })
              }
              className="w-full border px-4 py-2 rounded-lg"
            />

            {/* PASSWORD */}
            <div className="relative">

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={newAdmin.password}
                onChange={(e) =>
                  setNewAdmin({ ...newAdmin, password: e.target.value })
                }
                className="w-full border px-4 py-2 pr-10 rounded-lg"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>

            </div>

            <button
              onClick={handleAddAdmin}
              className="w-full bg-blue-600 text-white py-2 rounded-lg"
            >
              Add Admin
            </button>

          </div>

        </Modal>
      )}

      {/* ================= DELETE MODAL ================= */}
      {showDeleteModal && (
        <Modal onClose={() => setShowDeleteModal(false)}>

          <h2 className="text-lg font-semibold mb-3">
            Confirm Removal
          </h2>

          <p className="text-sm text-gray-600 mb-5">
            Are you sure you want to remove this admin?
          </p>

          <div className="flex justify-end gap-3">

            <button
              onClick={() => setShowDeleteModal(false)}
              className="px-4 py-2 text-sm text-gray-600"
            >
              Cancel
            </button>

            <button
              onClick={deleteAdmin}
              className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm"
            >
              Remove
            </button>

          </div>

        </Modal>
      )}

    </div>
  );
}

/* ================= MODAL ================= */

function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">

      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-lg relative">

        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400"
        >
          ✕
        </button>

        {children}

      </div>

    </div>
  );
}