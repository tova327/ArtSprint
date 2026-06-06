// src/api/axiosClient.ts
import axios from "axios";

export const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_MY_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    
  }
});



axiosClient.interceptors.response.use(
  (res) => res,
  (err) => {
    return Promise.reject(err?.response?.data || "Server error");
  }
);