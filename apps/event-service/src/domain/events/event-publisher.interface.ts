export interface TicketPurchasedPayload {
  ticketId: string;
  eventId: string;
  userId: string;
  price: number;
}

export interface EventPublisher {
  publishTicketPurchased(payload: TicketPurchasedPayload): Promise<void>;
}