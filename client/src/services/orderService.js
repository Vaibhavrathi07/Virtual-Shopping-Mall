import api from "./api";

export const placeOrder = (shippingAddress) =>
  api.post("/orders", { shippingAddress }).then((r) => r.data.data);
export const fetchMyOrders = () => api.get("/orders/my").then((r) => r.data.data);
