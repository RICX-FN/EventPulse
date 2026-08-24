import { TicketRepository } from '../domain/repositories/ticket-repository.interface';
import { EventRepository } from '../domain/repositories/event-repository.interface';

interface CreateTicketsInput {
  eventId: string;
  quantity: number;
  price: number;
  userId: string;
}

export class CreateTicketsUseCase {
  constructor(
    private ticketRepository: TicketRepository,
    private eventRepository: EventRepository
  ) {}

  async execute({ eventId, quantity, price, userId }: CreateTicketsInput) {
    if (quantity <= 0) {
      throw new Error('Quantity must be greater than zero.');
    }

    if (price < 0) {
      throw new Error('Price cannot be negative.');
    }

    const event = await this.eventRepository.findById(eventId);

    if (!event) {
      throw new Error('Event not found.');
    }

    if (event.userId !== userId) {
      throw new Error('Unauthorized: You are not the owner of this event.');
    }

    const result = await this.ticketRepository.createMany({
      eventId,
      quantity,
      price,
    });

    return {
      message: `${result.count} tickets created successfully.`,
      count: result.count,
    };
  }
}