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

const compactNumber = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});

const currencyCompact = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 2,
});

const toDate = (value) => {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof value?.toDate === "function") return value.toDate();
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const getRoleLabel = (user) => {
  if (user.adminRole) return user.adminRole;
  if (user.role === "superadmin") return "Super Admin";
  if (user.role === "admin") return "Store Admin";
  return "Admin";
};

const getAvatar = (name = "") => {
  const initials = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return initials || "AD";
};

const mapAdmin = (docSnap) => {
  const data = docSnap.data();
  const joinedDate = toDate(data.createdAt);
  const status = data.isBlocked ? "suspended" : "active";

  return {
    id: docSnap.id,
    name: data.name || "Unknown Admin",
    email: data.email || "",
    role: getRoleLabel(data),
    store: data.store || data.storeName || "-",
    status,
    joined: joinedDate
      ? joinedDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "-",
    avatar: getAvatar(data.name),
  };
};

const mapLogType = (eventType) => {
  if (eventType === "warning") return "warning";
  if (eventType === "settings") return "settings";
  if (eventType === "system") return "system";
  return "create";
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

const mapLog = (docSnap) => {
  const data = docSnap.data();

  return {
    id: docSnap.id,
    action: data.action || "System event",
    user: data.user || "System",
    time: formatRelativeTime(data.createdAt),
    type: mapLogType(data.type),
  };
};

const getOrderAmount = (order) => {
  const candidates = [order.total, order.totalAmount, order.amount, order.grandTotal];
  const firstValid = candidates.find((val) => typeof val === "number" && Number.isFinite(val));
  return firstValid || 0;
};

const isToday = (dateValue) => {
  const date = toDate(dateValue);
  if (!date) return false;

  const now = new Date();
  return (
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
  );
};

export const getSuperAdminDashboardData = async () => {
  const [adminsSnapshot, usersSnapshot, ordersSnapshot, logsSnapshot] = await Promise.all([
    getDocs(query(usersCollection, where("role", "in", ["admin", "superadmin"]))),
    getDocs(usersCollection),
    getDocs(ordersCollection),
    getDocs(query(logsCollection, orderBy("createdAt", "desc"), limit(8))),
  ]);

  const admins = adminsSnapshot.docs.map(mapAdmin);
  const users = usersSnapshot.docs.map((item) => item.data());
  const orders = ordersSnapshot.docs.map((item) => item.data());
  const activityLog = logsSnapshot.docs.map(mapLog);

  const totalRevenue = orders.reduce((sum, order) => sum + getOrderAmount(order), 0);
  const activeUsers = users.filter((user) => !user.isBlocked).length;
  const ordersToday = orders.filter((order) => isToday(order.createdAt || order.date)).length;

  const metrics = [
    {
      label: "Total Revenue",
      value: currencyCompact.format(totalRevenue),
      change: "Live",
      up: true,
      icon: "💰",
    },
    {
      label: "Active Users",
      value: compactNumber.format(activeUsers),
      change: "Live",
      up: true,
      icon: "👥",
    },
    {
      label: "Total Orders",
      value: compactNumber.format(ordersToday),
      change: "Live",
      up: true,
      icon: "📦",
    },
  ];

  return {
    admins,
    activityLog,
    metrics,
  };
};

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

  await addDoc(logsCollection, {
    action: "Admin created",
    user: name || "Super Admin",
    type: "create",
    createdAt: serverTimestamp(),
  });

  return ref.id;
};

export const updateAdminStatus = async (adminId, currentStatus) => {
  const nextBlocked = currentStatus === "active";

  await updateDoc(doc(db, "users", adminId), {
    isBlocked: nextBlocked,
    updatedAt: serverTimestamp(),
  });

  await addDoc(logsCollection, {
    action: nextBlocked ? "Admin suspended" : "Admin activated",
    user: "Super Admin",
    type: nextBlocked ? "warning" : "create",
    createdAt: serverTimestamp(),
  });
};

export const removeAdminUser = async (adminId, adminName) => {
  await deleteDoc(doc(db, "users", adminId));

  await addDoc(logsCollection, {
    action: "Admin removed",
    user: adminName || "Super Admin",
    type: "warning",
    createdAt: serverTimestamp(),
  });
};
