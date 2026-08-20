import { Request, Response } from "express";
import { UpdateEventUseCase } from "../../../use-cases/update-event";

export class UpdateEventController {
  constructor(private updateEventUseCase: UpdateEventUseCase) {}

  async handle(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const { title, description, location, bannerUrl, eventDate } = req.body;

      await this.updateEventUseCase.execute({
        id: Array.isArray(id) ? id[0] : id,
        title,
        description,
        location,
        bannerUrl,
        eventDate: eventDate ? new Date(eventDate) : undefined,
      });

      return res.status(200).json({ message: "Event updated successfully" });
    } catch (error: any) {
      if (error.message === "Event not found") {
        return res.status(404).json({ error: error.message });
      }

      if (
        error.message === "Cannot update a canceled event" ||
        error.message === "Cannot update a finished event"
      ) {
        return res.status(400).json({ error: error.message });
      }

      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}
