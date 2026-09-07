import api from "./api";

export const fetchCart = () => api.get("/cart").then((r) => r.data.data);
export const addToCartApi = (payload) => api.post("/cart", payload).then((r) => r.data.data);
export const updateCartItemApi = (productId, quantity) =>
  api.put(`/cart/${productId}`, { quantity }).then((r) => r.data.data);
export const removeCartItemApi = (productId) =>
  api.delete(`/cart/${productId}`).then((r) => r.data.data);
