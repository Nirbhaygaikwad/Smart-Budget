const express = require("express");
const cors = require("cors");
const dotenv = require('dotenv');
const dbConnect = require("./config/dbConnect");
const userRoute = require("./routes/userRouter");
const transactionRoute = require("./routes/transactionRouter");
const goalRoute = require("./routes/goalRouter");
const documentRoute = require("./routes/documentRouter");
const budgetRoute = require("./routes/budgetRouter");

// Load env vars
dotenv.config();

// Tokens signed with a guessable fallback could be forged, so refuse to start without a secret
if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is not set");
}

const app = express();

// Don't advertise the server framework
app.disable("x-powered-by");

// Middleware
// Documents are uploaded as base64 data URLs, so allow larger bodies
app.use(express.json({ limit: "5mb" }));
app.use(cors());

// Ensure the database is connected before handling any request
app.use(async (req, res, next) => {
  try {
    await dbConnect();
    next();
  } catch (error) {
    next(error);
  }
});

// Routes
app.use("/api/v1/users", userRoute);
app.use("/api/v1/transactions", transactionRoute);
app.use("/api/v1/goals", goalRoute);
app.use("/api/v1/documents", documentRoute);
app.use("/api/v1/budgets", budgetRoute);

// Handle 404
app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Route not found"
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  let statusCode = err.statusCode || err.status || (res.statusCode >= 400 ? res.statusCode : 500);
  let message = err.message || "Internal Server Error";

  if (err.name === "CastError") {
    // Malformed ids (e.g. /documents/abc) - don't expose Mongoose internals
    statusCode = 404;
    message = "Resource not found";
  } else if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors).map((e) => e.message).join(", ");
  } else if (statusCode >= 500) {
    // Unexpected errors are logged above; don't send their details to the client
    message = "Internal Server Error";
  }
  
  res.status(statusCode).json({
    status: "error",
    message: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

const PORT = process.env.PORT || 8000;

// Start a local server only when run directly (Vercel imports the app instead)
if (require.main === module) {
  dbConnect()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      });
    })
    .catch((error) => {
      console.error('Failed to start server:', error);
      process.exit(1);
    });
}

module.exports = app;