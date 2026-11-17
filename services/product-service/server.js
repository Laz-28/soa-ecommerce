const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 4002;

app.use(cors());
app.use(express.json());

const products = [
  {
    id: 1,
    name: "NexaPods Air",
    category: "Audio",
    description:
      "Wireless earbuds with clear calls and deep bass.",
    price: 2100,
    originalPrice: 4000,
    rating: 4.8,
    reviewCount: 926,
    stock: 20,
    badge: "BEST SELLER",
    image: "/products/nexapods-air.jpg"
  },
  {
    id: 2,
    name: "NexaWatch Pro",
    category: "Smart Watches",
    description:
      "Smart watch with health tracking and HD calling.",
    price: 4500,
    originalPrice: 6500,
    rating: 4.7,
    reviewCount: 541,
    stock: 14,
    badge: "NEW",
    image: "/products/nexawatch-pro.jpg"
  },
  {
    id: 3,
    name: "PowerCore 20",
    category: "Power",
    description:
      "20,000mAh power bank with fast charging.",
    price: 3200,
    originalPrice: 5000,
    rating: 4.9,
    reviewCount: 1204,
    stock: 18,
    badge: "HOT DEAL",
    image: "/products/powercore-20.jpg"
  },
  {
    id: 4,
    name: "BoomWave Headphones",
    category: "Audio",
    description:
      "Wireless over-ear headphones with powerful bass.",
    price: 3900,
    originalPrice: 7000,
    rating: 4.7,
    reviewCount: 875,
    stock: 12,
    badge: "FLASH SALE",
    image: "/products/boomwave-headphones.jpg"
  },
  {
    id: 5,
    name: "Nexa Grooming Kit",
    category: "Personal Care",
    description:
      "All-in-one rechargeable grooming kit.",
    price: 2900,
    originalPrice: 5000,
    rating: 4.8,
    reviewCount: 734,
    stock: 16,
    badge: "POPULAR",
    image: "/products/grooming-kit.jpg"
  },
  {
    id: 6,
    name: "PowerCube 33",
    category: "Power",
    description:
      "Compact 33W wall charger with fast charging.",
    price: 1800,
    originalPrice: 2800,
    rating: 4.6,
    reviewCount: 348,
    stock: 25,
    badge: "SAVE 36%",
    image: "/products/powercube-33.jpg"
  }
];


app.get("/", (req, res) => {
  res.json({
    service: "product-service",
    status: "UP"
  });
});

app.get("/products", (req, res) => {
  const category = req.query.category;

  if (!category || category === "All") {
    return res.json(products);
  }

  const filteredProducts = products.filter(
    (product) =>
      product.category.toLowerCase() === category.toLowerCase()
  );

  res.json(filteredProducts);
});

app.get("/products/:id", (req, res) => {
  const productId = Number(req.params.id);

  const product = products.find(
    (currentProduct) => currentProduct.id === productId
  );

  if (!product) {
    return res.status(404).json({
      message: "Product not found"
    });
  }

  res.json(product);
});

app.listen(PORT, () => {
  console.log(`Product Service running on http://localhost:${PORT}`);
});