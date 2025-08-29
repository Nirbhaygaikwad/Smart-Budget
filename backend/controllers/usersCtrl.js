const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../model/User");

const usersController = {
  // Register user
  register: asyncHandler(async (req, res) => {
    try {
      const { username, email, password } = req.body;

      // Validate input
      if (!username || !email || !password) {
        res.status(400);
        throw new Error("All fields are required");
      }

      // Check if user exists
      const userExists = await User.findOne({ 
        $or: [{ email }, { username }] 
      });
      
      if (userExists) {
        res.status(400);
        throw new Error("User already exists");
      }

      // Create user
      const user = await User.create({
        username,
        email,
        password, // Will be hashed by pre-save middleware
      });

      // Generate token
      const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET || "nirbhayKey",
        { expiresIn: "30d" }
      );

      res.status(201).json({
        status: "success",
        message: "User registered successfully",
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
        },
      });
    } catch (error) {
      res.status(error.status || 500);
      throw error;
    }
  }),

  // Login user
  login: asyncHandler(async (req, res) => {
    try {
      const { email, password } = req.body;

      // Validate input
      if (!email || !password) {
        res.status(400);
        throw new Error("Please provide email and password");
      }

      // Find user and explicitly include password
      const user = await User.findOne({ email }).select("+password");
      
      if (!user) {
        res.status(401);
        throw new Error("Invalid credentials");
      }

      // Check password
      const isMatch = await user.comparePassword(password);
      
      if (!isMatch) {
        res.status(401);
        throw new Error("Invalid credentials");
      }

      // Generate token
      const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET || "nirbhayKey",
        { expiresIn: "30d" }
      );

      // Send response
      res.status(200).json({
        status: "success",
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(error.status || 500);
      throw error;
    }
  }),

  // Get user profile
  getProfile: asyncHandler(async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        res.status(404);
        throw new Error("User not found");
      }
      res.json({
        status: "success",
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
        },
      });
    } catch (error) {
      res.status(error.status || 500);
      throw error;
    }
  }),

  // Update user profile
  updateProfile: asyncHandler(async (req, res) => {
    const user = await User.findById(req.user);

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;

    const updatedUser = await user.save();

    res.status(200).json({
      status: "success",
      user: {
        id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
      },
    });
  }),

  // Change password
  changePassword: asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      res.status(400);
      throw new Error("Please provide current and new password");
    }

    const user = await User.findById(req.user);

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    // Check current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      res.status(401);
      throw new Error("Current password is incorrect");
    }

    // Set new password (will be hashed by pre-save middleware)
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      status: "success",
      message: "Password updated successfully",
    });
  }),
};

module.exports = usersController;