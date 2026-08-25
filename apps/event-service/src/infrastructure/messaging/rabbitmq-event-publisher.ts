import { EventPublisher, TicketPurchasedPayload } from '../../domain/events/event-publisher.interface';
import { RabbitMQClient } from './rabbitmq-client';

export class RabbitMQEventPublisher implements EventPublisher {
  constructor(private client: RabbitMQClient) {}

  async publishTicketPurchased(payload: TicketPurchasedPayload): Promise<void> {
    await this.client.publish('ticket.purchased', payload);
    console.log(`[RabbitMQ] 📢 Published event 'ticket.purchased' for ticket ${payload.ticketId}`);
  }
}