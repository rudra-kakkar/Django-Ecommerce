import API from "./axiosClient";

export const getProducts = () => API.get("products/");
export const getProduct = (id) => API.get(`products/${id}/`);

