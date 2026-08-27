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
import { CreateTicketsUseCase } from "../../../use-cases/create-tickets";
import { CreateTicketsController } from "../controllers/create-tickets.controller";
import { PrismaTicketRepository } from "../../database/repositories/prisma-ticket-repository";
import { ReserveTicketUseCase } from "../../../use-cases/reserve-ticket";
import { ReserveTicketController } from "../controllers/reserve-ticket.controller";
import { PurchaseTicketUseCase } from "../../../use-cases/purchase-ticket";
import { PurchaseTicketController } from "../controllers/purchase-ticket.controller";
import { rabbitMQClient } from "../../messaging/rabbitmq-client";
import { RabbitMQEventPublisher } from "../../messaging/rabbitmq-event-publisher";
import { redisClient } from "../../cache/redis-client";
import { CachedEventRepository } from "../../cache/cached-event-repository";

const eventRoutes = Router();

// 1. Repositórios base
const prismaEventRepository = new PrismaEventRepository(prisma);
const ticketRepository = new PrismaTicketRepository(prisma);
const eventPublisher = new RabbitMQEventPublisher(rabbitMQClient);

// 2. Repositório com suporte a Cache Redis envolvido no Prisma
const eventRepository = new CachedEventRepository(
  prismaEventRepository,
  redisClient,
);

// 3. Instâncias dos Casos de Uso e Controllers utilizando o eventRepository com Cache
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

const createTicketsUseCase = new CreateTicketsUseCase(
  ticketRepository,
  eventRepository,
);
const createTicketsController = new CreateTicketsController(
  createTicketsUseCase,
);

const reserveTicketUseCase = new ReserveTicketUseCase(ticketRepository);
const reserveTicketController = new ReserveTicketController(
  reserveTicketUseCase,
);

const purchaseTicketUseCase = new PurchaseTicketUseCase(
  ticketRepository,
  eventPublisher,
);
const purchaseTicketController = new PurchaseTicketController(
  purchaseTicketUseCase,
);

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

// Criação em lote de bilhetes para o evento
eventRoutes.post("/events/:eventId/tickets", ensureAuthenticated, (req, res) =>
  createTicketsController.handle(req, res),
);

// Rota para reservar um bilhete do evento
eventRoutes.post("/events/:eventId/reserve", ensureAuthenticated, (req, res) =>
  reserveTicketController.handle(req, res),
);

// Rota de compra de bilhete
eventRoutes.post(
  "/events/tickets/:ticketId/purchase",
  ensureAuthenticated,
  (req, res) => purchaseTicketController.handle(req, res),
);

export { eventRoutes };
