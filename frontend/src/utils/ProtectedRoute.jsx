import { Navigate } from "react-router-dom";
import { getCurrentUser } from "../services/users/userService";

const ProtectedRoute = ({ children }) => {
  const user = getCurrentUser();
  
  if (!user) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
