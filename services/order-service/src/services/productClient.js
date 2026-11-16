const axios = require("axios");

const productServiceUrl =
  process.env.PRODUCT_SERVICE_URL || "http://localhost:4002";

const productApi = axios.create({
  baseURL: productServiceUrl,
  timeout: 4000
});

async function getProductById(productId) {
  try {
    const response = await productApi.get(
      `/products/${productId}`
    );

    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      const productError = new Error(
        `Product ${productId} was not found`
      );

      productError.statusCode = 400;
      throw productError;
    }

    if (
      error.code === "ECONNREFUSED" ||
      error.code === "ECONNABORTED"
    ) {
      const serviceError = new Error(
        "Product Service is temporarily unavailable"
      );

      serviceError.statusCode = 503;
      throw serviceError;
    }

    const serviceError = new Error(
      "Unable to retrieve product information"
    );

    serviceError.statusCode = 502;
    throw serviceError;
  }
}

module.exports = {
  getProductById
};