import { useEffect, useState } from "react";
import {
  getBankDetails,
  updateBankDetails
} from "../../firebase/services/bankService";
import { FaUniversity, FaEdit } from "react-icons/fa";

export default function AdminBankDetails() {

  const [form, setForm] = useState({
    bankName: "",
    branch: "",
    accountNumber: "",
    accountHolder: ""
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await getBankDetails();
      if (data) setForm(data);
      setLoading(false);
    };

    loadData();
  }, []);

  /* ================= SAVE ================= */
  const handleSave = async () => {
    setSaving(true);
    try {
      await updateBankDetails(form);
      alert("✅ Bank details updated successfully!");
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      alert("❌ Failed to update");
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500">
        Loading bank details...
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto">

      {/* HEADER */}
      <div className="flex items-center gap-3 mb-6">
        <FaUniversity className="text-blue-600 text-2xl" />
        <h1 className="text-2xl sm:text-3xl font-bold">
          Bank Details
        </h1>
      </div>

      {/* CARD */}
      <div className="bg-white rounded-2xl shadow-sm border p-5 sm:p-6 space-y-5">

        {/* ================= VIEW MODE ================= */}
        {!isEditing && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-xs text-gray-500">Bank Name</p>
                <p className="font-semibold text-gray-800">
                  {form.bankName || "—"}
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-xs text-gray-500">Branch</p>
                <p className="font-semibold text-gray-800">
                  {form.branch || "—"}
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-xs text-gray-500">Account Number</p>
                <p className="font-semibold text-gray-800">
                  {form.accountNumber || "—"}
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-xs text-gray-500">Account Holder</p>
                <p className="font-semibold text-gray-800">
                  {form.accountHolder || "—"}
                </p>
              </div>

            </div>

            <button
              onClick={() => setIsEditing(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              <FaEdit />
              Edit Details
            </button>
          </>
        )}

        {/* ================= EDIT MODE ================= */}
{isEditing && (
  <>
    <div className="space-y-6">

      {/* SECTION TITLE */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800">
          Edit Bank Details
        </h3>
        <p className="text-sm text-gray-500">
          Update your bank information shown to customers
        </p>
      </div>

      {/* FORM */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

        {/* BANK NAME */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-600">
            Bank Name
          </label>
          <input
            className="px-4 py-3 rounded-xl border bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={form.bankName}
            onChange={(e)=>setForm({...form, bankName:e.target.value})}
          />
        </div>

        {/* BRANCH */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-600">
            Branch
          </label>
          <input
            className="px-4 py-3 rounded-xl border bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={form.branch}
            onChange={(e)=>setForm({...form, branch:e.target.value})}
          />
        </div>

        {/* ACCOUNT NUMBER */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-600">
            Account Number
          </label>
          <input
            className="px-4 py-3 rounded-xl border bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={form.accountNumber}
            onChange={(e)=>setForm({...form, accountNumber:e.target.value})}
          />
        </div>

        {/* ACCOUNT HOLDER */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-600">
            Account Holder
          </label>
          <input
            className="px-4 py-3 rounded-xl border bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={form.accountHolder}
            onChange={(e)=>setForm({...form, accountHolder:e.target.value})}
          />
        </div>

      </div>

      {/* ACTION BUTTONS */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        
        <button
          onClick={() => setIsEditing(false)}
          className="flex-1 py-3 rounded-xl border border-gray-300 font-medium hover:bg-gray-100 transition"
        >
          Cancel
        </button>

        <button
          onClick={handleSave}
          disabled={saving}
          className={`flex-1 py-3 rounded-xl font-medium text-white shadow-sm transition ${
            saving
              ? "bg-gray-400"
              : "bg-gradient-to-r from-green-600 to-emerald-600 hover:opacity-90"
          }`}
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>

        

      </div>

    </div>
  </>
)}

      </div>

    </div>
  );
}