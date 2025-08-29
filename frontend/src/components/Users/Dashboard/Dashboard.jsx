import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import DashboardLayout from '../../Shared/DashboardLayout';
import transactionService from '../../../services/transactions/transactionService';
import './Dashboard.css';

const Dashboard = () => {
  const [data, setData] = useState({
    transactions: [],
    summary: {
      totalIncome: 0,
      totalExpenses: 0,
      balance: 0
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await transactionService.getAllTransactions();
      if (response?.status === 'success') {
        // Calculate summary from transactions
        const transactions = response.data || [];
        const summary = transactions.reduce((acc, trans) => {
          if (trans.type === 'income') {
            acc.totalIncome += trans.amount;
          } else {
            acc.totalExpenses += trans.amount;
          }
          return acc;
        }, { totalIncome: 0, totalExpenses: 0 });
        
        summary.balance = summary.totalIncome - summary.totalExpenses;

        setData({
          transactions,
          summary
        });
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast.error(error.message || 'Failed to fetch transactions');
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <DashboardLayout>
      <div className="dashboard-content">
        {/* Stats Cards */}
        <div className="stats-cards">
          <div className="stat-card income">
            <h3>Total Income</h3>
            <p className="amount">{formatCurrency(data.summary.totalIncome)}</p>
          </div>
          <div className="stat-card expenses">
            <h3>Total Expenses</h3>
            <p className="amount">{formatCurrency(data.summary.totalExpenses)}</p>
          </div>
          <div className="stat-card balance">
            <h3>Net Balance</h3>
            <p className="amount">{formatCurrency(data.summary.balance)}</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="charts-section">
          <div className="chart-container">
            <h3>Monthly Income vs Expenses</h3>
            <div className="chart-placeholder">
              {loading ? (
                <p>Loading chart...</p>
              ) : data.transactions.length > 0 ? (
                <p>Chart will be implemented</p>
              ) : (
                <p>No data available</p>
              )}
            </div>
          </div>
          <div className="chart-container">
            <h3>Expenses by Category</h3>
            <div className="chart-placeholder">
              {loading ? (
                <p>Loading chart...</p>
              ) : data.transactions.length > 0 ? (
                <p>Chart will be implemented</p>
              ) : (
                <p>No data available</p>
              )}
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="recent-transactions">
          <h3>Recent Transactions</h3>
          <div className="transactions-list">
            {loading ? (
              <p>Loading transactions...</p>
            ) : data.transactions.length > 0 ? (
              data.transactions.map((transaction) => (
                <div key={transaction._id} className="transaction-item">
                  <div className="transaction-info">
                    <h4>{transaction.description}</h4>
                    <p>{transaction.category}</p>
                    <p>{new Date(transaction.date).toLocaleDateString()}</p>
                  </div>
                  <div className={`transaction-amount ${transaction.type}`}>
                    {formatCurrency(transaction.amount)}
                  </div>
                </div>
              ))
            ) : (
              <p>No recent transactions</p>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
