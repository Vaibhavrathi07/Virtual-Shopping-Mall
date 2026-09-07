import api from "./api";

export const fetchStats = () => api.get("/admin/stats").then((r) => r.data.data);
export const fetchUsers = () => api.get("/admin/users").then((r) => r.data.data);
export const fetchAllOrders = () => api.get("/orders").then((r) => r.data.data);
export const updateOrderStatusApi = (id, status) =>
  api.put(`/orders/${id}/status`, { status }).then((r) => r.data.data);
export const createProductApi = (payload) => api.post("/products", payload).then((r) => r.data.data);
export const updateProductApi = (id, payload) => api.put(`/products/${id}`, payload).then((r) => r.data.data);
export const deleteProductApi = (id) => api.delete(`/products/${id}`).then((r) => r.data.data);
export const createStoreApi = (payload) => api.post("/stores", payload).then((r) => r.data.data);
export const updateStoreApi = (id, payload) => api.put(`/stores/${id}`, payload).then((r) => r.data.data);
export const deleteStoreApi = (id) => api.delete(`/stores/${id}`).then((r) => r.data.data);
