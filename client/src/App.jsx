import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Home from "./pages/Home";
import Mall from "./pages/Mall";
import Store from "./pages/Store";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Admin from "./pages/Admin";
import useAuthStore from "./store/useAuthStore";
import useCartStore from "./store/useCartStore";
import useWishlistStore from "./store/useWishlistStore";

export default function App() {
  const user = useAuthStore((s) => s.user);
  const loadCart = useCartStore((s) => s.loadCart);
  const loadWishlist = useWishlistStore((s) => s.loadWishlist);

  useEffect(() => {
    if (user) {
      loadCart();
      loadWishlist();
    }
  }, [user, loadCart, loadWishlist]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/mall" element={<Mall />} />
      <Route path="/stores/:id" element={<Store />} />
      <Route path="/products" element={<Products />} />
      <Route path="/products/:id" element={<ProductDetails />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/wishlist" element={<Wishlist />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  );
}
