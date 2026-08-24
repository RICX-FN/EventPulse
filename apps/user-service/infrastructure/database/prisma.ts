import dotenv from "dotenv";
import path from "node:path";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../src/generated/prisma/client";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

export default prisma;
