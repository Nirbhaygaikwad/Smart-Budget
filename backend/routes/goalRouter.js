const express = require("express");
const goalController = require("../controllers/goalCtrl");
const isAuthenticated = require("../middlewares/isAuth");

const goalRouter = express.Router();

// Apply authentication middleware to all routes
goalRouter.use(isAuthenticated);

// Goal routes
goalRouter.post("/", goalController.create);
goalRouter.get("/", goalController.getAll);
goalRouter.put("/:id", goalController.update);
goalRouter.delete("/:id", goalController.delete);
goalRouter.patch("/:id/progress", goalController.updateProgress);

module.exports = goalRouter;
