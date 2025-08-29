import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import DashboardLayout from '../Shared/DashboardLayout';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import './BudgetGoals.css';

const CATEGORIES = {
  expense: ['Food', 'Transportation', 'Utilities', 'Entertainment', 'Shopping', 'Healthcare', 'Education', 'Other Expenses']
};

const BudgetGoals = () => {
  const [budgetGoals, setBudgetGoals] = useState([]);
  const [editingGoal, setEditingGoal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [availableMonths, setAvailableMonths] = useState([]);

  useEffect(() => {
    loadBudgetGoals();
    generateAvailableMonths();
  }, []);

  const generateAvailableMonths = () => {
    const months = [];
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    // Generate next 12 months
    for (let i = 0; i < 12; i++) {
      const month = new Date(currentYear, currentMonth + i, 1);
      const monthStr = month.toISOString().slice(0, 7); // YYYY-MM format
      const monthDisplay = month.toLocaleString('default', { month: 'long', year: 'numeric' });
      months.push({ value: monthStr, label: monthDisplay });
    }

    setAvailableMonths(months);
  };

  const loadBudgetGoals = () => {
    try {
      const currentUser = localStorage.getItem('user');
      if (!currentUser) {
        setLoading(false);
        return;
      }

      const userBudgetKey = `budget_goals_${JSON.parse(currentUser).id}`;
      const storedBudgets = localStorage.getItem(userBudgetKey);
      
      if (storedBudgets) {
        setBudgetGoals(JSON.parse(storedBudgets));
      }
      setLoading(false);
    } catch (error) {
      console.error('Error loading budget goals:', error);
      toast.error('Error loading budget goals');
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    
    const newGoal = {
      _id: editingGoal ? editingGoal._id : Date.now(),
      category: form.category.value,
      amount: parseFloat(form.amount.value),
      month: form.month.value
    };

    // Validate month
    if (!newGoal.month) {
      toast.error('Please select a month');
      return;
    }

    // Check if budget goal already exists for this month and category
    const existingGoal = budgetGoals.find(
      goal => goal.month === newGoal.month && 
      goal.category === newGoal.category &&
      goal._id !== newGoal._id
    );

    if (existingGoal) {
      toast.error('A budget goal already exists for this month and category');
      return;
    }

    let updatedGoals;
    if (editingGoal) {
      updatedGoals = budgetGoals.map(goal => 
        goal._id === editingGoal._id ? newGoal : goal
      );
      toast.success('Budget goal updated successfully');
    } else {
      updatedGoals = [...budgetGoals, newGoal];
      toast.success('Budget goal added successfully');
    }

    setBudgetGoals(updatedGoals);
    
    // Save to localStorage
    const currentUser = JSON.parse(localStorage.getItem('user'));
    const userBudgetKey = `budget_goals_${currentUser.id}`;
    localStorage.setItem(userBudgetKey, JSON.stringify(updatedGoals));

    setEditingGoal(null);
    form.reset();
  };

  const handleEdit = (goal) => {
    setEditingGoal(goal);
    const form = document.getElementById('budgetForm');
    form.category.value = goal.category;
    form.amount.value = goal.amount;
    form.month.value = goal.month;
    form.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDelete = (id) => {
    const updatedGoals = budgetGoals.filter(goal => goal._id !== id);
    setBudgetGoals(updatedGoals);

    // Save to localStorage
    const currentUser = JSON.parse(localStorage.getItem('user'));
    const userBudgetKey = `budget_goals_${currentUser.id}`;
    localStorage.setItem(userBudgetKey, JSON.stringify(updatedGoals));

    toast.success('Budget goal deleted successfully');
  };

  const calculateProgress = (goal) => {
    try {
      const currentUser = JSON.parse(localStorage.getItem('user'));
      const userTransactionsKey = `transactions_${currentUser.id}`;
      const storedTransactions = localStorage.getItem(userTransactionsKey);
      
      if (!storedTransactions) {
        return { spent: 0, remaining: goal.amount, percentage: 0 };
      }

      const transactions = JSON.parse(storedTransactions);
      const monthStart = new Date(goal.month + '-01');
      const monthEnd = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0);

      const totalSpent = transactions
        .filter(t => {
          const transactionDate = new Date(t.date);
          return (
            t.type === 'expense' &&
            t.category.toLowerCase() === goal.category.toLowerCase() &&
            transactionDate >= monthStart &&
            transactionDate <= monthEnd
          );
        })
        .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);

      const percentage = (totalSpent / goal.amount) * 100;
      return {
        spent: totalSpent,
        remaining: Math.max(0, goal.amount - totalSpent),
        percentage: Math.min(100, percentage)
      };
    } catch (error) {
      console.error('Error calculating progress:', error);
      return { spent: 0, remaining: goal.amount, percentage: 0 };
    }
  };

  const getMonthName = (dateString) => {
    try {
      const date = new Date(dateString + '-01');
      return date.toLocaleString('default', { month: 'long', year: 'numeric' });
    } catch {
      return dateString; // Return the original string if parsing fails
    }
  };

  const getChartData = () => {
    return budgetGoals
      .sort((a, b) => new Date(a.month) - new Date(b.month))
      .map(goal => {
        const progress = calculateProgress(goal);
        return {
          name: getMonthName(goal.month),
          category: goal.category,
          budget: goal.amount,
          spent: progress.spent,
          percentage: progress.percentage.toFixed(1),
          tooltipName: `${getMonthName(goal.month)} - ${goal.category}`,
          remaining: progress.remaining
        };
      });
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{data.tooltipName}</p>
          <p className="tooltip-data">Budget: ₹{data.budget.toLocaleString()}</p>
          <p className="tooltip-data">Spent: ₹{data.spent.toLocaleString()}</p>
          <p className="tooltip-data">Remaining: ₹{data.remaining.toLocaleString()}</p>
          <p className="tooltip-data">Progress: {data.percentage}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <DashboardLayout>
      <div className="budget-goals-page">
        <div className="add-budget">
          <h2>{editingGoal ? 'Edit Budget Goal' : 'Add Budget Goal'}</h2>
          <form id="budgetForm" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Category</label>
              <select name="category" required>
                {CATEGORIES.expense.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Budget Amount</label>
              <input
                type="number"
                name="amount"
                placeholder="Budget Amount"
                required
                min="0"
                step="0.01"
              />
            </div>
            <div className="form-group">
              <label>Month</label>
              <select name="month" required>
                <option value="">Select Month</option>
                {availableMonths.map(month => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>
            </div>
            <button type="submit" className="add-budget-btn">
              {editingGoal ? 'Update Budget Goal' : 'Add Budget Goal'}
            </button>
            {editingGoal && (
              <button 
                type="button" 
                onClick={() => {
                  setEditingGoal(null);
                  document.getElementById('budgetForm').reset();
                }}
                className="cancel-btn"
              >
                Cancel
              </button>
            )}
          </form>
        </div>

        <div className="budget-goals-container">
          <div className="budget-goals-header">
            <h2>Budget Goals</h2>
          </div>
          <table>
            <thead>
              <tr>
                <th>Month</th>
                <th>Category</th>
                <th>Budget Amount</th>
                <th>Spent</th>
                <th>Remaining</th>
                <th>Progress</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {budgetGoals
                .sort((a, b) => new Date(a.month) - new Date(b.month))
                .map(goal => {
                  const progress = calculateProgress(goal);
                  return (
                    <tr key={goal._id}>
                      <td>{getMonthName(goal.month)}</td>
                      <td>{goal.category}</td>
                      <td>₹{goal.amount.toLocaleString()}</td>
                      <td>₹{progress.spent.toLocaleString()}</td>
                      <td>₹{progress.remaining.toLocaleString()}</td>
                      <td>
                        <div className="progress-container">
                          <div className="progress-bar">
                            <div 
                              className={`progress-bar-fill ${
                                progress.percentage > 100 
                                  ? 'high'
                                  : progress.percentage > 75
                                  ? 'medium'
                                  : 'low'
                              }`}
                              style={{ width: `${Math.min(100, progress.percentage)}%` }}
                            />
                            <span className="progress-text">{progress.percentage.toFixed(1)}%</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <button 
                          onClick={() => handleEdit(goal)}
                          className="edit-btn"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(goal._id)}
                          className="delete-btn"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>

        <div className="budget-chart">
          <h2>Budget vs Spending</h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={getChartData()}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="tooltipName" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="budget" fill="#8884d8" name="Budget Amount" />
              <Bar dataKey="spent" fill="#82ca9d" name="Amount Spent" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BudgetGoals;
