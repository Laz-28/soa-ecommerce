const fs = require("fs");
const path = require("path");

const dataDirectory = path.join(__dirname, "../../data");
const ordersFile = path.join(dataDirectory, "orders.json");

function ensureOrdersFileExists() {
  if (!fs.existsSync(dataDirectory)) {
    fs.mkdirSync(dataDirectory, {
      recursive: true
    });
  }

  if (!fs.existsSync(ordersFile)) {
    fs.writeFileSync(
      ordersFile,
      JSON.stringify([], null, 2)
    );
  }
}

function readOrders() {
  ensureOrdersFileExists();

  const fileContents = fs.readFileSync(
    ordersFile,
    "utf-8"
  );

  try {
    return JSON.parse(fileContents);
  } catch {
    return [];
  }
}

function writeOrders(orders) {
  ensureOrdersFileExists();

  fs.writeFileSync(
    ordersFile,
    JSON.stringify(orders, null, 2)
  );
}

function createOrder({
  userId,
  customerEmail,
  items,
  total
}) {
  const orders = readOrders();

  const nextId =
    orders.length === 0
      ? 1
      : Math.max(...orders.map((order) => order.id)) + 1;

  const order = {
    id: nextId,
    reference: `NEXA-${String(nextId).padStart(5, "0")}`,
    userId,
    customerEmail,
    items,
    total,
    status: "CREATED",
    createdAt: new Date().toISOString()
  };

  orders.push(order);
  writeOrders(orders);

  return order;
}

function findOrdersByUserId(userId) {
  return readOrders()
    .filter((order) => order.userId === userId)
    .sort(
      (firstOrder, secondOrder) =>
        new Date(secondOrder.createdAt) -
        new Date(firstOrder.createdAt)
    );
}

function findOrderById(orderId) {
  return readOrders().find(
    (order) => order.id === orderId
  );
}

module.exports = {
  createOrder,
  findOrdersByUserId,
  findOrderById
};