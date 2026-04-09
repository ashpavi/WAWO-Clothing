import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const AdminRoutes = ({ children }) => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  if (
    currentUser.role !== "admin" &&
    currentUser.role !== "superadmin"
  ) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoutes;
