import { useEffect, useState } from "react";
import {
  LoaderCircle,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  X
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

function CartDrawer({
  isOpen,
  cart,
  onClose,
  onIncrease,
  onDecrease,
  onRemove,
  onClear,
  onOrderCreated
}) {
  const { isAuthenticated } = useAuth();
  const [checkingOut, setCheckingOut] =
    useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    document.body.style.overflow = "hidden";

    function closeWithEscape(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener(
      "keydown",
      closeWithEscape
    );

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener(
        "keydown",
        closeWithEscape
      );
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const total = cart.reduce(
    (sum, item) =>
      sum + Number(item.price) * item.quantity,
    0
  );

  async function checkout() {
    setError("");

    if (!isAuthenticated) {
      setError(
        "Sign in using the header before completing checkout."
      );
      return;
    }

    if (cart.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    try {
      setCheckingOut(true);

      await api.post("/orders", {
        items: cart.map((item) => ({
          productId: item.id,
          quantity: item.quantity
        }))
      });

      onOrderCreated();
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to complete checkout."
      );
    } finally {
      setCheckingOut(false);
    }
  }

  return (
    <div
      className="drawer-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <aside className="cart-drawer">
        <div className="drawer-header">
          <div>
            <span>Your shopping cart</span>
            <h2>
              Cart ({cart.length})
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close cart"
          >
            <X size={22} />
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="empty-cart">
            <span>
              <ShoppingBag size={34} />
            </span>

            <h3>Your cart is empty</h3>

            <p>Add a product to begin your order.</p>

            <button type="button" onClick={onClose}>
              Continue shopping
            </button>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cart.map((item) => (
                <article
                  className="cart-item"
                  key={item.id}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                  />

                  <div className="cart-item-details">
                    <div className="cart-item-heading">
                      <div>
                        <span>{item.category}</span>
                        <h3>{item.name}</h3>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          onRemove(item.id)
                        }
                        aria-label={`Remove ${item.name}`}
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>

                    <strong>
                      KSh{" "}
                      {Number(
                        item.price
                      ).toLocaleString()}
                    </strong>

                    <div className="quantity-controls">
                      <button
                        type="button"
                        onClick={() =>
                          onDecrease(item.id)
                        }
                      >
                        <Minus size={15} />
                      </button>

                      <span>{item.quantity}</span>

                      <button
                        type="button"
                        disabled={
                          item.quantity >=
                          Math.min(item.stock, 10)
                        }
                        onClick={() =>
                          onIncrease(item.id)
                        }
                      >
                        <Plus size={15} />
                      </button>

                      <small>
                        Subtotal: KSh{" "}
                        {(
                          Number(item.price) *
                          item.quantity
                        ).toLocaleString()}
                      </small>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="cart-summary">
              <button
                className="clear-cart-button"
                type="button"
                onClick={onClear}
              >
                Clear cart
              </button>

              <div className="cart-total-row">
                <span>Total</span>
                <strong>
                  KSh {total.toLocaleString()}
                </strong>
              </div>

              {error && (
                <div className="cart-error">
                  {error}
                </div>
              )}

              <button
                className="checkout-button"
                type="button"
                disabled={checkingOut}
                onClick={checkout}
              >
                {checkingOut && (
                  <LoaderCircle
                    size={19}
                    className="spinning-icon"
                  />
                )}

                {checkingOut
                  ? "Creating order..."
                  : isAuthenticated
                    ? "Complete checkout"
                    : "Sign in to checkout"}
              </button>

              <p>
                Final prices are verified by Product
                Service before Order Service creates the
                order.
              </p>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}

export default CartDrawer;