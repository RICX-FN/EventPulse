import { Router } from 'express';
import prisma from '../../database/prisma';
import { PrismaEventRepository } from '../../database/repositories/prisma-event-repository';
import { CreateEventUseCase } from '../../../use-cases/create-event';
import { CreateEventController } from '../controllers/create-event-controller';
import { ListEventsUseCase } from '../../../use-cases/list-events-use-case';
import { ListEventsController } from '../controllers/list-events-controller';
import { GetEventByIdUseCase } from '../../../use-cases/get-event-by-id';
import { GetEventByIdController } from '../controllers/get-event-by-id-controller';

const eventRoutes = Router();

const eventRepository = new PrismaEventRepository(prisma);

// Instâncias dos Casos de Uso e Controllers
const createEventUseCase = new CreateEventUseCase(eventRepository);
const createEventController = new CreateEventController(createEventUseCase);

const listEventsUseCase = new ListEventsUseCase(eventRepository);
const listEventsController = new ListEventsController(listEventsUseCase);

const getEventByIdUseCase = new GetEventByIdUseCase(eventRepository);
const getEventByIdController = new GetEventByIdController(getEventByIdUseCase);

// Rotas
eventRoutes.post('/events', (req, res) => createEventController.handle(req, res));
eventRoutes.get('/events', (req, res) => listEventsController.handle(req, res));
eventRoutes.get('/events/:id', (req, res) => getEventByIdController.handle(req, res));

export { eventRoutes };