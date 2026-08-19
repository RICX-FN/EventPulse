import { Router } from "express";
import prisma from "../../database//prisma";
import { PrismaEventRepository } from "../../database/repositories/prisma-event-repository";
import { CreateEventUseCase } from "../../../use-cases/create-event";
import { CreateEventController } from "../controllers/create-event-controller";

const eventRoutes = Router();

// Injeção de Dependências manual (Composition Root local)
const eventRepository = new PrismaEventRepository(prisma);
const createEventUseCase = new CreateEventUseCase(eventRepository);
const createEventController = new CreateEventController(createEventUseCase);

eventRoutes.post("/events", (req, res) =>
  createEventController.handle(req, res),
);

export { eventRoutes };
