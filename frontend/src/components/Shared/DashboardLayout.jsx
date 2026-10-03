import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './DashboardLayout.css';

const DashboardLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = (path) => location.pathname === path;
  const [menuOpen, setMenuOpen] = useState(false);

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem('user'));
  } catch {
    user = null;
  }
  const displayName = user?.username || user?.email || 'User';
  const initial = displayName.charAt(0).toUpperCase();

  // Close the mobile menu after navigating
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = (e) => {
    e.preventDefault();
    
    // Clear user session and form data
    localStorage.removeItem('token');
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
      <header className="mobile-topbar">
        <button
          type="button"
          className="menu-toggle"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>
        <span className="mobile-brand">Smart Budget</span>
        <div className="mobile-user" title={displayName}>
          <span className="user-avatar">{initial}</span>
          <span className="mobile-user-name">{displayName}</span>
        </div>
      </header>

      {menuOpen && <div className="sidebar-backdrop" onClick={() => setMenuOpen(false)} />}

      <div className={`sidebar ${menuOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>Smart Budget</h2>
        </div>
        <div className="sidebar-user">
          <span className="user-avatar">{initial}</span>
          <div className="sidebar-user-info">
            <span className="sidebar-user-label">Logged in as</span>
            <span className="sidebar-user-name" title={displayName}>{displayName}</span>
            {user?.email && user.email !== displayName && (
              <span className="sidebar-user-email" title={user.email}>{user.email}</span>
            )}
          </div>
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
