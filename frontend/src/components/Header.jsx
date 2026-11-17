import { useState } from "react";
import {
  ChevronDown,
  LogOut,
  Menu,
  Package,
  Search,
  ShoppingBag,
  UserRound
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import AuthModal from "./AuthModal";

function Header({
  cartCount,
  onOpenCart,
  onOpenOrders
}) {
  const {
    user,
    isAuthenticated,
    initializing,
    logout
  } = useAuth();

  const [authModalOpen, setAuthModalOpen] =
    useState(false);

  const [accountMenuOpen, setAccountMenuOpen] =
    useState(false);

  return (
    <>
      <div className="promotion-bar">
        <p>Free delivery on orders above KSh 3,000</p>
        <span>Service-Oriented Demo Store</span>
      </div>

      <header className="main-header">
        <a href="/" className="brand">
          NEXA<span>STORE</span>
        </a>

        <div className="search-box">
          <Search size={19} />

          <input
            type="text"
            placeholder="Search products"
            aria-label="Search products"
          />

          <button type="button">Search</button>
        </div>

        <nav className="header-actions">
          {!initializing && !isAuthenticated && (
            <button
              className="icon-button"
              type="button"
              onClick={() => setAuthModalOpen(true)}
            >
              <UserRound size={22} />
              <span>Sign in</span>
            </button>
          )}

          {!initializing && isAuthenticated && (
            <div className="account-menu">
              <button
                className="account-button"
                type="button"
                onClick={() =>
                  setAccountMenuOpen((open) => !open)
                }
              >
                <span className="account-avatar">
                  {user.name.charAt(0).toUpperCase()}
                </span>

                <span className="account-details">
                  <small>Welcome</small>
                  <strong>
                    {user.name.split(" ")[0]}
                  </strong>
                </span>

                <ChevronDown size={16} />
              </button>

              {accountMenuOpen && (
                <div className="account-dropdown">
                  <div>
                    <strong>{user.name}</strong>
                    <span>{user.email}</span>
                  </div>

                  <button
                    className="orders-menu-button"
                    type="button"
                    onClick={() => {
                      setAccountMenuOpen(false);
                      onOpenOrders();
                    }}
                  >
                    <Package size={17} />
                    My orders
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setAccountMenuOpen(false);
                    }}
                  >
                    <LogOut size={17} />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          )}

          <button
            className="cart-button"
            type="button"
            onClick={onOpenCart}
          >
            <ShoppingBag size={22} />
            <span>Cart</span>

            {cartCount > 0 && (
              <strong className="cart-count">
                {cartCount}
              </strong>
            )}
          </button>
        </nav>
      </header>

      <nav className="category-navigation">
        <button
          className="mobile-menu-button"
          type="button"
        >
          <Menu size={20} />
          Categories
        </button>

        <a href="#products">Hot Deals</a>
        <a href="#products">Audio</a>
        <a href="#products">Smart Watches</a>
        <a href="#products">Power</a>
        <a href="#products">Personal Care</a>
      </nav>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </>
  );
}

export default Header;