import { useState } from "react";
import HomePage from "./pages/HomePage";
import CartDrawer from "./components/CartDrawer";
import OrdersModal from "./components/OrdersModal";

function App() {
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [ordersOpen, setOrdersOpen] = useState(false);

  function addToCart(product) {
    setCart((currentCart) => {
      const existingItem = currentCart.find(
        (item) => item.id === product.id
      );

      if (existingItem) {
        return currentCart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: Math.min(
                  item.quantity + 1,
                  Math.min(item.stock, 10)
                )
              }
            : item
        );
      }

      return [
        ...currentCart,
        {
          ...product,
          quantity: 1
        }
      ];
    });

    setCartOpen(true);
  }

  function increaseQuantity(productId) {
    setCart((currentCart) =>
      currentCart.map((item) =>
        item.id === productId
          ? {
              ...item,
              quantity: Math.min(
                item.quantity + 1,
                Math.min(item.stock, 10)
              )
            }
          : item
      )
    );
  }

  function decreaseQuantity(productId) {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === productId
            ? {
                ...item,
                quantity: item.quantity - 1
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  function removeFromCart(productId) {
    setCart((currentCart) =>
      currentCart.filter((item) => item.id !== productId)
    );
  }

  function clearCart() {
    setCart([]);
  }

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <>
      <HomePage
        cartCount={cartCount}
        addToCart={addToCart}
        onOpenCart={() => setCartOpen(true)}
        onOpenOrders={() => setOrdersOpen(true)}
      />

      <CartDrawer
        isOpen={cartOpen}
        cart={cart}
        onClose={() => setCartOpen(false)}
        onIncrease={increaseQuantity}
        onDecrease={decreaseQuantity}
        onRemove={removeFromCart}
        onClear={clearCart}
        onOrderCreated={() => {
          clearCart();
          setCartOpen(false);
          setOrdersOpen(true);
        }}
      />

      <OrdersModal
        isOpen={ordersOpen}
        onClose={() => setOrdersOpen(false)}
      />
    </>
  );
}

export default App;