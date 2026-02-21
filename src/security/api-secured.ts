import axios from "axios";
import { clearAuthSession } from "@/lib/auth-storage";

// ✅ Secured instance with token for authenticated requests
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Public instance without token for public requests (login, signup, forgot password)
export const axiosPublicInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Request Interceptor — attach token automatically to secured requests only
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response Interceptor — handle global errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle expired/invalid token
      clearAuthSession();
      window.location.href = "/login"; // or use navigate("/login")
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
