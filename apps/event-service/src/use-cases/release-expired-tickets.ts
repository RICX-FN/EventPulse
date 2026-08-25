import { TicketRepository } from '../domain/repositories/ticket-repository.interface';

export class ReleaseExpiredTicketsUseCase {
  constructor(private ticketRepository: TicketRepository) {}

  async execute(): Promise<number> {
    const releasedCount = await this.ticketRepository.releaseExpiredReservations();
    
    if (releasedCount > 0) {
      console.log(`[Cron Worker] Released ${releasedCount} expired ticket reservation(s).`);
    }

    return releasedCount;
  }
}