import { useEffect, useMemo, useState } from "react";
import Header from "../components/Header";
import Hero from "../components/Hero";
import ProductCard from "../components/ProductCard";

const PRODUCT_SERVICE_URL = "http://localhost:4002";

const categories = [
  "All",
  "Audio",
  "Smart Watches",
  "Power",
  "Personal Care"
];

function HomePage({ cartCount, addToCart }) {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${PRODUCT_SERVICE_URL}/products`
        );

        if (!response.ok) {
          throw new Error("Unable to retrieve products");
        }

        const productData = await response.json();
        setProducts(productData);
      } catch (requestError) {
        console.error(requestError);

        setError(
          "Product Service is unavailable. Ensure it is running on port 4002."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  const visibleProducts = useMemo(() => {
    if (selectedCategory === "All") {
      return products;
    }

    return products.filter(
      (product) => product.category === selectedCategory
    );
  }, [products, selectedCategory]);

  return (
    <div>
      <Header cartCount={cartCount} />

      <main>
        <Hero />

        <section className="product-section" id="products">
          <div className="section-heading">
            <div>
              <span className="section-label">LIMITED-TIME OFFERS</span>
              <h2>Today’s top deals</h2>
              <p>
                Shop our most popular technology products at
                discounted prices.
              </p>
            </div>

            <div className="category-filters">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  className={
                    selectedCategory === category
                      ? "filter-button active"
                      : "filter-button"
                  }
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {loading && (
            <div className="system-message">
              Loading products...
            </div>
          )}

          {error && (
            <div className="system-message error-message">
              <strong>Connection error</strong>
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && (
            <div className="product-grid">
              {visibleProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  addToCart={addToCart}
                />
              ))}
            </div>
          )}

          {!loading &&
            !error &&
            visibleProducts.length === 0 && (
              <div className="system-message">
                No products are available in this category.
              </div>
            )}
        </section>
      </main>

      <footer className="site-footer">
        <div>
          <a href="/" className="footer-brand">
            NEXA<span>STORE</span>
          </a>

          <p>
            A service-oriented e-commerce demonstration system.
          </p>
        </div>

        <div>
          <strong>Architecture</strong>
          <span>Authentication Service</span>
          <span>Product Service</span>
          <span>Order Service</span>
          <span>API Gateway</span>
        </div>

        <div>
          <strong>Customer service</strong>
          <span>Help centre</span>
          <span>Delivery information</span>
          <span>Returns</span>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;