import { useState } from "react";
import {
  Headphones,
  ShoppingCart,
  Smartphone,
  Star,
  Watch,
  Zap
} from "lucide-react";

function ProductVisual({ product }) {
  const [imageFailed, setImageFailed] = useState(false);

  function getProductIcon() {
    const category = product.category.toLowerCase();

    if (category.includes("audio")) {
      return <Headphones size={72} strokeWidth={1.3} />;
    }

    if (category.includes("watch")) {
      return <Watch size={72} strokeWidth={1.3} />;
    }

    if (category.includes("power")) {
      return <Zap size={72} strokeWidth={1.3} />;
    }

    return <Smartphone size={72} strokeWidth={1.3} />;
  }

  if (!product.image || imageFailed) {
    return (
      <div className="product-image-fallback">
        {getProductIcon()}
        <strong>{product.name}</strong>
        <span>{product.category}</span>
      </div>
    );
  }

  return (
    <img
      src={product.image}
      alt={product.name}
      className="product-image"
      loading="lazy"
      onError={() => setImageFailed(true)}
    />
  );
}

function ProductCard({ product, addToCart }) {
  const discount = Math.round(
    ((product.originalPrice - product.price) /
      product.originalPrice) *
      100
  );

  return (
    <article className="product-card">
      <div className="product-image-container">
        <ProductVisual product={product} />

        <span className="product-badge">
          {product.badge}
        </span>

        <span className="discount-label">
          -{discount}%
        </span>
      </div>

      <div className="product-information">
        <span className="product-category">
          {product.category}
        </span>

        <h3>{product.name}</h3>

        <p className="product-description">
          {product.description}
        </p>

        <div className="rating">
          <Star size={16} fill="currentColor" />
          <strong>{product.rating}</strong>
          <span>({product.reviewCount})</span>
        </div>

        <div className="product-footer">
          <div className="price-container">
            <strong>
              KSh {product.price.toLocaleString()}
            </strong>

            <span>
              KSh {product.originalPrice.toLocaleString()}
            </span>
          </div>

          <button
            className="add-cart-button"
            type="button"
            onClick={() => addToCart(product)}
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingCart size={20} />
          </button>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;