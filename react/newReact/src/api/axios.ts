import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_MY_API_URL,
});

// ----------------------
// 🧠 מצב פנימי לניהול refresh
// ----------------------
let isRefreshing = false;
let failedQueue: any[] = [];

// עוזר לשחרר בקשות ממתינות
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// ----------------------
// 📤 REQUEST INTERCEPTOR
// ----------------------
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("authToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ----------------------
// 📥 RESPONSE INTERCEPTOR
// ----------------------
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // אם לא 401 → פשוט זורקים
    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    // אם כבר ניסינו פעם אחת → לא להיכנס ללולאה
    if (originalRequest._retry) {
      sessionStorage.removeItem("authToken");
      window.location.href = "/login";
      return Promise.reject(error);
    }

    // אם כבר יש refresh בתהליך → מחכים
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (token: string) => {
            originalRequest.headers.Authorization = "Bearer " + token;
            resolve(api(originalRequest));
          },
          reject: (err: any) => reject(err),
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const refreshToken = sessionStorage.getItem("refreshToken");

      // בקשת refresh
      const res = await axios.post(
        `${import.meta.env.VITE_MY_API_URL}auth/refresh`,
        { token: refreshToken }
      );

      const newAccessToken = res.data.token;

      // שמירה
      sessionStorage.setItem("authToken", newAccessToken);

      // עדכון header גלובלי
      api.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;

      processQueue(null, newAccessToken);

      // הרצת הבקשה המקורית מחדש
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return api(originalRequest);

    } catch (err) {
      processQueue(err, null);

      sessionStorage.removeItem("authToken");
      sessionStorage.removeItem("refreshToken");

      window.location.href = "/login";

      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;
