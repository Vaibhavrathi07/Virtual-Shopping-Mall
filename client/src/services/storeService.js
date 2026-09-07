import api from "./api";

export const fetchStores = () => api.get("/stores").then((r) => r.data.data);
export const fetchStoreById = (id) => api.get(`/stores/${id}`).then((r) => r.data.data);
