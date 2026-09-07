import { create } from "zustand";
import * as wishlistService from "../services/wishlistService";

const useWishlistStore = create((set, get) => ({
  products: [],
  loading: false,

  loadWishlist: async () => {
    set({ loading: true });
    try {
      const wishlist = await wishlistService.fetchWishlist();
      set({ products: wishlist.products || [], loading: false });
    } catch {
      set({ loading: false });
    }
  },

  toggleWishlist: async (productId) => {
    const exists = get().products.some((p) => p._id === productId);
    if (exists) {
      const wishlist = await wishlistService.removeFromWishlistApi(productId);
      set({ products: wishlist.products || [] });
    } else {
      const wishlist = await wishlistService.addToWishlistApi(productId);
      set({ products: wishlist.products || [] });
    }
  },

  isWishlisted: (productId) => get().products.some((p) => p._id === productId),
}));

export default useWishlistStore;
