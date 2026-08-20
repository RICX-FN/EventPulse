import { Request, Response } from 'express';
import { CancelEventUseCase } from '../../../use-cases/cancel-event';

export class CancelEventController {
  constructor(private cancelEventUseCase: CancelEventUseCase) {}

  async handle(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      if (typeof id !== 'string') {
        return res.status(400).json({ error: 'Invalid event id' });
      }

      await this.cancelEventUseCase.execute(id);
      

      return res.status(200).json({ message: 'Event canceled successfully' });
    } catch (error: any) {
      if (error.message === 'Event not found') {
        return res.status(404).json({ error: error.message });
      }

      if (error.message === 'Cannot cancel a finished event') {
        return res.status(400).json({ error: error.message });
      }

      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}