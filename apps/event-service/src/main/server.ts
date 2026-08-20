import dotenv from "dotenv";
import express from 'express';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';


dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// Healthcheck
app.get('/health', (_req, res) => {
  return res.status(200).json({ status: 'API Gateway running' });
});

// Redirecionamento transparente das requisições de /api/events para o event-service (3001)
app.use(
  '/api/events',
  createProxyMiddleware({
    target: process.env.EVENT_SERVICE_URL || 'http://localhost:3001',
    changeOrigin: true,
  })
);

app.listen(PORT, () => {
  console.log(`API Gateway running on http://localhost:${PORT}`);
});