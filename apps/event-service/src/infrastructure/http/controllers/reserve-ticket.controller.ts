import { Request, Response } from 'express';
import { ReserveTicketUseCase } from '../../../use-cases/reserve-ticket';

export class ReserveTicketController {
  constructor(private reserveTicketUseCase: ReserveTicketUseCase) {}

  async handle(req: Request, res: Response): Promise<Response> {
    const { eventId } = req.params;
    const userId = req.user?.id;

    if (typeof eventId !== 'string') {
      return res.status(400).json({ error: 'Invalid event ID.' });
    }

    if (!userId) {
      return res.status(401).json({ error: 'User non-authenticated.' });
    }

    try {
      const result = await this.reserveTicketUseCase.execute({ eventId, userId });
      return res.status(200).json(result);
    } catch (error: any) {
      // Se for conflito de concorrência, pode retornar 409 Conflict
      const status = error.message.includes('Conflict') ? 409 : 400;
      return res.status(status).json({ error: error.message });
    }
  }
}