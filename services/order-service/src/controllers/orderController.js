const {
  getProductById
} = require("../services/productClient");

const {
  createOrder: saveOrder,
  findOrdersByUserId,
  findOrderById
} = require("../services/orderService");

async function createOrder(req, res) {
  try {
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: "The order must contain at least one item"
      });
    }

    if (items.length > 20) {
      return res.status(400).json({
        message: "An order cannot contain more than 20 items"
      });
    }

    const normalizedItems = [];

    for (const item of items) {
      const productId = Number(item.productId);
      const quantity = Number(item.quantity);

      if (
        !Number.isInteger(productId) ||
        productId <= 0
      ) {
        return res.status(400).json({
          message: "Every item must have a valid productId"
        });
      }

      if (
        !Number.isInteger(quantity) ||
        quantity < 1 ||
        quantity > 10
      ) {
        return res.status(400).json({
          message:
            "Each item quantity must be between 1 and 10"
        });
      }

      const product = await getProductById(productId);

      if (product.stock < quantity) {
        return res.status(409).json({
          message:
            `Only ${product.stock} unit(s) of ` +
            `${product.name} are available`
        });
      }

      const unitPrice = Number(product.price);
      const subtotal = unitPrice * quantity;

      normalizedItems.push({
        productId: product.id,
        name: product.name,
        unitPrice,
        quantity,
        subtotal
      });
    }

    const total = normalizedItems.reduce(
      (sum, item) => sum + item.subtotal,
      0
    );

    const order = saveOrder({
      userId: req.user.userId,
      customerEmail: req.user.email,
      items: normalizedItems,
      total
    });

    return res.status(201).json({
      message: "Order created successfully",
      order
    });
  } catch (error) {
    console.error("Create order error:", error.message);

    return res
      .status(error.statusCode || 500)
      .json({
        message:
          error.message || "Unable to create the order"
      });
  }
}

function getMyOrders(req, res) {
  const orders = findOrdersByUserId(
    req.user.userId
  );

  return res.json({
    count: orders.length,
    orders
  });
}

function getMyOrderById(req, res) {
  const orderId = Number(req.params.id);

  if (!Number.isInteger(orderId) || orderId <= 0) {
    return res.status(400).json({
      message: "Invalid order ID"
    });
  }

  const order = findOrderById(orderId);

  if (
    !order ||
    order.userId !== req.user.userId
  ) {
    return res.status(404).json({
      message: "Order not found"
    });
  }

  return res.json({
    order
  });
}

module.exports = {
  createOrder,
  getMyOrders,
  getMyOrderById
};