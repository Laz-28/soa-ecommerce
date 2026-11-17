import { useEffect, useState } from "react";
import {
  LoaderCircle,
  Package,
  X
} from "lucide-react";
import api from "../services/api";

function OrdersModal({ isOpen, onClose }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    async function loadOrders() {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          "/orders/my-orders"
        );

        setOrders(response.data.orders);
      } catch (requestError) {
        setError(
          requestError.response?.data?.message ||
            "Unable to retrieve your orders."
        );
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="modal-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section className="orders-modal">
        <div className="orders-modal-header">
          <div>
            <span>Customer account</span>
            <h2>My orders</h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close orders"
          >
            <X size={21} />
          </button>
        </div>

        {loading && (
          <div className="orders-loading">
            <LoaderCircle
              className="spinning-icon"
              size={25}
            />
            Loading orders...
          </div>
        )}

        {error && (
          <div className="cart-error">{error}</div>
        )}

        {!loading &&
          !error &&
          orders.length === 0 && (
            <div className="orders-empty">
              <Package size={36} />
              <h3>No orders yet</h3>
              <p>
                Your completed orders will appear here.
              </p>
            </div>
          )}

        {!loading && !error && orders.length > 0 && (
          <div className="orders-list">
            {orders.map((order) => (
              <article
                className="order-card"
                key={order.id}
              >
                <div className="order-card-heading">
                  <div>
                    <span>Order reference</span>
                    <strong>{order.reference}</strong>
                  </div>

                  <span className="order-status">
                    {order.status}
                  </span>
                </div>

                <div className="order-items-summary">
                  {order.items.map((item) => (
                    <div
                      key={`${order.id}-${item.productId}`}
                    >
                      <span>
                        {item.name} × {item.quantity}
                      </span>

                      <strong>
                        KSh{" "}
                        {Number(
                          item.subtotal
                        ).toLocaleString()}
                      </strong>
                    </div>
                  ))}
                </div>

                <div className="order-card-footer">
                  <span>
                    {new Date(
                      order.createdAt
                    ).toLocaleString()}
                  </span>

                  <strong>
                    KSh{" "}
                    {Number(
                      order.total
                    ).toLocaleString()}
                  </strong>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default OrdersModal;