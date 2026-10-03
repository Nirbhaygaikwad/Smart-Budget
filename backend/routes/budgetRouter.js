const express = require("express");
const budgetController = require("../controllers/budgetCtrl");
const isAuthenticated = require("../middlewares/isAuth");

const budgetRouter = express.Router();

// Apply authentication middleware to all routes
budgetRouter.use(isAuthenticated);

// Budget routes
budgetRouter.post("/", budgetController.create);
budgetRouter.get("/", budgetController.getAll);
budgetRouter.put("/:id", budgetController.update);
budgetRouter.delete("/:id", budgetController.delete);

module.exports = budgetRouter;
