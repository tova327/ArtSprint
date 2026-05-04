// api/axios.ts
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_MY_API_URL,
});

// ----------------------
// מצב refresh
// ----------------------
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((p) => {
    error ? p.reject(error) : p.resolve(token);
  });
  failedQueue = [];
};

// ----------------------
// REQUEST
// ----------------------
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("authToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ----------------------
// RESPONSE
// ----------------------
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    // מניעת לולאה
    if (originalRequest._retry) {
      window.dispatchEvent(new Event("logout"));
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (token: string) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          },
          reject,
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const refreshToken = sessionStorage.getItem("refreshToken");

      const res = await axios.post(
        `${import.meta.env.VITE_MY_API_URL}auth/refresh`,
        { token: refreshToken }
      );

      const newToken = res.data.token;

      sessionStorage.setItem("authToken", newToken);

      processQueue(null, newToken);

      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return api(originalRequest);

    } catch (err) {
      processQueue(err, null);
      window.dispatchEvent(new Event("logout"));
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;
