import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import useAuthStore from "../store/useAuthStore";
import * as adminService from "../services/adminService";
import * as productService from "../services/productService";
import * as storeService from "../services/storeService";

const TABS = ["Overview", "Products", "Stores", "Orders", "Users"];

function StatCard({ label, value }) {
  return (
    <div className="glass rounded-2xl p-4">
      <p className="text-xs text-mall-muted">{label}</p>
      <p className="font-display text-2xl text-mall-text mt-1">{value}</p>
    </div>
  );
}

export default function Admin() {
  const user = useAuthStore((s) => s.user);
  const [tab, setTab] = useState("Overview");
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [stores, setStores] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: "", price: "", brand: "", store: "", category: "" });

  const refreshAll = () => {
    adminService.fetchStats().then(setStats).catch(() => {});
    productService.fetchProducts({ limit: 100 }).then((r) => setProducts(r.data)).catch(() => {});
    storeService.fetchStores().then(setStores).catch(() => {});
    adminService.fetchAllOrders().then(setOrders).catch(() => {});
    adminService.fetchUsers().then(setUsers).catch(() => {});
  };

  useEffect(() => {
    if (user?.role === "admin") refreshAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "admin") return <Navigate to="/" replace />;

  const handleDeleteProduct = async (id) => {
    await adminService.deleteProductApi(id);
    refreshAll();
  };

  const handleDeleteStore = async (id) => {
    await adminService.deleteStoreApi(id);
    refreshAll();
  };

  const handleStatusChange = async (orderId, status) => {
    await adminService.updateOrderStatusApi(orderId, status);
    refreshAll();
  };

  return (
    <div className="min-h-screen bg-mall-void" style={{ overflow: "auto" }}>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="font-display text-2xl text-mall-text mb-6">Admin Dashboard</h1>

        <div className="flex gap-2 mb-6 overflow-x-auto">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
                tab === t ? "bg-mall-glow text-white" : "glass text-mall-muted"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === "Overview" && stats && (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <StatCard label="Products" value={stats.totalProducts} />
            <StatCard label="Stores" value={stats.totalStores} />
            <StatCard label="Users" value={stats.totalUsers} />
            <StatCard label="Orders" value={stats.totalOrders} />
            <StatCard label="Revenue" value={`₹${stats.revenue.toLocaleString("en-IN")}`} />
          </div>
        )}

        {tab === "Products" && (
          <div>
            <div className="glass rounded-2xl p-4 mb-4 grid sm:grid-cols-5 gap-2">
              <input
                placeholder="Name"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                className="bg-mall-panel2 border border-mall-border rounded-lg px-3 py-2 text-sm text-mall-text"
              />
              <input
                placeholder="Price"
                type="number"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                className="bg-mall-panel2 border border-mall-border rounded-lg px-3 py-2 text-sm text-mall-text"
              />
              <input
                placeholder="Brand"
                value={newProduct.brand}
                onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                className="bg-mall-panel2 border border-mall-border rounded-lg px-3 py-2 text-sm text-mall-text"
              />
              <select
                value={newProduct.store}
                onChange={(e) => setNewProduct({ ...newProduct, store: e.target.value })}
                className="bg-mall-panel2 border border-mall-border rounded-lg px-3 py-2 text-sm text-mall-text"
              >
                <option value="">Store…</option>
                {stores.map((s) => (
                  <option key={s._id} value={s._id}>{s.name}</option>
                ))}
              </select>
              <button
                onClick={async () => {
                  if (!newProduct.name || !newProduct.price || !newProduct.store) return;
                  await adminService.createProductApi({
                    ...newProduct,
                    price: Number(newProduct.price),
                    category: products[0]?.category?._id, // reuse an existing category for the demo
                  });
                  setNewProduct({ name: "", price: "", brand: "", store: "", category: "" });
                  refreshAll();
                }}
                className="rounded-lg bg-mall-glow text-white text-sm px-3 py-2"
              >
                Add Product
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {products.map((p) => (
                <div key={p._id} className="glass rounded-xl p-3 flex items-center justify-between text-sm">
                  <span className="text-mall-text">{p.name}</span>
                  <span className="text-mall-muted">₹{p.price} · {p.store?.name}</span>
                  <button onClick={() => handleDeleteProduct(p._id)} className="text-red-400 text-xs">
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "Stores" && (
          <div className="flex flex-col gap-2">
            {stores.map((s) => (
              <div key={s._id} className="glass rounded-xl p-3 flex items-center justify-between text-sm">
                <span className="text-mall-text">{s.name}</span>
                <span className="text-mall-muted">Floor {s.floor}</span>
                <button onClick={() => handleDeleteStore(s._id)} className="text-red-400 text-xs">
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}

        {tab === "Orders" && (
          <div className="flex flex-col gap-2">
            {orders.map((o) => (
              <div key={o._id} className="glass rounded-xl p-3 flex items-center justify-between text-sm gap-2">
                <span className="text-mall-text">{o.user?.name}</span>
                <span className="text-mall-muted">₹{o.totalAmount.toLocaleString("en-IN")}</span>
                <select
                  value={o.status}
                  onChange={(e) => handleStatusChange(o._id, e.target.value)}
                  className="bg-mall-panel2 border border-mall-border rounded-lg px-2 py-1 text-xs text-mall-text"
                >
                  {["pending", "processing", "shipped", "delivered", "cancelled"].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        )}

        {tab === "Users" && (
          <div className="flex flex-col gap-2">
            {users.map((u) => (
              <div key={u._id} className="glass rounded-xl p-3 flex items-center justify-between text-sm">
                <span className="text-mall-text">{u.name}</span>
                <span className="text-mall-muted">{u.email}</span>
                <span className="text-mall-muted">{u.role}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
