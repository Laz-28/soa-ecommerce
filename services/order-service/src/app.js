const express = require("express");
const cors = require("cors");

const orderRoutes = require("./routes/orderRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    service: "order-service",
    status: "UP"
  });
});

app.get("/health", (req, res) => {
  res.json({
    service: "order-service",
    status: "UP",
    timestamp: new Date().toISOString()
  });
});

app.use("/orders", orderRoutes);

app.use((error, req, res, next) => {
  if (error instanceof SyntaxError) {
    return res.status(400).json({
      message: "Invalid JSON request body"
    });
  }

  console.error("Unhandled error:", error);

  return res.status(500).json({
    message: "An unexpected error occurred"
  });
});

app.use((req, res) => {
  res.status(404).json({
    message: "Order Service endpoint not found"
  });
});

module.exports = app;