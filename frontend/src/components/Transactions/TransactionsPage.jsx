import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import DashboardLayout from '../Shared/DashboardLayout';
import transactionService from '../../services/transactions/transactionService';
import './TransactionsPage.css';

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await transactionService.getAllTransactions();
      if (response?.status === 'success') {
        setTransactions(response.data || []);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast.error('Failed to fetch transactions');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await transactionService.updateTransaction(editingId, formData);
        toast.success('Transaction updated successfully');
      } else {
        await transactionService.createTransaction(formData);
        toast.success('Transaction added successfully');
      }
      
      setFormData({
        type: 'expense',
        amount: '',
        category: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
      });
      setEditingId(null);
      fetchTransactions();
    } catch (error) {
      toast.error(error.message || 'Failed to save transaction');
    }
  };

  const handleEdit = (transaction) => {
    setEditingId(transaction._id);
    setFormData({
      type: transaction.type,
      amount: transaction.amount,
      category: transaction.category,
      description: transaction.description,
      date: new Date(transaction.date).toISOString().split('T')[0]
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await transactionService.deleteTransaction(id);
        toast.success('Transaction deleted successfully');
        fetchTransactions();
      } catch (error) {
        toast.error('Failed to delete transaction');
      }
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const categories = transactionService.getCategories();

  return (
    <DashboardLayout>
      <div className="transactions-page">
        <div className="transactions-form-container">
          <h2>{editingId ? 'Edit Transaction' : 'Add New Transaction'}</h2>
          <form onSubmit={handleSubmit} className="transaction-form">
            <div className="form-group">
              <label>Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                required
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>

            <div className="form-group">
              <label>Amount</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                placeholder="Enter amount"
                required
                min="0"
              />
            </div>

            <div className="form-group">
              <label>Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
              >
                <option value="">Select category</option>
                {formData.type === 'income'
                  ? categories.income.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))
                  : categories.expense.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))
                }
              </select>
            </div>

            <div className="form-group">
              <label>Description</label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter description"
                required
              />
            </div>

            <div className="form-group">
              <label>Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
              />
            </div>

            <button type="submit" className="submit-btn">
              {editingId ? 'Update Transaction' : 'Add Transaction'}
            </button>
            
            {editingId && (
              <button
                type="button"
                className="cancel-btn"
                onClick={() => {
                  setEditingId(null);
                  setFormData({
                    type: 'expense',
                    amount: '',
                    category: '',
                    description: '',
                    date: new Date().toISOString().split('T')[0]
                  });
                }}
              >
                Cancel Edit
              </button>
            )}
          </form>
        </div>

        <div className="transactions-list-container">
          <h2>Recent Transactions</h2>
          {loading ? (
            <p>Loading transactions...</p>
          ) : transactions.length > 0 ? (
            <div className="transactions-table">
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
                  {transactions.map((transaction) => (
                    <tr key={transaction._id} className={transaction.type}>
                      <td>{new Date(transaction.date).toLocaleDateString()}</td>
                      <td>{transaction.description}</td>
                      <td>{transaction.category}</td>
                      <td className={`amount ${transaction.type}`}>
                        {formatCurrency(transaction.amount)}
                      </td>
                      <td>
                        <button
                          className="edit-btn"
                          onClick={() => handleEdit(transaction)}
                        >
                          Edit
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(transaction._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No transactions found</p>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TransactionsPage;
