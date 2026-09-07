import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import ProductCard from "../components/Products/ProductCard";
import useWishlistStore from "../store/useWishlistStore";
import useAuthStore from "../store/useAuthStore";

export default function Wishlist() {
  const products = useWishlistStore((s) => s.products);
  const loadWishlist = useWishlistStore((s) => s.loadWishlist);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated());
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) loadWishlist();
  }, [isAuthenticated, loadWishlist]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-mall-void" style={{ overflow: "auto" }}>
        <Navbar />
        <div className="max-w-md mx-auto text-center py-24">
          <p className="text-mall-muted mb-4">Log in to view your wishlist.</p>
          <button onClick={() => navigate("/login")} className="rounded-full bg-mall-glow text-white px-5 py-2 text-sm">
            Log in
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mall-void" style={{ overflow: "auto" }}>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="font-display text-2xl text-mall-text mb-6">Your Wishlist</h1>
        {products.length === 0 ? (
          <p className="text-mall-muted">Nothing saved yet — tap the heart on any product.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
