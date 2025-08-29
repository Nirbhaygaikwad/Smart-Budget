import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './DashboardLayout.css';

const DashboardLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = (path) => location.pathname === path;

  const handleLogout = (e) => {
    e.preventDefault();
    
    // Clear user session and form data
    localStorage.removeItem('user');
    
    // Clear browser form data
    const formDataKeys = Object.keys(localStorage).filter(key => 
      key.startsWith('formData_') || 
      key.includes('_form_') || 
      key.includes('_input_')
    );
    formDataKeys.forEach(key => localStorage.removeItem(key));
    
    // Clear browser autofill
    document.querySelectorAll('form').forEach(form => {
      form.reset();
      form.setAttribute('autocomplete', 'off');
    });
    
    document.querySelectorAll('input').forEach(input => {
      input.value = '';
      input.setAttribute('autocomplete', 'off');
    });
    
    // Show success message
    toast.success('Logged out successfully');
    
    // Navigate to login page and reload to clear browser state
    window.location.href = '/';
  };

  return (
    <div className="dashboard-layout">
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>Smart Budget</h2>
        </div>
        <ul className="nav-menu">
          <li>
            <Link to="/dashboard" className={isActive('/dashboard') ? 'active' : ''}>
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/dashboard/transactions" className={isActive('/dashboard/transactions') ? 'active' : ''}>
              Transactions
            </Link>
          </li>
          <li>
            <Link to="/dashboard/budget-goals" className={isActive('/dashboard/budget-goals') ? 'active' : ''}>
              Budget Goals
            </Link>
          </li>
          <li>
            <Link to="/dashboard/documents" className={isActive('/dashboard/documents') ? 'active' : ''}>
              Documents
            </Link>
          </li>
          <li>
            <Link to="/dashboard/financial-insights" className={isActive('/dashboard/financial-insights') ? 'active' : ''}>
              Financial Insights
            </Link>
          </li>
        </ul>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
