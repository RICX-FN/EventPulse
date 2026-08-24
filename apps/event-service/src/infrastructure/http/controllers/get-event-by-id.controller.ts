import { Request, Response } from "express";
import { GetEventByIdUseCase } from "../../../use-cases/get-event-by-id";

export class GetEventByIdController {
  constructor(private getEventByIdUseCase: GetEventByIdUseCase) {}

  async handle(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      const event = await this.getEventByIdUseCase.execute(
        Array.isArray(id) ? id[0] : id,
      );

      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }

      return res.status(200).json({
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
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}
