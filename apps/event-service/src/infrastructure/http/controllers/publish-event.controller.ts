import { Request, Response } from 'express';
import { PublishEventUseCase } from '../../../use-cases/publish-event';

export class PublishEventController {
  constructor(private publishEventUseCase: PublishEventUseCase) {}

  async handle(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      await this.publishEventUseCase.execute(Array.isArray(id) ? id[0] : id);

      return res.status(200).json({ message: 'Event published successfully' });
    } catch (error: any) {
      if (error.message === 'Event not found') {
        return res.status(404).json({ error: error.message });
      }

      if (
        error.message === 'Cannot publish a canceled event' ||
        error.message === 'Cannot publish a finished event'
      ) {
        return res.status(400).json({ error: error.message });
      }

      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}