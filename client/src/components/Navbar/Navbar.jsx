import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import useAuthStore from "../../store/useAuthStore";
import useCartStore from "../../store/useCartStore";
import SearchBar from "../UI/SearchBar";

export default function Navbar() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const itemCount = useCartStore((s) => s.itemCount());
  const navigate = useNavigate();

  return (
    <>
      <nav className="sticky top-0 z-30 glass border-b border-mall-border">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="font-display text-lg text-mall-text tracking-tight">
            Virtual Mall
          </Link>

          <div className="hidden md:flex items-center gap-6 text-sm text-mall-muted">
            <Link to="/mall" className="hover:text-mall-text transition-colors">Enter 3D Mall</Link>
            <Link to="/products" className="hover:text-mall-text transition-colors">Shop Products</Link>
            <Link to="/wishlist" className="hover:text-mall-text transition-colors">Wishlist</Link>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setSearchOpen(true)}
              className="text-mall-muted hover:text-mall-text text-sm"
              aria-label="Search"
            >
              Search
            </button>
            <Link to="/cart" className="relative text-mall-muted hover:text-mall-text text-sm">
              Cart
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-mall-glow text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setMenuOpen((o) => !o)}
                  className="text-sm text-mall-text glass rounded-full px-3 py-1.5"
                >
                  {user.name.split(" ")[0]}
                </button>
                <AnimatePresence>
                  {menuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      className="absolute right-0 mt-2 w-40 glass-strong rounded-xl p-2 text-sm"
                    >
                      {user.role === "admin" && (
                        <Link
                          to="/admin"
                          className="block px-3 py-2 rounded-lg hover:bg-white/5 text-mall-text"
                          onClick={() => setMenuOpen(false)}
                        >
                          Admin Dashboard
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          logout();
                          setMenuOpen(false);
                          navigate("/");
                        }}
                        className="block w-full text-left px-3 py-2 rounded-lg hover:bg-white/5 text-mall-muted"
                      >
                        Log out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                to="/login"
                className="text-sm rounded-full px-4 py-1.5 bg-mall-glow text-white hover:bg-mall-glow/90 transition-colors"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/60"
            onClick={() => setSearchOpen(false)}
          >
            <div onClick={(e) => e.stopPropagation()}>
              <SearchBar onClose={() => setSearchOpen(false)} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
