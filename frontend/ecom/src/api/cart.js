import API from "./axiosClient";

export const getCart = () => API.get("cart/");
export const addToCart = (data) => API.post("cart/add/", data);
export const updateCartItem = (id, quantity) =>
  API.patch(`cart/update/${id}/`, { quantity });
export const removeCartItem = (id) =>
  API.delete(`cart/remove/${id}/`);
