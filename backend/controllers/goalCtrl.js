const asyncHandler = require("express-async-handler");
const Goal = require("../model/Goal");

const goalController = {
  // Create goal
  create: asyncHandler(async (req, res) => {
    const { name, targetAmount, deadline, description } = req.body;

    const goal = await Goal.create({
      user: req.user.id,
      name,
      targetAmount,
      deadline,
      description,
      currentAmount: 0,
      status: 'ongoing'
    });

    res.status(201).json({
      status: "success",
      data: goal,
    });
  }),

  // Get all goals for a user
  getAll: asyncHandler(async (req, res) => {
    const goals = await Goal.find({ user: req.user.id })
      .sort({ deadline: 1 });

    // Calculate progress statistics
    const stats = await Goal.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          totalTarget: { $sum: "$targetAmount" },
          totalCurrent: { $sum: "$currentAmount" }
        }
      }
    ]);

    res.json({
      status: "success",
      data: {
        goals,
        stats: stats.reduce((acc, stat) => {
          acc[stat._id] = {
            count: stat.count,
            totalTarget: stat.totalTarget,
            totalCurrent: stat.totalCurrent
          };
          return acc;
        }, {})
      }
    });
  }),

  // Update goal
  update: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, targetAmount, currentAmount, deadline, description, status } = req.body;

    const goal = await Goal.findOneAndUpdate(
      { _id: id, user: req.user.id },
      { name, targetAmount, currentAmount, deadline, description, status },
      { new: true, runValidators: true }
    );

    if (!goal) {
      res.status(404);
      throw new Error("Goal not found");
    }

    res.json({
      status: "success",
      data: goal,
    });
  }),

  // Delete goal
  delete: asyncHandler(async (req, res) => {
    const { id } = req.params;

    const goal = await Goal.findOneAndDelete({
      _id: id,
      user: req.user.id,
    });

    if (!goal) {
      res.status(404);
      throw new Error("Goal not found");
    }

    res.json({
      status: "success",
      data: goal,
    });
  }),

  // Update goal progress
  updateProgress: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { amount } = req.body;

    const goal = await Goal.findOne({ _id: id, user: req.user.id });

    if (!goal) {
      res.status(404);
      throw new Error("Goal not found");
    }

    goal.currentAmount += Number(amount);
    
    // Update status if goal is achieved
    if (goal.currentAmount >= goal.targetAmount) {
      goal.status = 'completed';
    }

    await goal.save();

    res.json({
      status: "success",
      data: goal,
    });
  }),
};

module.exports = goalController;
