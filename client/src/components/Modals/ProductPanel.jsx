import { useState, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import useCartStore from "../../store/useCartStore";
import useWishlistStore from "../../store/useWishlistStore";
import useAuthStore from "../../store/useAuthStore";

const SHAPES = {
  box: <boxGeometry args={[1.2, 1.2, 1.2]} />,
  sphere: <sphereGeometry args={[0.8, 32, 32]} />,
  cylinder: <cylinderGeometry args={[0.7, 0.7, 1.4, 32]} />,
  cone: <coneGeometry args={[0.8, 1.6, 32]} />,
  torus: <torusGeometry args={[0.7, 0.28, 24, 48]} />,
};

function ProductModel({ shape, color }) {
  return (
    <mesh castShadow>
      {SHAPES[shape] || SHAPES.box}
      <meshStandardMaterial color={color} metalness={0.5} roughness={0.3} />
    </mesh>
  );
}

export default function ProductPanel({ product, onClose }) {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated());
  const addItem = useCartStore((s) => s.addItem);
  const toggleWishlist = useWishlistStore((s) => s.toggleWishlist);
  const isWishlisted = useWishlistStore((s) => s.isWishlisted(product?._id));
  const [color, setColor] = useState(product?.colors?.[0] || "");
  const [size, setSize] = useState(product?.sizes?.[0] || "");
  const [qty, setQty] = useState(1);
  const [status, setStatus] = useState("");
  const controlsRef = useRef();

  if (!product) return null;

  const price = product.discountPrice || product.price;
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;

  const requireAuth = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return true;
    }
    return false;
  };

  const handleAddToCart = async () => {
    if (requireAuth()) return;
    await addItem(product._id, qty, color, size);
    setStatus("Added to cart");
    setTimeout(() => setStatus(""), 1800);
  };

  const handleBuyNow = async () => {
    if (requireAuth()) return;
    await addItem(product._id, qty, color, size);
    onClose();
    navigate("/cart");
  };

  const handleWishlist = async () => {
    if (requireAuth()) return;
    await toggleWishlist(product._id);
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="glass-strong rounded-t-3xl sm:rounded-3xl w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          transition={{ type: "spring", damping: 26, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-end p-3">
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-mall-muted hover:text-mall-text hover:bg-white/5"
              aria-label="Close product panel"
            >
              ✕
            </button>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 px-6 pb-6">
            <div className="h-64 sm:h-80 rounded-2xl bg-mall-panel2 relative">
              <Canvas shadows camera={{ position: [2.4, 1.6, 2.4], fov: 45 }}>
                <ambientLight intensity={0.6} />
                <directionalLight position={[4, 6, 4]} intensity={1} castShadow />
                <ProductModel shape={product.fallbackShape} color={product.store?.theme?.primaryColor || "#7c5cff"} />
                <OrbitControls ref={controlsRef} enablePan={false} minDistance={2} maxDistance={6} />
              </Canvas>
              <button
                onClick={() => controlsRef.current?.reset()}
                className="absolute bottom-3 right-3 text-[11px] glass rounded-full px-3 py-1.5 text-mall-text"
              >
                Reset view
              </button>
              <span className="absolute top-3 left-3 text-[10px] text-mall-muted">Drag to rotate · Scroll to zoom</span>
            </div>

            <div className="flex flex-col gap-3">
              <div>
                <p className="text-xs text-mall-muted">{product.brand}</p>
                <h2 className="font-display text-xl text-mall-text">{product.name}</h2>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="font-display text-2xl text-mall-text">₹{price?.toLocaleString("en-IN")}</span>
                {hasDiscount && (
                  <span className="text-sm text-mall-muted line-through">
                    ₹{product.price.toLocaleString("en-IN")}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 text-sm text-mall-muted">
                <span>★ {product.rating?.toFixed(1)}</span>
                <span>·</span>
                <span>{product.numReviews} reviews</span>
                <span>·</span>
                <span>{product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}</span>
              </div>

              <p className="text-sm text-mall-muted leading-relaxed">{product.description}</p>

              {product.colors?.length > 0 && (
                <div>
                  <p className="text-xs text-mall-muted mb-1">Color</p>
                  <div className="flex gap-2 flex-wrap">
                    {product.colors.map((c) => (
                      <button
                        key={c}
                        onClick={() => setColor(c)}
                        className={`text-xs px-3 py-1.5 rounded-full border ${
                          color === c ? "border-mall-glow text-mall-text" : "border-mall-border text-mall-muted"
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {product.sizes?.length > 0 && (
                <div>
                  <p className="text-xs text-mall-muted mb-1">Size</p>
                  <div className="flex gap-2 flex-wrap">
                    {product.sizes.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSize(s)}
                        className={`text-xs px-3 py-1.5 rounded-full border ${
                          size === s ? "border-mall-glow text-mall-text" : "border-mall-border text-mall-muted"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <div className="flex items-center border border-mall-border rounded-full">
                  <button className="w-8 h-8 text-mall-text" onClick={() => setQty((q) => Math.max(1, q - 1))}>
                    −
                  </button>
                  <span className="w-6 text-center text-sm text-mall-text">{qty}</span>
                  <button className="w-8 h-8 text-mall-text" onClick={() => setQty((q) => q + 1)}>
                    +
                  </button>
                </div>
                {status && <span className="text-xs text-mall-glow2">{status}</span>}
              </div>

              <div className="flex gap-2 mt-1">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex-1 rounded-full py-2.5 text-sm font-medium bg-white/10 text-mall-text border border-mall-border hover:border-mall-glow/50 disabled:opacity-40 transition-colors"
                >
                  Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={product.stock === 0}
                  className="flex-1 rounded-full py-2.5 text-sm font-medium bg-mall-glow text-white hover:bg-mall-glow/90 disabled:opacity-40 transition-colors"
                >
                  Buy Now
                </button>
                <button
                  onClick={handleWishlist}
                  className="w-11 h-11 rounded-full border border-mall-border flex items-center justify-center text-lg"
                  aria-label="Toggle wishlist"
                >
                  {isWishlisted ? "❤️" : "🤍"}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
