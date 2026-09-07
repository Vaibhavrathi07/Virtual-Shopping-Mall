import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import ProductCard from "../components/Products/ProductCard";
import ProductPanel from "../components/Modals/ProductPanel";
import * as storeService from "../services/storeService";

export default function Store() {
  const { id } = useParams();
  const [store, setStore] = useState(null);
  const [quickView, setQuickView] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    storeService
      .fetchStoreById(id)
      .then(setStore)
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="min-h-screen bg-mall-void" style={{ overflow: "auto" }}>
      <Navbar />
      {loading && <p className="text-center text-mall-muted py-20">Loading store…</p>}
      {!loading && !store && <p className="text-center text-mall-muted py-20">Store not found.</p>}
      {store && (
        <>
          <section
            className="px-4 py-14 text-center"
            style={{
              background: `linear-gradient(180deg, ${store.theme?.primaryColor}22, transparent)`,
            }}
          >
            <p className="text-xs text-mall-muted">Floor {store.floor}</p>
            <h1 className="font-display text-3xl text-mall-text mt-1">{store.name}</h1>
            <p className="text-mall-muted mt-2 max-w-md mx-auto">{store.description}</p>
            <Link
              to={`/mall?store=${store._id}`}
              className="inline-block mt-5 rounded-full px-5 py-2.5 text-sm font-medium text-white"
              style={{ background: store.theme?.primaryColor }}
            >
              Walk to this store in 3D
            </Link>
          </section>
          <section className="max-w-6xl mx-auto px-4 pb-20">
            <h2 className="font-display text-lg text-mall-text mb-4">
              Products ({store.products?.length || 0})
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {store.products?.map((p) => (
                <ProductCard key={p._id} product={{ ...p, store }} onQuickView={setQuickView} />
              ))}
            </div>
          </section>
        </>
      )}
      {quickView && (
        <ProductPanel product={{ ...quickView, store }} onClose={() => setQuickView(null)} />
      )}
    </div>
  );
}
