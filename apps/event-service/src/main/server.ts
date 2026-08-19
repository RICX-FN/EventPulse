import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { eventRoutes } from "../infrastructure/http/routes/event-routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Registrando rotas
app.use("/api", eventRoutes);

app.listen(PORT, () => {
  console.log(`Event Service running on http://localhost:${PORT}`);
});
