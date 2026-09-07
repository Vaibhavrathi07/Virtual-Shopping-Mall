import { Link } from "react-router-dom";

export default function ProductCard({ product, onQuickView }) {
  const price = product.discountPrice || product.price;
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;

  return (
    <div className="glass rounded-2xl p-4 flex flex-col gap-2 group hover:border-mall-glow/40 transition-colors">
      <div
        className="h-32 rounded-xl flex items-center justify-center text-3xl"
        style={{ background: `${product.store?.theme?.primaryColor || "#7c5cff"}22` }}
      >
        <span style={{ color: product.store?.theme?.primaryColor || "#7c5cff" }}>◆</span>
      </div>
      <p className="text-[11px] text-mall-muted">{product.brand}</p>
      <Link to={`/products/${product._id}`} className="text-sm text-mall-text hover:underline line-clamp-1">
        {product.name}
      </Link>
      <div className="flex items-baseline gap-2">
        <span className="text-sm font-medium text-mall-text">₹{price?.toLocaleString("en-IN")}</span>
        {hasDiscount && (
          <span className="text-xs text-mall-muted line-through">
            ₹{product.price.toLocaleString("en-IN")}
          </span>
        )}
      </div>
      <div className="flex items-center justify-between text-xs text-mall-muted">
        <span>★ {product.rating?.toFixed(1)}</span>
        <span>{product.store?.name}</span>
      </div>
      {onQuickView && (
        <button
          onClick={() => onQuickView(product)}
          className="mt-1 text-xs rounded-full border border-mall-border py-1.5 text-mall-muted group-hover:text-mall-text group-hover:border-mall-glow/50 transition-colors"
        >
          Quick view
        </button>
      )}
    </div>
  );
}
