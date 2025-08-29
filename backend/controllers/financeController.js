// controllers/financeController.js
const Transaction = require("../model/Transaction");

// Get finance summary (total income, expenses, and net balance)
const getFinanceSummary = async (req, res) => {
  try {
    const userId = req.user;

    // Get all transactions for the user
    const transactions = await Transaction.find({ user: userId });

    // Calculate totals
    const summary = transactions.reduce(
      (acc, transaction) => {
        if (transaction.type === "income") {
          acc.totalIncome += transaction.amount;
        } else if (transaction.type === "expense") {
          acc.totalExpenses += transaction.amount;
        }
        return acc;
      },
      { totalIncome: 0, totalExpenses: 0 }
    );

    // Calculate net balance
    summary.netBalance = summary.totalIncome - summary.totalExpenses;

    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: "Error getting finance summary", error: error.message });
  }
};

// Get category-wise expense breakdown
const getCategoryExpenses = async (req, res) => {
  try {
    const userId = req.user;
    const categoryExpenses = await Transaction.aggregate([
      { $match: { user: userId, type: "expense" } },
      { $group: { _id: "$category", total: { $sum: "$amount" } } },
      { $sort: { total: -1 } }
    ]);
    res.json(categoryExpenses);
  } catch (error) {
    res.status(500).json({ message: "Error getting category expenses", error: error.message });
  }
};

// Get financial insights and recommendations
const getFinancialInsights = async (req, res) => {
  try {
    const userId = req.user;
    const transactions = await Transaction.find({ user: userId }).sort({ date: -1 });
    
    // Calculate insights
    const insights = {
      recommendations: [],
      spendingTrends: [],
      alerts: []
    };

    // Get total expenses and income
    const totals = transactions.reduce(
      (acc, t) => {
        if (t.type === "expense") acc.expenses += t.amount;
        if (t.type === "income") acc.income += t.amount;
        return acc;
      },
      { expenses: 0, income: 0 }
    );

    // Generate insights based on spending patterns
    if (totals.expenses > totals.income * 0.9) {
      insights.alerts.push("Your expenses are approaching your income level!");
    }

    // Get category-wise spending
    const categorySpending = {};
    transactions.forEach(t => {
      if (t.type === "expense") {
        categorySpending[t.category] = (categorySpending[t.category] || 0) + t.amount;
      }
    });

    // Find highest spending category
    const highestCategory = Object.entries(categorySpending)
      .sort(([,a], [,b]) => b - a)[0];
    
    if (highestCategory) {
      insights.recommendations.push(
        `Your highest spending is in ${highestCategory[0]}. Consider setting a budget for this category.`
      );
    }

    res.json(insights);
  } catch (error) {
    res.status(500).json({ message: "Error getting financial insights", error: error.message });
  }
};

// Get spending patterns
const getSpendingPatterns = async (req, res) => {
  try {
    const userId = req.user;
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    const patterns = await Transaction.aggregate([
      {
        $match: {
          user: userId,
          type: "expense",
          date: { $gte: lastMonth }
        }
      },
      {
        $group: {
          _id: {
            category: "$category",
            day: { $dayOfMonth: "$date" }
          },
          total: { $sum: "$amount" }
        }
      },
      { $sort: { "_id.day": 1 } }
    ]);

    res.json(patterns);
  } catch (error) {
    res.status(500).json({ message: "Error getting spending patterns", error: error.message });
  }
};

module.exports = {
  getFinanceSummary,
  getCategoryExpenses,
  getFinancialInsights,
  getSpendingPatterns
};
