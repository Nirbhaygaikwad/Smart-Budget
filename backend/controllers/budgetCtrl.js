const asyncHandler = require("express-async-handler");
const Budget = require("../model/Budget");

const duplicateError = (res) => {
  res.status(400);
  return new Error("A budget goal already exists for this month and category");
};

const budgetController = {
  // Create budget
  create: asyncHandler(async (req, res) => {
    const { category, amount, month } = req.body;

    try {
      const budget = await Budget.create({ user: req.user, category, amount, month });
      res.status(201).json({
        status: "success",
        data: budget,
      });
    } catch (error) {
      if (error.code === 11000) throw duplicateError(res);
      throw error;
    }
  }),

  // Get all budgets for a user
  getAll: asyncHandler(async (req, res) => {
    const budgets = await Budget.find({ user: req.user }).sort({ month: 1 });

    res.json({
      status: "success",
      data: budgets,
    });
  }),

  // Update budget
  update: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { category, amount, month } = req.body;

    try {
      const budget = await Budget.findOneAndUpdate(
        { _id: id, user: req.user },
        { category, amount, month },
        { new: true, runValidators: true }
      );

      if (!budget) {
        res.status(404);
        throw new Error("Budget not found");
      }

      res.json({
        status: "success",
        data: budget,
      });
    } catch (error) {
      if (error.code === 11000) throw duplicateError(res);
      throw error;
    }
  }),

  // Delete budget
  delete: asyncHandler(async (req, res) => {
    const { id } = req.params;

    const budget = await Budget.findOneAndDelete({ _id: id, user: req.user });

    if (!budget) {
      res.status(404);
      throw new Error("Budget not found");
    }

    res.json({
      status: "success",
      data: budget,
    });
  }),
};

module.exports = budgetController;
