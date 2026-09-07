import api from "./api";

export const fetchProducts = (params) => api.get("/products", { params }).then((r) => r.data);
export const fetchProductById = (id) => api.get(`/products/${id}`).then((r) => r.data.data);
