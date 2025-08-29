const express = require("express");
const transactionController = require("../controllers/transactionCtrl");
const isAuthenticated = require("../middlewares/isAuth");

const transactionRouter = express.Router();

// Apply authentication middleware to all routes
transactionRouter.use(isAuthenticated);

// Transaction routes
transactionRouter.post("/", transactionController.create);
transactionRouter.get("/", transactionController.getAll);
transactionRouter.put("/:id", transactionController.update);
transactionRouter.delete("/:id", transactionController.delete);

module.exports = transactionRouter;