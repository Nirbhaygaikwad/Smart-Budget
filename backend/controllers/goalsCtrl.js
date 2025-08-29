const Goal = require('../models/Goal');
const asyncHandler = require('express-async-handler');

// @desc    Create a new goal
// @route   POST /api/v1/goals
// @access  Private
exports.createGoal = asyncHandler(async (req, res) => {
    const { name, targetAmount, deadline } = req.body;
    
    const goal = await Goal.create({
        user: req.user._id,
        name,
        targetAmount,
        deadline,
        currentAmount: 0
    });

    res.status(201).json(goal);
});

// @desc    Get all goals for a user
// @route   GET /api/v1/goals
// @access  Private
exports.getGoals = asyncHandler(async (req, res) => {
    const goals = await Goal.find({ user: req.user._id });
    res.json(goals);
});

// @desc    Update a goal
// @route   PUT /api/v1/goals/:id
// @access  Private
exports.updateGoal = asyncHandler(async (req, res) => {
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
        res.status(404);
        throw new Error('Goal not found');
    }

    // Make sure user owns goal
    if (goal.user.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Not authorized');
    }

    const updatedGoal = await Goal.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );

    res.json(updatedGoal);
});

// @desc    Delete a goal
// @route   DELETE /api/v1/goals/:id
// @access  Private
exports.deleteGoal = asyncHandler(async (req, res) => {
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
        res.status(404);
        throw new Error('Goal not found');
    }

    // Make sure user owns goal
    if (goal.user.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Not authorized');
    }

    await goal.remove();
    res.json({ message: 'Goal removed' });
});
