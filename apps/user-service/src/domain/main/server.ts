import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import path from "node:path";
import { userRoutes } from "../../../infrastructure/http/routes/user.routes";

dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", userRoutes);

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log(`User Service running on port ${PORT}`);
});
