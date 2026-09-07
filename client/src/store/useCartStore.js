import { create } from "zustand";
import * as cartService from "../services/cartService";

const useCartStore = create((set, get) => ({
  items: [],
  loading: false,
  isOpen: false,

  toggleCart: (open) => set((s) => ({ isOpen: open ?? !s.isOpen })),

  loadCart: async () => {
    set({ loading: true });
    try {
      const cart = await cartService.fetchCart();
      set({ items: cart.items || [], loading: false });
    } catch {
      set({ loading: false });
    }
  },

  addItem: async (productId, quantity = 1, color = "", size = "") => {
    const cart = await cartService.addToCartApi({ productId, quantity, color, size });
    set({ items: cart.items || [] });
  },

  updateQuantity: async (productId, quantity) => {
    const cart = await cartService.updateCartItemApi(productId, quantity);
    set({ items: cart.items || [] });
  },

  removeItem: async (productId) => {
    const cart = await cartService.removeCartItemApi(productId);
    set({ items: cart.items || [] });
  },

  clearLocal: () => set({ items: [] }),

  subtotal: () =>
    get().items.reduce((sum, i) => {
      const price = i.product?.discountPrice || i.product?.price || 0;
      return sum + price * i.quantity;
    }, 0),

  itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
}));

export default useCartStore;
