import API from "./axiosClient";

export const loginUser = (data) => API.post("users/login/", data);
export const registerUser = (data) => API.post("users/register/", data);
export const refreshToken = (refresh) => API.post("users/refresh/", { refresh });
