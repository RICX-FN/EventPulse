import { TicketRepository } from '../domain/repositories/ticket-repository.interface';
import { EventPublisher } from '../domain/events/event-publisher.interface';
import { TicketStatus } from '../generated/prisma/enums';

interface PurchaseTicketInput {
  ticketId: string;
  userId: string;
}

export class PurchaseTicketUseCase {
  constructor(
    private ticketRepository: TicketRepository,
    private eventPublisher: EventPublisher // Injeção de dependência do publisher
  ) {}

  async execute({ ticketId, userId }: PurchaseTicketInput) {
    const ticket = await this.ticketRepository.findById(ticketId);

    if (!ticket) {
      throw new Error('Ticket not found.');
    }

    if (ticket.status !== TicketStatus.RESERVED) {
      throw new Error('Ticket is not currently reserved.');
    }

    if (ticket.reservedBy !== userId) {
      throw new Error('Unauthorized: This ticket is reserved by another user.');
    }

    if (ticket.reservedUntil && new Date() > new Date(ticket.reservedUntil)) {
      throw new Error('Reservation has expired. Please reserve the ticket again.');
    }

    const success = await this.ticketRepository.markAsSold({
      ticketId: ticket.id,
      version: ticket.version,
      userId,
    });

    if (!success) {
      throw new Error('Conflict: Failed to purchase ticket due to concurrent updates. Please try again.');
    }

    // 📢 Disparo do Evento Assíncrono para o RabbitMQ
    await this.eventPublisher.publishTicketPurchased({
      ticketId: ticket.id,
      eventId: ticket.eventId,
      userId: userId,
      price: ticket.price,
    });

    return {
      message: 'Ticket purchased successfully.',
      ticketId: ticket.id,
      status: TicketStatus.SOLD,
    };
  }
}