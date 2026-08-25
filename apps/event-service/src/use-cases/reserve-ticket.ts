import { TicketRepository } from '../domain/repositories/ticket-repository.interface';

interface ReserveTicketInput {
  eventId: string;
  userId: string;
}

export class ReserveTicketUseCase {
  constructor(private ticketRepository: TicketRepository) {}

  async execute({ eventId, userId }: ReserveTicketInput) {
    // 1. Busca o primeiro bilhete disponível
    const ticket = await this.ticketRepository.findAvailableTicket(eventId);

    if (!ticket) {
      throw new Error('No available tickets for this event.');
    }

    // 2. Define o tempo limite da reserva (ex: 10 minutos)
    const reservedUntil = new Date();
    reservedUntil.setMinutes(reservedUntil.getMinutes() + 10);

    // 3. Tenta reservar usando Optimistic Locking com a versão capturada
    const success = await this.ticketRepository.reserveWithOptimisticLock({
      ticketId: ticket.id,
      version: ticket.version,
      userId,
      reservedUntil,
    });

    if (!success) {
      throw new Error('Conflict: The ticket was reserved by another user. Please try again.');
    }

    return {
      message: 'Ticket reserved successfully.',
      ticketId: ticket.id,
      reservedUntil,
    };
  }
}