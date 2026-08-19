import { Router } from 'express';
import prisma from '../../database/prisma';
import { PrismaEventRepository } from '../../database/repositories/prisma-event-repository';
import { CreateEventUseCase } from '../../../use-cases/create-event';
import { CreateEventController } from '../controllers/create-event-controller';
import { ListEventsUseCase } from '../../../use-cases/list-events-use-case';
import { ListEventsController } from '../controllers/list-events-controller';

const eventRoutes = Router();

const eventRepository = new PrismaEventRepository(prisma);

const createEventUseCase = new CreateEventUseCase(eventRepository);
const createEventController = new CreateEventController(createEventUseCase);

const listEventsUseCase = new ListEventsUseCase(eventRepository);
const listEventsController = new ListEventsController(listEventsUseCase);

eventRoutes.post('/events', (req, res) => createEventController.handle(req, res));
eventRoutes.get('/events', (req, res) => listEventsController.handle(req, res));

export { eventRoutes };