import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { createProxyMiddleware } from "http-proxy-middleware";

dotenv.config();

const app = express();

app.use(cors());

// Proxy para o Event Service (Porta 3001)
app.use(
  "/api/events",
  createProxyMiddleware({
    target: process.env.EVENT_SERVICE_URL || "http://localhost:3001",
    changeOrigin: true,
    pathRewrite: (path, req) => "/api/events" + path,
  }),
);

app.use(
  "/api/users",
  createProxyMiddleware({
    target: process.env.USER_SERVICE_URL || "http://localhost:3002",
    changeOrigin: true,
    pathRewrite: (path, req) => "/api/users" + path,
  }),
);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});
