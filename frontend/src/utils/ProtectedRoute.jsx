import { Navigate } from "react-router-dom";
import { getCurrentUser } from "../services/users/userService";
import PropTypes from "prop-types";

const ProtectedRoute = ({ children }) => {
  const user = getCurrentUser();
  
  if (!user) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
