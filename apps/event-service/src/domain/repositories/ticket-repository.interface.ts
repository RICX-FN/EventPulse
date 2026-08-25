export interface CreateTicketsDTO {
  eventId: string;
  quantity: number;
  price: number;
}

export interface TicketRepository {
  createMany(data: CreateTicketsDTO): Promise<{ count: number }>;
}

export interface TicketRepository {
  createMany(data: CreateTicketsDTO): Promise<{ count: number }>;
  findAvailableTicket(eventId: string): Promise<any | null>;
  reserveWithOptimisticLock(params: {
    ticketId: string;
    version: number;
    userId: string;
    reservedUntil: Date;
  }): Promise<boolean>;
}

export interface TicketRepository {
  createMany(data: CreateTicketsDTO): Promise<{ count: number }>;
  findAvailableTicket(eventId: string): Promise<any | null>;
  reserveWithOptimisticLock(params: {
    ticketId: string;
    version: number;
    userId: string;
    reservedUntil: Date;
  }): Promise<boolean>;
  releaseExpiredReservations(): Promise<number>; // Retorna a quantidade de bilhetes libertados
}