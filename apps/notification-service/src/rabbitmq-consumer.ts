import amqp, { Channel } from "amqplib";

export class RabbitMQConsumer {
  private channel: Channel | null = null;

  async connect(): Promise<void> {
    const rabbitUrl = process.env.RABBITMQ_URL || "amqp://localhost:5672";

    const exchangeName = "eventpulse_events";
    const queueName = "notification_tickets_queue";
    const routingKey = "ticket.purchased";

    const dlxName = "eventpulse_dlx";
    const dlqName = "notification_tickets_dlq";

    try {
      const connection = await amqp.connect(rabbitUrl);
      this.channel = await connection.createChannel();

      // 1. DLX e DLQ
      await this.channel.assertExchange(dlxName, "direct", { durable: true });
      await this.channel.assertQueue(dlqName, { durable: true });
      await this.channel.bindQueue(dlqName, dlxName, routingKey);

      // 2. Exchange Principal (tipo 'topic')
      await this.channel.assertExchange(exchangeName, "topic", {
        durable: true,
      });

      // 3. Fila Principal vinculada à DLX
      await this.channel.assertQueue(queueName, {
        durable: true,
        arguments: {
          "x-dead-letter-exchange": dlxName,
          "x-dead-letter-routing-key": routingKey,
        },
      });
      await this.channel.bindQueue(queueName, exchangeName, routingKey);

      console.log(`📡 [Notification Service] Listening to '${queueName}'...`);

      this.channel.consume(queueName, async (msg) => {
        if (msg) {
          try {
            const payload = JSON.parse(msg.content.toString());
            await this.processEmailNotification(payload);
            this.channel?.ack(msg); // Confirma e remove da fila
          } catch (error: any) {
            console.error(`❌ [Consumer Error]: ${error.message}`);
            this.channel?.nack(msg, false, false); // Manda para a DLQ
          }
        }
      });
    } catch (error) {
      console.error("❌ Connection error:", error);
      setTimeout(() => this.connect(), 5000);
    }
  }

  private async processEmailNotification(data: any): Promise<void> {
    console.log("\n==================================================");
    console.log("📧 [NOTIFICATION SERVICE] - ENVIANDO E-MAIL");
    console.log(`   Para (User ID): ${data.userId}`);
    console.log(
      `   Assunto: Confirmação de Compra do Bilhete #${data.ticketId}`,
    );
    console.log(
      `   Detalhes: Evento ${data.eventId} | Valor: ${data.price} Kz`,
    );
    console.log("==================================================\n");
  }
}
