import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import ProductPanel from "../components/Modals/ProductPanel";
import * as productService from "../services/productService";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    productService
      .fetchProductById(id)
      .then(setProduct)
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="min-h-screen bg-mall-void" style={{ overflow: "auto" }}>
      <Navbar />
      {loading && <p className="text-center text-mall-muted py-20">Loading product…</p>}
      {!loading && !product && <p className="text-center text-mall-muted py-20">Product not found.</p>}
      {product && (
        <div className="max-w-2xl mx-auto py-10 px-4">
          <Link to={`/stores/${product.store?._id}`} className="text-xs text-mall-muted hover:text-mall-text">
            ← Back to {product.store?.name}
          </Link>
          <div className="mt-6">
            <ProductPanel product={product} onClose={() => window.history.back()} />
          </div>
        </div>
      )}
    </div>
  );
}
