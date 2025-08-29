import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";
import HomePage from "./components/Home/HomePage";
import Login from "./components/Users/Login/Login";
import Register from "./components/Users/Register/Register";
import Dashboard from "../Templates/Users/Dashboard/Dashboard";
import Transactions from "./components/Transactions/Transactions";
import BudgetGoals from "./components/Budget/BudgetGoals";
import Documents from "./components/Documents/Documents";
import FinancialInsights from "./components/Insights/FinancialInsights";
import ProtectedRoute from "./components/ProtectedRoute";

const ClearFormData = () => {
  const location = useLocation();

  useEffect(() => {
    // Clear all form data when route changes
    localStorage.removeItem('formData');
    const forms = document.querySelectorAll('form');
    forms.forEach(form => form.reset());
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
      input.value = '';
    });
  }, [location]);

  return null;
};

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <ClearFormData />
        <ToastContainer position="top-right" autoClose={3000} />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard/transactions" 
            element={
              <ProtectedRoute>
                <Transactions />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard/budget-goals" 
            element={
              <ProtectedRoute>
                <BudgetGoals />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard/documents" 
            element={
              <ProtectedRoute>
                <Documents />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard/financial-insights" 
            element={
              <ProtectedRoute>
                <FinancialInsights />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
