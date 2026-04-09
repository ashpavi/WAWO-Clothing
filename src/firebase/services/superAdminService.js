import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";

import { db } from "../firebaseConfig";

const usersCollection = collection(db, "users");
const ordersCollection = collection(db, "orders");
const logsCollection = collection(db, "superAdminLogs");

/* ================= HELPERS ================= */

const toDate = (value) => {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof value?.toDate === "function") return value.toDate();
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const formatRelativeTime = (dateValue) => {
  const date = toDate(dateValue);
  if (!date) return "just now";

  const diffMs = Date.now() - date.getTime();
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diffMs < minute) return "just now";
  if (diffMs < hour) return `${Math.floor(diffMs / minute)} min ago`;
  if (diffMs < day) return `${Math.floor(diffMs / hour)} hr ago`;
  if (diffMs < day * 2) return "Yesterday";
  return `${Math.floor(diffMs / day)} days ago`;
};

/* ================= MAP LOG ================= */

const mapLog = (docSnap) => {
  const data = docSnap.data();

  return {
    id: docSnap.id,
    action: data.action,
    name: data.name || "System",
    time: formatRelativeTime(data.createdAt),
    type: data.type || "create",
  };
};

/* ================= DASHBOARD ================= */

export const getSuperAdminDashboardData = async () => {
  const [adminsSnapshot, usersSnapshot, ordersSnapshot, logsSnapshot] =
    await Promise.all([
      getDocs(query(usersCollection, where("role", "in", ["admin", "superadmin"]))),
      getDocs(usersCollection),
      getDocs(ordersCollection),
      getDocs(query(logsCollection, orderBy("createdAt", "desc"), limit(8))),
    ]);

  const admins = adminsSnapshot.docs.map((doc) => {
    const data = doc.data();

    return {
      id: doc.id,
      name: data.name,
      email: data.email,
      status: data.isBlocked ? "suspended" : "active",
      createdAt: data.createdAt,
    };
  });

  const users = usersSnapshot.docs.map((item) => item.data());
  const orders = ordersSnapshot.docs.map((item) => item.data());
  const activityLog = logsSnapshot.docs.map(mapLog);

  const totalRevenue = orders.reduce(
    (sum, order) => sum + (order.total || 0),
    0
  );

  return {
    admins,
    activityLog,
    metrics: [
      {
        label: "Revenue",
        value: `LKR ${totalRevenue.toLocaleString()}`,
        icon: "💰",
      },
      {
        label: "Users",
        value: users.length,
        icon: "👥",
      },
      {
        label: "Admins",
        value: admins.length,
        icon: "🛡️",
      },
    ],
  };
};

/* ================= CREATE ADMIN ================= */

export const createAdminUser = async ({ name, email, role, store }) => {
  const payload = {
    name,
    email,
    role: "admin",
    adminRole: role,
    store: store || "",
    isBlocked: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const ref = await addDoc(usersCollection, payload);

  // ✅ LOG
  await addDoc(logsCollection, {
    action: "added",
    name: name,
    email: email,
    type: "create",
    createdAt: serverTimestamp(),
  });

  return ref.id;
};

/* ================= UPDATE ADMIN STATUS ================= */

export const updateAdminStatus = async (adminId, currentStatus) => {
  const nextBlocked = currentStatus === "active";

  // 🔍 get admin data first
  const adminSnap = await getDocs(
    query(usersCollection, where("__name__", "==", adminId))
  );

  const adminData = adminSnap.docs[0]?.data();

  await updateDoc(doc(db, "users", adminId), {
    isBlocked: nextBlocked,
    updatedAt: serverTimestamp(),
  });

  // ✅ LOG
  await addDoc(logsCollection, {
    action: nextBlocked ? "blocked" : "unblocked",
    name: adminData?.name || "Admin",
    email: adminData?.email || "",
    type: nextBlocked ? "warning" : "create",
    createdAt: serverTimestamp(),
  });
};

/* ================= REMOVE ADMIN ================= */

export const removeAdminUser = async (adminId, adminName) => {
  await deleteDoc(doc(db, "users", adminId));

  // ✅ LOG
  await addDoc(logsCollection, {
    action: "removed",
    name: adminName || "Admin",
    type: "warning",
    createdAt: serverTimestamp(),
  });
};