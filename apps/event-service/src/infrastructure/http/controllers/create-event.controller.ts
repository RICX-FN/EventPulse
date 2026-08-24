import { Request, Response } from "express";
import { CreateEventUseCase } from "../../../use-cases/create-event";

export class CreateEventController {
  constructor(private createEventUseCase: CreateEventUseCase) {}

  async handle(req: Request, res: Response): Promise<Response> {
    const { title, description, location, bannerUrl, eventDate } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "User non-authenticated." });
    }

    try {
      const { event } = await this.createEventUseCase.execute({
        title,
        description,
        location,
        bannerUrl,
        eventDate: new Date(eventDate),
        userId,
      });

      return res.status(201).json({
        id: event.id,
        title: event.title,
        description: event.description,
        location: event.location,
        bannerUrl: event.bannerUrl,
        status: event.status,
        eventDate: event.eventDate,
        userId: event.userId,
        createdAt: event.createdAt,
        updatedAt: event.updatedAt,
      });
    } catch (error: any) {
      return res.status(400).json({
        error: error.message || "Unexpected error while creating event.",
      });
    }
  }
}
