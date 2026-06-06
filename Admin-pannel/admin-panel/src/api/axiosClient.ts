// src/api/axiosClient.ts
import axios from "axios";

export const axiosClient = axios.create({
  baseURL: "https://artsprintserver.onrender.com/api",
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