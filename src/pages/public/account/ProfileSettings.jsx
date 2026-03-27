import { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import { auth, db } from "../../../firebase/firebaseConfig";
import {
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updateProfile
} from "firebase/auth";

import { doc, updateDoc } from "firebase/firestore";
import { useAuth } from "../../../hooks/useAuth";


export default function ProfileSettings() {

  const { currentUser } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  /* ================= AUTOFILL ================= */
  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || "");
      setEmail(currentUser.email || "");
    }
  }, [currentUser]);



  /* ================= SAVE CHANGES ================= */
  const handleSave = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const user = auth.currentUser;

      /* ================= UPDATE NAME ================= */
      if (name !== currentUser.name) {

        await updateDoc(doc(db, "users", user.uid), {
          name: name
        });

        await updateProfile(user, {
          displayName: name
        });
      }


      /* ================= UPDATE PASSWORD ================= */
      if (oldPassword && newPassword) {

        const credential = EmailAuthProvider.credential(
          user.email,
          oldPassword
        );

        await reauthenticateWithCredential(user, credential);

        await updatePassword(user, newPassword);
      }

      alert("Profile updated successfully ✅");

      setOldPassword("");
      setNewPassword("");

    } catch (error) {
      alert(error.message);
    }

    setLoading(false);
  };



  return (
    <div className="max-w-xl space-y-8">

      {/* HEADER */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">
          Profile Settings
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          Manage your personal information and password.
        </p>
      </div>


      <form onSubmit={handleSave} className="space-y-6">

        {/* FULL NAME */}
        <div>
          <label className="block text-sm mb-2 text-gray-600">
            Full Name
          </label>

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-gray-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>


        {/* EMAIL */}
        <div>
          <label className="block text-sm mb-2 text-gray-600">
            Email
          </label>

          <input
            value={email}
            disabled
            className="w-full bg-gray-100 rounded-lg px-4 py-3 text-gray-500"
          />
        </div>


        {/* OLD PASSWORD */}
        <div>
          <label className="block text-sm mb-2 text-gray-600">
            Old Password
          </label>

          <div className="relative">

            <input
              type={showOldPassword ? "text" : "password"}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="Enter old password"
              className="w-full bg-gray-100 rounded-lg px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="button"
              onClick={() => setShowOldPassword(!showOldPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showOldPassword ? <FaEyeSlash /> : <FaEye />}
            </button>

          </div>
        </div>


        {/* NEW PASSWORD */}
        <div>
          <label className="block text-sm mb-2 text-gray-600">
            New Password
          </label>

          <div className="relative">

            <input
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              className="w-full bg-gray-100 rounded-lg px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showNewPassword ? <FaEyeSlash /> : <FaEye />}
            </button>

          </div>
        </div>


        {/* SAVE BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>

      </form>

    </div>
  );
}
