import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import ProductCard from "../components/Products/ProductCard";
import ProductPanel from "../components/Modals/ProductPanel";
import * as productService from "../services/productService";
import * as storeService from "../services/storeService";
import useDebounce from "../hooks/useDebounce";

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quickView, setQuickView] = useState(null);

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [store, setStore] = useState(searchParams.get("store") || "");
  const [sort, setSort] = useState(searchParams.get("sort") || "newest");
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);

  const debouncedSearch = useDebounce(search, 350);

  useEffect(() => {
    storeService.fetchStores().then(setStores).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = { search: debouncedSearch || undefined, store: store || undefined, sort, page, limit: 12 };
    setSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== 1))
    );
    productService
      .fetchProducts(params)
      .then((res) => {
        setProducts(res.data);
        setPagination(res.pagination);
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, store, sort, page]);

  return (
    <div className="min-h-screen bg-mall-void" style={{ overflow: "auto" }}>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="font-display text-2xl text-mall-text mb-6">Shop Products</h1>

        <div className="flex flex-wrap gap-3 mb-6">
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search products…"
            className="glass rounded-full px-4 py-2 text-sm text-mall-text placeholder:text-mall-muted flex-1 min-w-[200px]"
          />
          <select
            value={store}
            onChange={(e) => {
              setStore(e.target.value);
              setPage(1);
            }}
            className="glass rounded-full px-4 py-2 text-sm text-mall-text bg-transparent"
          >
            <option value="" className="bg-mall-panel">All stores</option>
            {stores.map((s) => (
              <option key={s._id} value={s._id} className="bg-mall-panel">
                {s.name}
              </option>
            ))}
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="glass rounded-full px-4 py-2 text-sm text-mall-text bg-transparent"
          >
            <option value="newest" className="bg-mall-panel">Newest</option>
            <option value="price_asc" className="bg-mall-panel">Price: Low to High</option>
            <option value="price_desc" className="bg-mall-panel">Price: High to Low</option>
            <option value="rating" className="bg-mall-panel">Top Rated</option>
          </select>
        </div>

        {loading && <p className="text-mall-muted">Loading products…</p>}
        {!loading && products.length === 0 && (
          <p className="text-mall-muted">No products match your filters.</p>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} onQuickView={setQuickView} />
          ))}
        </div>

        {pagination.pages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-8 h-8 rounded-full text-sm ${
                  p === page ? "bg-mall-glow text-white" : "text-mall-muted hover:text-mall-text"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>
      {quickView && <ProductPanel product={quickView} onClose={() => setQuickView(null)} />}
    </div>
  );
}
