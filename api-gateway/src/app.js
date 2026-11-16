const express = require("express");
const cors = require("cors");
const {
  createProxyMiddleware
} = require("http-proxy-middleware");
const {
  requestLogger
} = require("./middleware/requestLogger");

const app = express();

const frontendUrl =
  process.env.FRONTEND_URL || "http://localhost:5173";

const authServiceUrl =
  process.env.AUTH_SERVICE_URL || "http://localhost:4001";

const productServiceUrl =
  process.env.PRODUCT_SERVICE_URL || "http://localhost:4002";

const orderServiceUrl =
  process.env.ORDER_SERVICE_URL || "http://localhost:4003";

app.use(
  cors({
    origin: frontendUrl
  })
);

app.use(requestLogger);

app.get("/", (req, res) => {
  res.json({
    service: "api-gateway",
    status: "UP",
    routes: {
      auth: "/api/auth",
      products: "/api/products",
      orders: "/api/orders"
    }
  });
});

app.get("/health", (req, res) => {
  res.json({
    service: "api-gateway",
    status: "UP",
    timestamp: new Date().toISOString()
  });
});

/*
 * /api/auth/register becomes /auth/register.
 * /api/auth/login becomes /auth/login.
 * /api/auth/me becomes /auth/me.
 */
app.use(
  "/api/auth",
  createProxyMiddleware({
    target: authServiceUrl,
    changeOrigin: true,

    // Express removes /api/auth, leaving /login or /register.
    // This adds /auth back for the Auth Service.
    pathRewrite: (path) => `/auth${path}`,

    on: {
      proxyReq(proxyReq, req) {
        console.log(
          `[Gateway] ${req.method} ${req.originalUrl} -> ` +
          `${authServiceUrl}/auth${req.url}`
        );
      },

      error(error, req, res) {
        console.error(
          "Auth Service proxy error:",
          error.message
        );

        if (!res.headersSent) {
          res.status(503).json({
            message: "Authentication Service is unavailable"
          });
        }
      }
    }
  })
);

/*
 * /api/products becomes /products.
 * /api/products/1 becomes /products/1.
 */
app.use(
  "/api/products",
  createProxyMiddleware({
    target: productServiceUrl,
    changeOrigin: true,

    pathRewrite: (path) => `/products${path}`,

    on: {
      proxyReq(proxyReq, req) {
        console.log(
          `[Gateway] ${req.method} ${req.originalUrl} -> ` +
          `${productServiceUrl}/products${req.url}`
        );
      },

      error(error, req, res) {
        console.error(
          "Product Service proxy error:",
          error.message
        );

        if (!res.headersSent) {
          res.status(503).json({
            message: "Product Service is unavailable"
          });
        }
      }
    }
  })
);
/*
 * This route will work after we build Order Service.
 */
app.use(
  "/api/orders",
  createProxyMiddleware({
    target: orderServiceUrl,
    changeOrigin: true,

    pathRewrite: (path) => `/orders${path}`,

    on: {
      proxyReq(proxyReq, req) {
        console.log(
          `[Gateway] ${req.method} ${req.originalUrl} -> ` +
          `${orderServiceUrl}/orders${req.url}`
        );
      },

      error(error, req, res) {
        console.error(
          "Order Service proxy error:",
          error.message
        );

        if (!res.headersSent) {
          res.status(503).json({
            message: "Order Service is unavailable"
          });
        }
      }
    }
  })
);

app.use((req, res) => {
  res.status(404).json({
    message: "API Gateway route not found"
  });
});

module.exports = app;