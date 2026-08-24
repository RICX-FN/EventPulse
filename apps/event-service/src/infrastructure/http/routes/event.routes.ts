import { Router } from "express";
import { ensureAuthenticated } from "../middlewares/ensure-authenticated";
import prisma from "../../database/prisma";
import { PrismaEventRepository } from "../../database/repositories/prisma-event-repository";
import { CreateEventUseCase } from "../../../use-cases/create-event";
import { CreateEventController } from "../controllers/create-event.controller";
import { ListEventsUseCase } from "../../../use-cases/list-events-use-case";
import { ListEventsController } from "../controllers/list-events.controller";
import { GetEventByIdUseCase } from "../../../use-cases/get-event-by-id";
import { GetEventByIdController } from "../controllers/get-event-by-id.controller";
import { CancelEventUseCase } from "../../../use-cases/cancel-event";
import { CancelEventController } from "../controllers/cancel-event.controller";
import { PublishEventUseCase } from "../../../use-cases/publish-event";
import { PublishEventController } from "../controllers/publish-event.controller";
import { UpdateEventUseCase } from "../../../use-cases/update-event";
import { UpdateEventController } from "../controllers/update-event.controller";

const eventRoutes = Router();

const eventRepository = new PrismaEventRepository(prisma);

// Instâncias dos Casos de Uso e Controllers
const createEventUseCase = new CreateEventUseCase(eventRepository);
const createEventController = new CreateEventController(createEventUseCase);

const listEventsUseCase = new ListEventsUseCase(eventRepository);
const listEventsController = new ListEventsController(listEventsUseCase);

const getEventByIdUseCase = new GetEventByIdUseCase(eventRepository);
const getEventByIdController = new GetEventByIdController(getEventByIdUseCase);

const cancelEventUseCase = new CancelEventUseCase(eventRepository);
const cancelEventController = new CancelEventController(cancelEventUseCase);

const publishEventUseCase = new PublishEventUseCase(eventRepository);
const publishEventController = new PublishEventController(publishEventUseCase);

const updateEventUseCase = new UpdateEventUseCase(eventRepository);
const updateEventController = new UpdateEventController(updateEventUseCase);

// ==========================================
// Rotas Públicas (Consulta)
// ==========================================
eventRoutes.get("/events", (req, res) => listEventsController.handle(req, res));

eventRoutes.get("/events/:id", (req, res) =>
  getEventByIdController.handle(req, res),
);

// ==========================================
// Rotas Protegidas (Exigem Token JWT)
// ==========================================
eventRoutes.post("/events", ensureAuthenticated, (req, res) =>
  createEventController.handle(req, res),
);

eventRoutes.put("/events/:id", ensureAuthenticated, (req, res) =>
  updateEventController.handle(req, res),
);

eventRoutes.patch("/events/:id/cancel", ensureAuthenticated, (req, res) =>
  cancelEventController.handle(req, res),
);

eventRoutes.patch("/events/:id/publish", ensureAuthenticated, (req, res) =>
  publishEventController.handle(req, res),
);

export { eventRoutes };
