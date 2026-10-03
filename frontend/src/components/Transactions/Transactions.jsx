import React, { useState, useEffect } from 'react';
import DashboardLayout from '../Shared/DashboardLayout';
import { toast } from 'react-toastify';
import transactionService from '../../services/transactions/transactionService';
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
  Cell,
  ResponsiveContainer
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
      const response = await transactionService.getAllTransactions();
      const transactionsData = response?.data?.transactions || [];

      setTransactions(transactionsData);
      calculateSummary(transactionsData);
    } catch (error) {
      toast.error(error?.message || 'Error fetching transactions');
    } finally {
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
      const transactionData = {
        type: formData.type,
        amount: parseFloat(formData.amount),
        category: formData.category,
        description: formData.description,
        date: formData.date
      };

      if (editingTransaction) {
        await transactionService.updateTransaction(editingTransaction._id, transactionData);
        toast.success('Transaction updated successfully');
      } else {
        await transactionService.createTransaction(transactionData);
        toast.success('Transaction added successfully');
      }

      await fetchTransactions();
      setEditingTransaction(null);
      setFormData({
        type: '',
        amount: '',
        category: '',
        description: '',
        date: ''
      });
    } catch (error) {
      toast.error(error?.message || 'Error saving transaction');
    }
  };

  const handleDelete = async (id) => {
    try {
      await transactionService.deleteTransaction(id);
      const updatedTransactions = transactions.filter(t => t._id !== id);
      setTransactions(updatedTransactions);
      calculateSummary(updatedTransactions);
      toast.success('Transaction deleted successfully');
    } catch (error) {
      toast.error(error?.message || 'Error deleting transaction');
    }
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
            <ResponsiveContainer width="100%" height={300}>
            <BarChart data={prepareChartData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="amount" fill="#8884d8" name="Amount" />
            </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-container">
            <h3>Category Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={Object.entries(categoryExpenses).map(([category, amount]) => ({
                  name: category,
                  value: amount
                }))}
                cx="50%"
                cy="45%"
                labelLine={false}
                outerRadius="70%"
                fill="#8884d8"
                dataKey="value"
              >
                {Object.entries(categoryExpenses).map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
            </ResponsiveContainer>
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
