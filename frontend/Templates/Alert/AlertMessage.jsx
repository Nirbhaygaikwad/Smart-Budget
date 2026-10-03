import PropTypes from 'prop-types';
const AlertMessage = ({ message }) => {
  return <div className="alert">{message}</div>;
};

AlertMessage.propTypes = {
  message: PropTypes.node.isRequired,
};

export default AlertMessage;