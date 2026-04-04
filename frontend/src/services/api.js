import axios from "axios";

// Use environment variable for deployed backend, fallback to localhost for development
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8080/api";
export const BACKEND_BASE_URL = API_BASE_URL.replace(/\/api\/?$/, "");

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem("user");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

// Auth APIs
export const authAPI = {
  signup: (data) => api.post("/auth/signup", data),
  login: (data) => api.post("/auth/login", data),
  getOAuthProviders: () => api.get("/auth/oauth/providers"),
  getOAuthAuthorizationUrl: (provider) =>
    `${BACKEND_BASE_URL}/oauth2/authorization/${provider}`,
};

// Warranty APIs
export const warrantyAPI = {
  scanBill: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post("/warranties/scan", formData);
  },
  getAllWarranties: () => api.get("/warranties"),
  getActiveWarranties: () => api.get("/warranties/active"),
  getExpiredWarranties: () => api.get("/warranties/expired"),
  deleteWarranty: (id) => api.delete(`/warranties/${id}`),
  getCategoryStats: () => api.get("/warranties/categories"),
};

// User APIs
export const userAPI = {
  getSettings: () => api.get("/user/settings"),
  updateSettings: (data) => api.put("/user/settings", data),
};

export default api;
