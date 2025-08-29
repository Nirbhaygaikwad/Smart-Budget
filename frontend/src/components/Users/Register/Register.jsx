import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../../../services/users/userService";
import { toast } from "react-toastify";
import "./Register.css";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Clear form data when component mounts
    setFormData({
      username: "",
      email: "",
      password: "",
    });
    // Clear any autocomplete data
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
      input.value = '';
      input.autocomplete = 'off';
    });
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await register(formData);
      toast.success("Registration successful! Please login.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
      toast.error(err.message || "Registration failed. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2>Create Account</h2>
        <p className="register-subtext">Start managing your finances today</p>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="form-group">
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
              disabled={loading}
              minLength="3"
              autoComplete="off"
              data-form-type="other"
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
              autoComplete="off"
              data-form-type="other"
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
              minLength="6"
              autoComplete="off"
              data-form-type="other"
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>
        <p className="login-link">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
