const asyncHandler = require("express-async-handler");
const Transaction = require("../model/Transaction");

const transactionController = {
  // Create transaction
  create: asyncHandler(async (req, res) => {
    const { type, amount, category, description, date } = req.body;

    const transaction = await Transaction.create({
      user: req.user.id,
      type,
      amount,
      category,
      description,
      date: date || Date.now(),
    });

    res.status(201).json({
      status: "success",
      data: transaction,
    });
  }),

  // Get all transactions for a user
  getAll: asyncHandler(async (req, res) => {
    const transactions = await Transaction.find({ user: req.user.id })
      .sort({ date: -1 });

    // Calculate totals
    const income = await Transaction.aggregate([
      { $match: { user: req.user._id, type: "income" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const expenses = await Transaction.aggregate([
      { $match: { user: req.user._id, type: "expense" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    // Get monthly totals for chart
    const monthlyData = await Transaction.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
            type: "$type",
          },
          total: { $sum: "$amount" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    // Get category totals
    const categoryTotals = await Transaction.aggregate([
      { $match: { user: req.user._id, type: "expense" } },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
        },
      },
    ]);

    res.json({
      status: "success",
      data: {
        transactions,
        summary: {
          income: income[0]?.total || 0,
          expenses: expenses[0]?.total || 0,
          balance: (income[0]?.total || 0) - (expenses[0]?.total || 0),
        },
        monthlyData,
        categoryTotals,
      },
    });
  }),

  // Update transaction
  update: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { type, amount, category, description, date } = req.body;

    const transaction = await Transaction.findOneAndUpdate(
      { _id: id, user: req.user.id },
      { type, amount, category, description, date },
      { new: true, runValidators: true }
    );

    if (!transaction) {
      res.status(404);
      throw new Error("Transaction not found");
    }

    res.json({
      status: "success",
      data: transaction,
    });
  }),

  // Delete transaction
  delete: asyncHandler(async (req, res) => {
    const { id } = req.params;

    const transaction = await Transaction.findOneAndDelete({
      _id: id,
      user: req.user.id,
    });

    if (!transaction) {
      res.status(404);
      throw new Error("Transaction not found");
    }

    res.json({
      status: "success",
      data: transaction,
    });
  }),
};

module.exports = transactionController;
