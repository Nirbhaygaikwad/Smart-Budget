import React from "react";

const AuthRoute = ({ children }) => {
  const isAuthenticated = true; // Dummy authentication check
  return isAuthenticated ? children : <p>Please log in</p>;
};

export default AuthRoute;