import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const SuperAdminRoutes = ({ children }) => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  if (currentUser.role !== "superadmin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default SuperAdminRoutes;
