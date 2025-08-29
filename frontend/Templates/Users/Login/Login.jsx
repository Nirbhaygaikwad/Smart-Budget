import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Get existing users from localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Find user with matching email and password
      const user = users.find(u => 
        u.email === formData.email && 
        u.password === formData.password
      );

      if (user) {
        // Store user info in localStorage with consistent ID
        const userData = {
          id: user.id || user.email, // Use email as ID if no ID exists
          email: user.email,
          name: user.name
        };
        localStorage.setItem('user', JSON.stringify(userData));

        // Load user's transactions if they exist
        const userTransactionsKey = `transactions_${userData.id}`;
        const existingTransactions = localStorage.getItem(userTransactionsKey);
        if (!existingTransactions) {
          // Initialize empty transactions array if none exists
          localStorage.setItem(userTransactionsKey, JSON.stringify([]));
        }

        toast.success('Logged in successfully');
        navigate('/dashboard');
      } else {
        toast.error('Invalid email or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed');
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
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
            />
          </div>
          <button type="submit" className="login-btn">Login</button>
        </form>
        <p>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
