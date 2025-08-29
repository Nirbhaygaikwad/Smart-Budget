const express = require("express");
const router = express.Router();
const {
  getFinanceSummary,
  getCategoryExpenses,
  getFinancialInsights,
  getSpendingPatterns
} = require("../controllers/financeController");
const isAuthenticated = require("../middlewares/isAuth");

// All routes need authentication
router.use(isAuthenticated);

// Finance summary route
router.get("/summary", getFinanceSummary);

// Category expenses route
router.get("/category-expenses", getCategoryExpenses);

// Financial insights route
router.get("/insights", getFinancialInsights);

// Spending patterns route
router.get("/spending-patterns", getSpendingPatterns);

module.exports = router;
