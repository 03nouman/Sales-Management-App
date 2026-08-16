import axios from "axios";

const apiClient = axios.create({
  baseURL: "/api",
  timeout: 8000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const stored = localStorage.getItem("salesflow-auth");

  if (stored) {
    try {
      const auth = JSON.parse(stored) as { token?: string };
      if (auth.token) {
        config.headers.Authorization = `Bearer ${auth.token}`;
      }
    } catch {
      // ignore malformed storage
    }
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("salesflow-auth");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

export default apiClient;
