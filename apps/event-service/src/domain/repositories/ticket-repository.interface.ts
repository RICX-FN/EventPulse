export interface CreateTicketsDTO {
  eventId: string;
  quantity: number;
  price: number;
}

export interface TicketRepository {
  createMany(data: CreateTicketsDTO): Promise<{ count: number }>;
}