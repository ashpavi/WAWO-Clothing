import { useCallback, useEffect, useState } from "react";

import {
  createAdminUser,
  getSuperAdminDashboardData,
  removeAdminUser,
  updateAdminStatus,
} from "../firebase/services/superAdminService";

export const useSuperAdmin = () => {
  const [admins, setAdmins] = useState([]);
  const [metrics, setMetrics] = useState([]);
  const [activityLog, setActivityLog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refreshDashboardData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getSuperAdminDashboardData();
      setAdmins(data.admins);
      setMetrics(data.metrics);
      setActivityLog(data.activityLog);
    } catch (err) {
      setError(err.message || "Failed to load super admin data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshDashboardData();
  }, [refreshDashboardData]);

  const addAdmin = async (newAdmin) => {
    await createAdminUser(newAdmin);
    await refreshDashboardData();
  };

  const toggleAdminStatus = async (adminId, currentStatus) => {
    await updateAdminStatus(adminId, currentStatus);
    await refreshDashboardData();
  };

  const removeAdmin = async (adminId, adminName) => {
    await removeAdminUser(adminId, adminName);
    await refreshDashboardData();
  };

  return {
    admins,
    metrics,
    activityLog,
    loading,
    error,
    addAdmin,
    toggleAdminStatus,
    removeAdmin,
    refreshDashboardData,
  };
};
