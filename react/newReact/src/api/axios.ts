// api/axios.ts
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_MY_API_URL,
});

// ----------------------
// REQUEST - הוספת טוקן
// ----------------------
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("authToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ----------------------
// RESPONSE - טיפול ב־401
// ----------------------
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // מודיע לאפליקציה לבצע logout
      window.dispatchEvent(new Event("logout"));
    }

    return Promise.reject(error);
  }
);

export default api;