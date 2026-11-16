const express = require("express");

const {
  createOrder,
  getMyOrders,
  getMyOrderById
} = require("../controllers/orderController");

const {
  authenticate
} = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authenticate);

router.post("/", createOrder);
router.get("/my-orders", getMyOrders);
router.get("/:id", getMyOrderById);

module.exports = router;