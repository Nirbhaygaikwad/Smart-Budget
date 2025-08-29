import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import DashboardLayout from '../Shared/DashboardLayout';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import './FinancialInsights.css';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#FF4D4D', '#82ca9d', '#ffc658'];

const FinancialInsights = () => {
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState({
    monthlyTrends: [],
    categoryBreakdown: [],
    budgetPerformance: [],
    savingsRate: 0,
    topExpenses: [],
    monthlyComparison: []
  });

  useEffect(() => {
    loadInsights();
  }, []);

  const loadInsights = () => {
    try {
      const currentUser = JSON.parse(localStorage.getItem('user'));
      if (!currentUser) {
        setLoading(false);
        return;
      }

      // Load transactions and budget goals
      const transactions = JSON.parse(localStorage.getItem(`transactions_${currentUser.id}`) || '[]');
      const budgetGoals = JSON.parse(localStorage.getItem(`budget_goals_${currentUser.id}`) || '[]');

      // Calculate insights
      const calculatedInsights = {
        monthlyTrends: calculateMonthlyTrends(transactions),
        categoryBreakdown: calculateCategoryBreakdown(transactions),
        budgetPerformance: calculateBudgetPerformance(transactions, budgetGoals),
        savingsRate: calculateSavingsRate(transactions),
        topExpenses: findTopExpenses(transactions),
        monthlyComparison: calculateMonthlyComparison(transactions)
      };

      setInsights(calculatedInsights);
      setLoading(false);
    } catch (error) {
      console.error('Error loading insights:', error);
      toast.error('Error loading financial insights');
      setLoading(false);
    }
  };

  const calculateMonthlyTrends = (transactions) => {
    const monthlyData = {};
    
    transactions.forEach(t => {
      const date = new Date(t.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { income: 0, expense: 0 };
      }
      
      if (t.type === 'income') {
        monthlyData[monthKey].income += parseFloat(t.amount);
      } else {
        monthlyData[monthKey].expense += parseFloat(t.amount);
      }
    });

    return Object.entries(monthlyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, data]) => ({
        month: new Date(month + '-01').toLocaleString('default', { month: 'short', year: 'numeric' }),
        income: data.income,
        expense: data.expense,
        savings: data.income - data.expense
      }));
  };

  const calculateCategoryBreakdown = (transactions) => {
    const categories = {};
    
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        if (!categories[t.category]) {
          categories[t.category] = 0;
        }
        categories[t.category] += parseFloat(t.amount);
      });

    return Object.entries(categories)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: 0 // Will be calculated below
      }))
      .sort((a, b) => b.amount - a.amount);
  };

  const calculateBudgetPerformance = (transactions, budgetGoals) => {
    return budgetGoals.map(goal => {
      const monthStart = new Date(goal.month + '-01');
      const monthEnd = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0);
      
      const spent = transactions
        .filter(t => 
          t.type === 'expense' &&
          t.category === goal.category &&
          new Date(t.date) >= monthStart &&
          new Date(t.date) <= monthEnd
        )
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);

      const percentage = (spent / goal.amount) * 100;
      
      return {
        category: goal.category,
        month: goal.month,
        budget: goal.amount,
        spent,
        percentage,
        status: percentage <= 100 ? 'Within Budget' : 'Over Budget'
      };
    });
  };

  const calculateSavingsRate = (transactions) => {
    const totals = transactions.reduce(
      (acc, t) => {
        const amount = parseFloat(t.amount);
        if (t.type === 'income') {
          acc.income += amount;
        } else {
          acc.expense += amount;
        }
        return acc;
      },
      { income: 0, expense: 0 }
    );

    return totals.income > 0 
      ? ((totals.income - totals.expense) / totals.income) * 100 
      : 0;
  };

  const findTopExpenses = (transactions) => {
    return transactions
      .filter(t => t.type === 'expense')
      .sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount))
      .slice(0, 5)
      .map(t => ({
        category: t.category,
        amount: parseFloat(t.amount),
        date: new Date(t.date).toLocaleDateString(),
        description: t.description
      }));
  };

  const calculateMonthlyComparison = (transactions) => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    const thisMonth = transactions
      .filter(t => {
        const date = new Date(t.date);
        return date.getMonth() === currentMonth && 
               date.getFullYear() === currentYear &&
               t.type === 'expense';
      })
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const lastMonth = transactions
      .filter(t => {
        const date = new Date(t.date);
        return date.getMonth() === (currentMonth - 1) && 
               date.getFullYear() === (currentMonth === 0 ? currentYear - 1 : currentYear) &&
               t.type === 'expense';
      })
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const percentageChange = lastMonth === 0 
      ? 100 
      : ((thisMonth - lastMonth) / lastMonth) * 100;

    return {
      thisMonth,
      lastMonth,
      percentageChange
    };
  };

  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="tooltip-data" style={{ color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <DashboardLayout>
      <div className="insights-page">
        {loading ? (
          <p>Loading insights...</p>
        ) : (
          <>
            <div className="insights-header">
              <h2>Financial Insights</h2>
              <div className="summary-cards">
                <div className="summary-card">
                  <h3>Savings Rate</h3>
                  <p className="rate">{insights.savingsRate.toFixed(1)}%</p>
                  <p className="description">of income saved</p>
                </div>
                <div className="summary-card">
                  <h3>Monthly Comparison</h3>
                  <p className="rate">
                    {insights.monthlyComparison.percentageChange > 0 ? '+' : ''}
                    {insights.monthlyComparison.percentageChange.toFixed(1)}%
                  </p>
                  <p className="description">vs last month</p>
                </div>
              </div>
            </div>

            <div className="insights-grid">
              {/* Monthly Trends */}
              <div className="insight-card">
                <h3>Monthly Income vs Expenses</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={insights.monthlyTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line type="monotone" dataKey="income" stroke="#00C49F" strokeWidth={2} name="Income" />
                    <Line type="monotone" dataKey="expense" stroke="#FF4D4D" strokeWidth={2} name="Expense" />
                    <Line type="monotone" dataKey="savings" stroke="#0088FE" strokeWidth={2} name="Savings" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Category Breakdown */}
              <div className="insight-card">
                <h3>Expense Categories</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={insights.categoryBreakdown}
                      dataKey="amount"
                      nameKey="category"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={({ name, value, percent }) => 
                        `${name} (${(percent * 100).toFixed(1)}%)`
                      }
                      labelLine={{ stroke: '#666', strokeWidth: 1 }}
                    >
                      {insights.categoryBreakdown.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Legend formatter={(value) => `${value} (${(insights.categoryBreakdown.find(item => item.category === value)?.percentage || 0).toFixed(1)}%)`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Budget Performance */}
              <div className="insight-card">
                <h3>Budget Performance</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={insights.budgetPerformance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="budget" fill="#8884d8" name="Budget" />
                    <Bar dataKey="spent" fill="#82ca9d" name="Spent" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Top Expenses */}
              <div className="insight-card">
                <h3>Top Expenses</h3>
                <div className="top-expenses">
                  {insights.topExpenses.map((expense, index) => (
                    <div key={index} className="expense-item">
                      <div className="expense-info">
                        <span className="category">{expense.category}</span>
                        <span className="date">{expense.date}</span>
                      </div>
                      <div className="amount">{formatCurrency(expense.amount)}</div>
                      <div className="description">{expense.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default FinancialInsights;
