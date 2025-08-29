import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../src/components/Shared/DashboardLayout';
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
import './Dashboard.css';

const CATEGORIES = {
  income: ['Salary', 'Freelance', 'Investments', 'Rental', 'Other Income'],
  expense: ['Food', 'Transportation', 'Utilities', 'Entertainment', 'Shopping', 'Healthcare', 'Education', 'Other Expenses']
};

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [categoryExpenses, setCategoryExpenses] = useState({});
  const [loading, setLoading] = useState(true);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  useEffect(() => {
    loadTransactions();
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleStorageChange = (e) => {
    const currentUser = localStorage.getItem('user');
    if (!currentUser) return;

    const userTransactionsKey = `transactions_${JSON.parse(currentUser).id}`;
    if (e.key === userTransactionsKey) {
      loadTransactions();
    }
  };

  const loadTransactions = () => {
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
      console.error('Error loading transactions:', error);
      setLoading(false);
    }
  };

  const calculateSummary = (transactions) => {
    let incomeTotal = 0;
    let expenseTotal = 0;
    const expensesByCategory = {};

    transactions.forEach(transaction => {
      // Normalize category name to handle case sensitivity
      const normalizedCategory = transaction.category.trim().toLowerCase();
      const displayCategory = CATEGORIES[transaction.type].find(
        cat => cat.toLowerCase() === normalizedCategory
      ) || transaction.category;

      if (transaction.type === 'income') {
        incomeTotal += transaction.amount;
      } else {
        expenseTotal += transaction.amount;
        expensesByCategory[displayCategory] = (expensesByCategory[displayCategory] || 0) + transaction.amount;
      }
    });

    setTotalIncome(incomeTotal);
    setTotalExpense(expenseTotal);
    setCategoryExpenses(expensesByCategory);
  };

  const monthlyData = transactions.reduce((acc, transaction) => {
    const month = new Date(transaction.date).toLocaleString('default', { month: 'short' });
    if (!acc[month]) {
      acc[month] = { income: 0, expense: 0 };
    }
    if (transaction.type === 'income') {
      acc[month].income += transaction.amount;
    } else {
      acc[month].expense += transaction.amount;
    }
    return acc;
  }, {});

  const barChartData = Object.entries(monthlyData).map(([month, data]) => ({
    month,
    Income: data.income,
    Expense: data.expense
  }));

  const categoryData = Object.entries(categoryExpenses).map(([name, value], index) => ({
    name,
    value,
    color: COLORS[index % COLORS.length]
  }));

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

        <div className="charts-section">
          <div className="chart-container">
            <h3>Monthly Transactions</h3>
            <BarChart width={600} height={300} data={barChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Income" fill="#0088FE" />
              <Bar dataKey="Expense" fill="#FF8042" />
            </BarChart>
          </div>

          <div className="chart-container">
            <h3>Expense by Category</h3>
            <PieChart width={400} height={300}>
              <Pie
                data={Object.entries(categoryExpenses).map(([name, value], index) => ({
                  name,
                  value,
                  fill: COLORS[index % COLORS.length]
                }))}
                cx={200}
                cy={150}
                labelLine={false}
                outerRadius={100}
                dataKey="value"
              >
                {Object.entries(categoryExpenses).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </div>
        </div>

        <div className="recent-transactions">
          <h3>Recent Transactions</h3>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Category</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.slice(0, 10).map(transaction => (
                <tr key={transaction._id}>
                  <td>{new Date(transaction.date).toLocaleDateString()}</td>
                  <td>{transaction.description}</td>
                  <td>{transaction.category}</td>
                  <td className={transaction.type === 'income' ? 'income-amount' : 'expense-amount'}>
                    ₹{transaction.amount.toLocaleString()}
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

export default Dashboard;