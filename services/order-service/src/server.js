require("dotenv").config();

const app = require("./app");

const PORT = process.env.PORT || 4003;

if (!process.env.JWT_SECRET) {
  console.error(
    "JWT_SECRET is missing from the environment"
  );

  process.exit(1);
}

if (!process.env.PRODUCT_SERVICE_URL) {
  console.error(
    "PRODUCT_SERVICE_URL is missing from the environment"
  );

  process.exit(1);
}

app.listen(PORT, () => {
  console.log(
    `Order Service running on http://localhost:${PORT}`
  );

  console.log(
    `Product Service: ${process.env.PRODUCT_SERVICE_URL}`
  );
});