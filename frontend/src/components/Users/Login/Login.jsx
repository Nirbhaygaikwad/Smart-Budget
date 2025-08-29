import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { login } from "../../../services/users/userService";
import "./Login.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Clear form data when component mounts
    setFormData({
      email: "",
      password: "",
    });
    // Clear any autocomplete data
    const inputs = document.querySelectorAll("input");
    inputs.forEach((input) => {
      input.value = "";
      input.autocomplete = "off";
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
    setLoading(true);

    try {
      const response = await login(formData);
      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.message || "Failed to login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Welcome Back!</h2>
        <p className="login-subtext">Log in to manage your finances</p>
        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="off"
              data-form-type="other"
              disabled={loading}
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
              autoComplete="off"
              data-form-type="other"
              minLength="6"
              disabled={loading}
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="signup-link">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
