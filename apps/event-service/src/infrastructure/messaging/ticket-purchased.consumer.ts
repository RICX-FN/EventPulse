import { rabbitMQClient } from "./rabbitmq-client";

export async function startTicketPurchasedConsumer() {
  await rabbitMQClient.consume(
    "ticket_notifications_queue",
    "ticket.purchased",
    (data) => {
      console.log("[Consumer] Novo bilhete vendido recebido:");
      console.log(`   - Ticket ID: ${data.ticketId}`);
      console.log(`   - User ID: ${data.userId}`);
      console.log(`   - Event ID: ${data.eventId}`);
      console.log(`   - Preço: ${data.price} Kz`);
      // Aqui entraria a lógica de envio de e-mail / notificação
    },
  );
}
