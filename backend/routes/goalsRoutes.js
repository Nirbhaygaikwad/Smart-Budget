const express = require('express');
const router = express.Router();
const isAuthenticated = require("../middlewares/isAuth");
const { addGoal, getGoals, deleteGoal } = require('../controllers/goalController');

// Add a new goal
router.post('/', addGoal);

// Get all goals of the user
router.get('/', getGoals);

// Delete a goal
router.delete('/:goalId', deleteGoal);

module.exports = router;
