import axios from "axios";

// Usa a variável de ambiente ou fallback para o Gateway no Render
const API_URL =
  import.meta.env.VITE_API_GATEWAY_URL ||
  "https://eventpulse-api-gateway.onrender.com";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para injetar o Token JWT automaticamente em cada requisição
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("@EventPulse:token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
