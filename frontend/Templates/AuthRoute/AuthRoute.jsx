import PropTypes from 'prop-types';
const AuthRoute = ({ children }) => {
  const isAuthenticated = true; // Dummy authentication check
  return isAuthenticated ? children : <p>Please log in</p>;
};

AuthRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthRoute;