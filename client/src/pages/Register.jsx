import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import useAuthStore from "../store/useAuthStore";

export default function Register() {
  const register = useAuthStore((s) => s.register);
  const error = useAuthStore((s) => s.error);
  const loading = useAuthStore((s) => s.loading);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(name, email, password);
      navigate("/");
    } catch {
      /* error already in store */
    }
  };

  return (
    <div className="min-h-screen bg-mall-void" style={{ overflow: "auto" }}>
      <Navbar />
      <div className="max-w-sm mx-auto px-4 py-16">
        <h1 className="font-display text-2xl text-mall-text mb-1">Create your account</h1>
        <p className="text-sm text-mall-muted mb-6">Join to save carts, wishlists, and orders.</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 glass rounded-2xl p-5">
          <input
            required
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-mall-panel2 border border-mall-border rounded-xl px-3 py-2 text-sm text-mall-text placeholder:text-mall-muted"
          />
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-mall-panel2 border border-mall-border rounded-xl px-3 py-2 text-sm text-mall-text placeholder:text-mall-muted"
          />
          <input
            type="password"
            required
            minLength={6}
            placeholder="Password (min 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-mall-panel2 border border-mall-border rounded-xl px-3 py-2 text-sm text-mall-text placeholder:text-mall-muted"
          />
          {error && <p className="text-xs text-red-400">{error}</p>}
          <button
            disabled={loading}
            className="rounded-full bg-mall-glow text-white py-2.5 text-sm font-medium disabled:opacity-50"
          >
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>
        <p className="text-xs text-mall-muted mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-mall-glow2 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
