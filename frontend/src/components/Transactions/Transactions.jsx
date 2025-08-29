import React, { useState, useEffect } from 'react';
import DashboardLayout from '../Shared/DashboardLayout';
import { toast } from 'react-toastify';
import axios from 'axios';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import './Transactions.css';

const CATEGORIES = {
  income: ['Salary', 'Freelance', 'Investments', 'Rental', 'Other Income'],
  expense: ['Food', 'Transportation', 'Utilities', 'Entertainment', 'Shopping', 'Healthcare', 'Education', 'Other Expenses']
};

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [categoryExpenses, setCategoryExpenses] = useState({});
  const [selectedType, setSelectedType] = useState('expense');
  const [loading, setLoading] = useState(true);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [formData, setFormData] = useState({
    type: '',
    amount: '',
    category: '',
    description: '',
    date: ''
  });

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const currentUser = localStorage.getItem('user');
      if (!currentUser) {
        setLoading(false);
        return;
      }

      const userTransactionsKey = `transactions_${JSON.parse(currentUser).id}`;
      const storedTransactions = localStorage.getItem(userTransactionsKey);
      let transactionsData = [];
      
      if (storedTransactions) {
        transactionsData = JSON.parse(storedTransactions);
      }

      // Sort transactions by date in descending order (most recent first)
      const sortedTransactions = transactionsData.sort((a, b) => 
        new Date(b.date) - new Date(a.date)
      );

      setTransactions(sortedTransactions);
      calculateSummary(sortedTransactions);
      setLoading(false);
    } catch (error) {
      toast.error('Error fetching transactions');
      setLoading(false);
    }
  };

  const calculateSummary = (transactions) => {
    let income = 0;
    let expense = 0;
    const categories = {};

    transactions.forEach(transaction => {
      // Normalize category name to handle case sensitivity
      const normalizedCategory = transaction.category.trim().toLowerCase();
      const displayCategory = CATEGORIES[transaction.type].find(
        cat => cat.toLowerCase() === normalizedCategory
      ) || transaction.category;

      if (transaction.type === 'income') {
        income += transaction.amount;
      } else {
        expense += transaction.amount;
        categories[displayCategory] = (categories[displayCategory] || 0) + transaction.amount;
      }
    });

    setTotalIncome(income);
    setTotalExpense(expense);
    setCategoryExpenses(categories);
  };

  const handleTypeChange = (e) => {
    setSelectedType(e.target.value);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setFormData({
      type: transaction.type,
      amount: transaction.amount,
      category: transaction.category,
      description: transaction.description,
      date: transaction.date.split('T')[0]
    });
    document.querySelector('.add-transaction').scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const currentUser = JSON.parse(localStorage.getItem('user'));
      if (!currentUser) {
        toast.error('Please log in to add transactions');
        return;
      }

      const transactionData = {
        _id: editingTransaction ? editingTransaction._id : Date.now(),
        type: formData.type,
        amount: parseFloat(formData.amount),
        category: formData.category,
        description: formData.description,
        date: formData.date,
        userId: currentUser.id
      };

      const userTransactionsKey = `transactions_${currentUser.id}`;
      let existingTransactions = [];
      const storedTransactions = localStorage.getItem(userTransactionsKey);
      
      if (storedTransactions) {
        existingTransactions = JSON.parse(storedTransactions);
      }

      let updatedTransactions;
      if (editingTransaction) {
        updatedTransactions = existingTransactions.map(t => 
          t._id === editingTransaction._id ? transactionData : t
        );
        toast.success('Transaction updated successfully');
      } else {
        updatedTransactions = [...existingTransactions, transactionData];
        toast.success('Transaction added successfully');
      }

      localStorage.setItem(userTransactionsKey, JSON.stringify(updatedTransactions));
      
      setTransactions(updatedTransactions);
      calculateSummary(updatedTransactions);
      setEditingTransaction(null);
      setFormData({
        type: '',
        amount: '',
        category: '',
        description: '',
        date: ''
      });
    } catch (error) {
      toast.error('Error saving transaction');
    }
  };

  const handleDelete = (id) => {
    const updatedTransactions = transactions.filter(t => t._id !== id);
    setTransactions(updatedTransactions);
    calculateSummary(updatedTransactions);

    // Store transactions with user-specific key
    const currentUser = JSON.parse(localStorage.getItem('user'));
    const userTransactionsKey = `transactions_${currentUser.id}`;
    localStorage.setItem(userTransactionsKey, JSON.stringify(updatedTransactions));

    toast.success('Transaction deleted successfully');
  };

  // Prepare chart data by consolidating same categories
  const prepareChartData = () => {
    const categoryTotals = {};
    transactions.forEach(transaction => {
      const normalizedCategory = transaction.category.trim().toLowerCase();
      const displayCategory = CATEGORIES[transaction.type].find(
        cat => cat.toLowerCase() === normalizedCategory
      ) || transaction.category;
      
      if (!categoryTotals[displayCategory]) {
        categoryTotals[displayCategory] = 0;
      }
      categoryTotals[displayCategory] += transaction.amount;
    });

    return Object.entries(categoryTotals).map(([category, amount]) => ({
      category,
      amount
    }));
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="loading">Loading...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="transactions-page">
        <h1>Transactions</h1>
        <div className="add-transaction">
          <h2>Add New Transaction</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Type</label>
              <select 
                name="type" 
                value={formData.type} 
                onChange={handleChange}
                required
              >
                <option value="">Select Type</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>

            <div className="form-group">
              <label>Amount</label>
              <input
                type="number"
                name="amount"
                placeholder="Amount"
                value={formData.amount}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
              />
            </div>

            <div className="form-group">
              <label>Category</label>
              <select 
                name="category" 
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select Category</option>
                {formData.type && CATEGORIES[formData.type].map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Description</label>
              <input
                type="text"
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="add-transaction-btn">
              {editingTransaction ? 'Update Transaction' : 'Add Transaction'}
            </button>
          </form>
        </div>

        <h2 className="section-title">Summary</h2>
        <div className="summary-section">
          <div className="summary-card income">
            <h3>Total Income</h3>
            <p>₹{totalIncome.toLocaleString()}</p>
          </div>
          <div className="summary-card expense">
            <h3>Total Expenses</h3>
            <p>₹{totalExpense.toLocaleString()}</p>
          </div>
          <div className="summary-card balance">
            <h3>Net Balance</h3>
            <p>₹{(totalIncome - totalExpense).toLocaleString()}</p>
          </div>
        </div>

        <h2 className="section-title">Charts</h2>
        <div className="charts-section">
          <div className="chart-container">
            <h3>Transaction Distribution</h3>
            <BarChart width={600} height={300} data={prepareChartData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="amount" fill="#8884d8" name="Amount" />
            </BarChart>
          </div>
          <div className="chart-container">
            <h3>Category Distribution</h3>
            <PieChart width={400} height={300}>
              <Pie
                data={Object.entries(categoryExpenses).map(([category, amount]) => ({
                  name: category,
                  value: amount
                }))}
                cx={200}
                cy={150}
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {Object.entries(categoryExpenses).map((entry, index) => (
                  <Cell key={index} fill={`#${Math.floor(Math.random()*16777215).toString(16)}`} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </div>
        </div>

        <h2 className="section-title">Recent Transactions</h2>
        <div className="transactions-list">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(transaction => (
                <tr key={transaction._id}>
                  <td>{new Date(transaction.date).toLocaleDateString()}</td>
                  <td>{transaction.description}</td>
                  <td>{transaction.category}</td>
                  <td className={transaction.type === 'income' ? 'income-amount' : 'expense-amount'}>
                    ₹{transaction.amount.toLocaleString()}
                  </td>
                  <td>
                    <button 
                      onClick={() => handleEdit(transaction)}
                      className="edit-btn"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(transaction._id)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Transactions;
