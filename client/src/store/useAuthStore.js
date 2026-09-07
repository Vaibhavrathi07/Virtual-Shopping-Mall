import { create } from "zustand";
import * as authService from "../services/authService";

const useAuthStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem("mall_user") || "null"),
  loading: false,
  error: null,

  isAuthenticated: () => !!get().user,
  isAdmin: () => get().user?.role === "admin",

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const data = await authService.login({ email, password });
      localStorage.setItem("mall_token", data.token);
      localStorage.setItem("mall_user", JSON.stringify(data));
      set({ user: data, loading: false });
      return data;
    } catch (err) {
      set({ error: err.response?.data?.message || "Login failed", loading: false });
      throw err;
    }
  },

  register: async (name, email, password) => {
    set({ loading: true, error: null });
    try {
      const data = await authService.register({ name, email, password });
      localStorage.setItem("mall_token", data.token);
      localStorage.setItem("mall_user", JSON.stringify(data));
      set({ user: data, loading: false });
      return data;
    } catch (err) {
      set({ error: err.response?.data?.message || "Registration failed", loading: false });
      throw err;
    }
  },

  logout: () => {
    localStorage.removeItem("mall_token");
    localStorage.removeItem("mall_user");
    set({ user: null });
  },
}));

export default useAuthStore;
