require("dotenv").config();

const app = require("./app");

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(
    `API Gateway running on http://localhost:${PORT}`
  );

  console.log(
    `Auth Service: ${process.env.AUTH_SERVICE_URL}`
  );

  console.log(
    `Product Service: ${process.env.PRODUCT_SERVICE_URL}`
  );

  console.log(
    `Order Service: ${process.env.ORDER_SERVICE_URL}`
  );
});