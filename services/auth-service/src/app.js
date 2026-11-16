const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    service: "auth-service",
    status: "UP"
  });
});

app.get("/health", (req, res) => {
  res.json({
    service: "auth-service",
    status: "UP",
    timestamp: new Date().toISOString()
  });
});

app.use("/auth", authRoutes);

app.use((req, res) => {
  res.status(404).json({
    message: "Auth Service endpoint not found"
  });
});

module.exports = app;