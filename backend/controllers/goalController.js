const Goal = require('../model/Goal');

// Create a goal
const addGoal = async (req, res) => {
  const { description, targetAmount, targetDate } = req.body;

  try {
    const newGoal = new Goal({
      userId: req.user, // This links the goal to the logged-in user
      description,
      targetAmount,
      targetDate
    });

    await newGoal.save();
    res.status(201).json(newGoal);
  } catch (err) {
    res.status(500).json({ message: 'Server error while creating goal' });
  }
};

// Get all goals for a specific user
const getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.user });
    res.status(200).json(goals);
  } catch (err) {
    res.status(500).json({ message: 'Server error while fetching goals' });
  }
};

// Delete a goal
const deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findOneAndDelete({ _id: req.params.goalId, userId: req.user });
    if (!goal) return res.status(404).json({ message: 'Goal not found or unauthorized' });
    res.status(200).json({ message: 'Goal deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error while deleting goal' });
  }
};

module.exports = { addGoal, getGoals, deleteGoal };
