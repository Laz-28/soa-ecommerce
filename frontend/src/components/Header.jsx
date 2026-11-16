import {
  Search,
  ShoppingCart,
  UserRound,
  Menu
} from "lucide-react";

function Header({ cartCount }) {
  return (
    <>
      <div className="promotion-bar">
        <p>Free delivery on orders above KSh 3,000</p>
        <span>Class Demo Store</span>
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
          <button className="icon-button" type="button">
            <UserRound size={22} />
            <span>Login</span>
          </button>

          <button className="cart-button" type="button">
            <ShoppingCart size={22} />
            <span>Cart</span>

            {cartCount > 0 && (
              <strong className="cart-count">{cartCount}</strong>
            )}
          </button>
        </nav>
      </header>

      <nav className="category-navigation">
        <button className="mobile-menu-button" type="button">
          <Menu size={20} />
          Categories
        </button>

        <a href="#products">Hot Deals</a>
        <a href="#products">Audio</a>
        <a href="#products">Smart Watches</a>
        <a href="#products">Power</a>
        <a href="#products">Personal Care</a>
        <a href="#products">Accessories</a>
      </nav>
    </>
  );
}

export default Header;