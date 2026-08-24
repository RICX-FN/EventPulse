import { Request, Response } from 'express';
import { CreateTicketsUseCase } from '../../../use-cases/create-tickets';

export class CreateTicketsController {
  constructor(private createTicketsUseCase: CreateTicketsUseCase) {}

  async handle(req: Request, res: Response): Promise<Response> {
    const eventId = Array.isArray(req.params.eventId)
      ? req.params.eventId[0]
      : req.params.eventId;
    const { quantity, price } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'User non-authenticated.' });
    }

    try {
      const result = await this.createTicketsUseCase.execute({
        eventId,
        quantity: Number(quantity),
        price: Number(price),
        userId,
      });

      return res.status(201).json(result);
    } catch (error: any) {
      return res.status(400).json({ error: error.message || 'Unexpected error.' });
    }
  }
}