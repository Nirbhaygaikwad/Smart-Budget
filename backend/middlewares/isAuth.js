const jwt = require("jsonwebtoken");
const User = require("../model/User");

const isAuthenticated = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      res.status(401);
      throw new Error("Not authorized - No token");
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "nirbhayKey");

    // Get user from token
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      res.status(401);
      throw new Error("Not authorized - User not found");
    }

    // Add user to request object
    req.user = user._id;
    next();
  } catch (error) {
    res.status(401);
    next(error);
  }
};

module.exports = isAuthenticated;
