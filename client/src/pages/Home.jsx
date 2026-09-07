import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar/Navbar";
import ProductCard from "../components/Products/ProductCard";
import * as storeService from "../services/storeService";
import * as productService from "../services/productService";

export default function Home() {
  const [stores, setStores] = useState([]);
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    storeService.fetchStores().then(setStores).catch(() => {});
    productService
      .fetchProducts({ featured: true, limit: 8 })
      .then((res) => setFeatured(res.data))
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen overflow-y-auto bg-mall-void" style={{ overflow: "auto" }}>
      <Navbar />

      {/* Hero */}
      <section className="relative px-4 pt-20 pb-24 max-w-6xl mx-auto text-center overflow-hidden">
        <div
          className="absolute inset-0 -z-10 opacity-40"
          style={{
            background:
              "radial-gradient(circle at 50% 0%, rgba(124,92,255,0.25), transparent 55%), radial-gradient(circle at 80% 30%, rgba(34,211,238,0.18), transparent 50%)",
          }}
        />
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-display text-5xl sm:text-6xl text-mall-text tracking-tight"
        >
          Explore. Discover. Shop.
        </motion.h1>
        <p className="mt-4 text-mall-muted max-w-xl mx-auto">
          Step into a fully interactive 3D mall — walk the floors, browse real storefronts,
          and pick up products the way you would in person.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/mall"
            className="rounded-full bg-mall-glow text-white px-6 py-3 text-sm font-medium shadow-glow hover:bg-mall-glow/90 transition-colors"
          >
            Enter 3D Mall
          </Link>
          <Link
            to="/products"
            className="rounded-full glass px-6 py-3 text-sm font-medium text-mall-text hover:border-mall-glow/50 transition-colors"
          >
            Shop Products
          </Link>
        </div>
      </section>

      {/* Featured stores */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <h2 className="font-display text-xl text-mall-text mb-4">Stores in the mall</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {stores.map((store) => (
            <Link
              key={store._id}
              to={`/stores/${store._id}`}
              className="glass rounded-2xl p-4 flex flex-col items-center gap-2 text-center hover:border-mall-glow/40 transition-colors"
            >
              <span
                className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                style={{ background: `${store.theme?.primaryColor}33`, color: store.theme?.primaryColor }}
              >
                ◆
              </span>
              <span className="text-sm text-mall-text">{store.name}</span>
              <span className="text-[11px] text-mall-muted">Floor {store.floor}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured products */}
      {featured.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 pb-24">
          <h2 className="font-display text-xl text-mall-text mb-4">Featured products</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {featured.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
