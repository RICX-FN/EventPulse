import { Request, Response } from "express";
import { CreateEventUseCase } from "../../../use-cases/create-event";

export class CreateEventController {
  constructor(private createEventUseCase: CreateEventUseCase) {}

  async handle(req: Request, res: Response): Promise<Response> {
    try {
      const { title, description, location, bannerUrl, eventDate } = req.body;

      const { event } = await this.createEventUseCase.execute({
        title,
        description,
        location,
        bannerUrl,
        eventDate: new Date(eventDate),
      });

      return res.status(201).json({
        id: event.id,
        title: event.title,
        description: event.description,
        location: event.location,
        bannerUrl: event.bannerUrl,
        status: event.status,
        eventDate: event.eventDate,
      });
    } catch (error: any) {
      return res.status(400).json({
        error: error.message || "Unexpected error while creating event.",
      });
    }
  }
}
