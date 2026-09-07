import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import * as productService from "../../services/productService";
import useDebounce from "../../hooks/useDebounce";

export default function SearchBar({ onClose }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const debounced = useDebounce(query, 350);
  const navigate = useNavigate();
  const inputRef = useRef();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!debounced.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    productService
      .fetchProducts({ search: debounced, limit: 6 })
      .then((res) => setResults(res.data))
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, [debounced]);

  const goToProduct = (product) => {
    navigate(`/products/${product._id}`);
    onClose?.();
  };

  const goToStore = (product) => {
    navigate(`/mall?product=${product._id}`);
    onClose?.();
  };

  return (
    <div className="glass-strong rounded-2xl p-3 w-full max-w-lg">
      <input
        ref={inputRef}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products, brands, stores…"
        className="w-full bg-transparent border-b border-mall-border pb-2 text-sm text-mall-text placeholder:text-mall-muted focus:outline-none"
      />
      <div className="mt-2 max-h-72 overflow-y-auto">
        {loading && <p className="text-xs text-mall-muted p-2">Searching…</p>}
        {!loading && debounced && results.length === 0 && (
          <p className="text-xs text-mall-muted p-2">No products match “{debounced}”.</p>
        )}
        {results.map((product) => (
          <div
            key={product._id}
            className="flex items-center justify-between gap-2 p-2 rounded-lg hover:bg-white/5"
          >
            <button className="text-left flex-1" onClick={() => goToProduct(product)}>
              <p className="text-sm text-mall-text">{product.name}</p>
              <p className="text-xs text-mall-muted">
                {product.store?.name} · ₹{(product.discountPrice || product.price).toLocaleString("en-IN")}
              </p>
            </button>
            <button
              onClick={() => goToStore(product)}
              className="text-[11px] px-2.5 py-1 rounded-full border border-mall-border text-mall-muted hover:text-mall-text hover:border-mall-glow/50"
            >
              Take me to store
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
