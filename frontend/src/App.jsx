import { useState } from "react";
import HomePage from "./pages/HomePage";

function App() {
  const [cart, setCart] = useState([]);

  function addToCart(product) {
    setCart((currentCart) => {
      const existingItem = currentCart.find(
        (item) => item.id === product.id
      );

      if (existingItem) {
        return currentCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...currentCart, { ...product, quantity: 1 }];
    });
  }

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <HomePage
      cartCount={cartCount}
      addToCart={addToCart}
    />
  );
}

export default App;