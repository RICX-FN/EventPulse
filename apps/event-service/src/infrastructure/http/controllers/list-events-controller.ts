import { Request, Response } from 'express';
import { ListEventsUseCase } from '../../../use-cases/list-events-use-case';

export class ListEventsController {
  constructor(private listEventsUseCase: ListEventsUseCase) {}

  async handle(req: Request, res: Response): Promise<Response> {
    try {
      const events = await this.listEventsUseCase.execute();

      const response = events.map((event) => ({
        id: event.id,
        title: event.title,
        description: event.description,
        location: event.location,
        bannerUrl: event.bannerUrl,
        status: event.status,
        eventDate: event.eventDate,
      }));

      return res.status(200).json(response);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}