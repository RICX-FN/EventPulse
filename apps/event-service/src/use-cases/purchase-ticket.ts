import { TicketRepository } from '../domain/repositories/ticket-repository.interface';
import { TicketStatus } from '../generated/prisma/enums';

interface PurchaseTicketInput {
  ticketId: string;
  userId: string;
}

export class PurchaseTicketUseCase {
  constructor(private ticketRepository: TicketRepository) {}

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

    // Verifica se a reserva expirou
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

    return {
      message: 'Ticket purchased successfully.',
      ticketId: ticket.id,
      status: TicketStatus.SOLD,
    };
  }
}