const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersCtrl");
const isAuthenticated = require("../middlewares/isAuth");

const userRouter = express.Router();

// Public routes
userRouter.post("/register", usersController.register);
userRouter.post("/login", usersController.login);

// Protected routes - require authentication
userRouter.get("/profile", isAuthenticated, usersController.getProfile);

module.exports = userRouter;