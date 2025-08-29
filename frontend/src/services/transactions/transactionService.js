// src/services/transactions/transactionService.js
import axios from 'axios';

// Create axios instance
const API = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
  withCredentials: true, // if using cookies/auth
});

// Add token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Transaction service functions
const transactionService = {
  // Create new transaction
  createTransaction: async (transactionData) => {
    try {
      const response = await API.post('/transactions/create', transactionData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all transactions with summary
  getAllTransactions: async () => {
    try {
      const response = await API.get('/transactions/lists');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update transaction
  updateTransaction: async (id, transactionData) => {
    try {
      const response = await API.put(`/transactions/update/${id}`, transactionData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete transaction
  deleteTransaction: async (id) => {
    try {
      const response = await API.delete(`/transactions/delete/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get transaction categories
  getCategories: () => {
    return {
      income: [
        'Salary',
        'Freelance',
        'Investments',
        'Rental',
        'Other Income'
      ],
      expense: [
        'Food',
        'Transportation',
        'Housing',
        'Utilities',
        'Healthcare',
        'Entertainment',
        'Shopping',
        'Education',
        'Other Expenses'
      ]
    };
  },

  // Get finance summary
  getFinanceSummary: async () => {
    const res = await API.get('/finance/summary'); // your backend route
    return res.data;
  },
};

export default transactionService;
