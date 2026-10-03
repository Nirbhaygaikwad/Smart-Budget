const express = require("express");
const cors = require("cors");
const dotenv = require('dotenv');
const dbConnect = require("./config/dbConnect");
const userRoute = require("./routes/userRouter");
const transactionRoute = require("./routes/transactionRouter");
const goalRoute = require("./routes/goalRouter");
const documentRoute = require("./routes/documentRouter");

// Load env vars
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
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
  
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  
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