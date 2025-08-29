import React from 'react';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="home-container">
      {/* Navbar */}
      <header className="home-header">
        <nav className="home-nav">
          <a href="/" className="home-logo">SmartBudget</a>
          <div className="home-nav-links">
            <a href="/login" className="home-login">Login</a>
            <a href="/register" className="home-signup">Sign Up</a>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="home-hero">
        <h1>Master Your Money with <span className="home-highlight">SmartBudget</span></h1>
        <p>Track expenses, set goals, and make informed financial decisions with our intelligent budgeting app.</p>
        <a href="/register" className="home-cta-button">Start Your Financial Journey</a>
      </section>

      {/* Features Section */}
      <section className="home-features">
        <h2>Powerful Features</h2>
        <div className="home-feature-grid">
          <div className="home-feature-item">
            <h3>Smart Expense Tracking</h3>
            <p>Effortlessly log and categorize your expenses with AI-powered recognition.</p>
          </div>
          <div className="home-feature-item">
            <h3>Intelligent Budget Planning</h3>
            <p>Create dynamic budgets that adapt to your spending habits.</p>
          </div>
          <div className="home-feature-item">
            <h3>Advanced Financial Insights</h3>
            <p>Gain valuable insights with detailed reports and predictive analytics.</p>
          </div>
          <div className="home-feature-item">
            <h3>Seamless Mobile Access</h3>
            <p>Access your budget anytime, anywhere with our user-friendly mobile app.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <p>&copy; 2025 SmartBudget. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
