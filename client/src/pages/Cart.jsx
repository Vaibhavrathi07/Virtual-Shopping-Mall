import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import useCartStore from "../store/useCartStore";
import useAuthStore from "../store/useAuthStore";
import * as orderService from "../services/orderService";

export default function Cart() {
  const items = useCartStore((s) => s.items);
  const loadCart = useCartStore((s) => s.loadCart);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const clearLocal = useCartStore((s) => s.clearLocal);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated());
  const navigate = useNavigate();

  const [step, setStep] = useState("cart"); // cart | shipping | confirmed
  const [address, setAddress] = useState({
    fullName: "",
    line1: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    phone: "",
  });
  const [order, setOrder] = useState(null);
  const [placing, setPlacing] = useState(false);

  useEffect(() => {
    if (isAuthenticated) loadCart();
  }, [isAuthenticated, loadCart]);

  const subtotal = items.reduce((sum, i) => {
    const price = i.product?.discountPrice || i.product?.price || 0;
    return sum + price * i.quantity;
  }, 0);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setPlacing(true);
    try {
      const created = await orderService.placeOrder(address);
      setOrder(created);
      clearLocal();
      setStep("confirmed");
    } finally {
      setPlacing(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-mall-void" style={{ overflow: "auto" }}>
        <Navbar />
        <div className="max-w-md mx-auto text-center py-24">
          <p className="text-mall-muted mb-4">Log in to view your cart.</p>
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
      <div className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="font-display text-2xl text-mall-text mb-6">
          {step === "cart" && "Your Cart"}
          {step === "shipping" && "Shipping Information"}
          {step === "confirmed" && "Order Confirmed"}
        </h1>

        {step === "cart" && (
          <>
            {items.length === 0 ? (
              <p className="text-mall-muted">Your cart is empty. Go find something you like!</p>
            ) : (
              <div className="flex flex-col gap-3">
                {items.map((item) => (
                  <div key={item.product._id} className="glass rounded-2xl p-4 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-mall-text">{item.product.name}</p>
                      <p className="text-xs text-mall-muted">
                        {item.color && `${item.color} · `}
                        {item.size && `${item.size} · `}
                        ₹{(item.product.discountPrice || item.product.price).toLocaleString("en-IN")}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center border border-mall-border rounded-full">
                        <button
                          className="w-7 h-7 text-mall-text"
                          onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                        >
                          −
                        </button>
                        <span className="w-6 text-center text-sm text-mall-text">{item.quantity}</span>
                        <button
                          className="w-7 h-7 text-mall-text"
                          onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.product._id)}
                        className="text-xs text-mall-muted hover:text-red-400"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-mall-border">
                  <span className="text-mall-muted text-sm">Subtotal</span>
                  <span className="font-display text-xl text-mall-text">₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                <button
                  onClick={() => setStep("shipping")}
                  className="mt-4 rounded-full bg-mall-glow text-white py-3 text-sm font-medium"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </>
        )}

        {step === "shipping" && (
          <form onSubmit={handlePlaceOrder} className="flex flex-col gap-3 glass rounded-2xl p-5">
            {[
              ["fullName", "Full name"],
              ["line1", "Address"],
              ["city", "City"],
              ["state", "State"],
              ["postalCode", "Postal code"],
              ["phone", "Phone"],
            ].map(([key, label]) => (
              <input
                key={key}
                required
                placeholder={label}
                value={address[key]}
                onChange={(e) => setAddress({ ...address, [key]: e.target.value })}
                className="bg-mall-panel2 border border-mall-border rounded-xl px-3 py-2 text-sm text-mall-text placeholder:text-mall-muted"
              />
            ))}
            <div className="flex justify-between items-center pt-2">
              <span className="text-mall-muted text-sm">Total</span>
              <span className="font-display text-lg text-mall-text">₹{subtotal.toLocaleString("en-IN")}</span>
            </div>
            <button
              disabled={placing}
              className="rounded-full bg-mall-glow text-white py-3 text-sm font-medium disabled:opacity-50"
            >
              {placing ? "Placing order…" : "Place Order"}
            </button>
          </form>
        )}

        {step === "confirmed" && order && (
          <div className="glass rounded-2xl p-6 text-center">
            <p className="text-mall-glow2 text-sm mb-2">Order placed successfully</p>
            <p className="text-mall-muted text-xs mb-4">Order ID: {order._id}</p>
            <p className="font-display text-2xl text-mall-text mb-4">
              ₹{order.totalAmount.toLocaleString("en-IN")}
            </p>
            <button
              onClick={() => navigate("/products")}
              className="rounded-full bg-mall-glow text-white px-5 py-2 text-sm"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
