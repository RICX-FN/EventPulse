import amqp, { Channel } from "amqplib";

export class RabbitMQConsumer {
  private connection: amqp.ChannelModel | null = null;
  private channel: Channel | null = null;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private isConnecting = false;

  async connect(): Promise<void> {
    if (this.connection || this.isConnecting) return;

    this.isConnecting = true;
    const rabbitUrl = process.env.RABBITMQ_URL || "amqp://localhost:5672";

    const exchangeName = "eventpulse_events";
    const queueName = "notification_tickets_queue";
    const routingKey = "ticket.purchased";

    const dlxName = "eventpulse_dlx";
    const dlqName = "notification_tickets_dlq";

    try {
      const connection = await amqp.connect(rabbitUrl);
      this.connection = connection;
      connection.on("error", (error) => {
        console.error("❌ RabbitMQ connection error:", error.message);
      });
      connection.on("close", () => {
        this.connection = null;
        this.channel = null;
        this.scheduleReconnect();
      });

      const channel = await connection.createChannel();
      this.channel = channel;

      // 1. DLX e DLQ
      await channel.assertExchange(dlxName, "direct", { durable: true });
      await channel.assertQueue(dlqName, { durable: true });
      await channel.bindQueue(dlqName, dlxName, routingKey);

      // 2. Exchange Principal (tipo 'topic')
      await channel.assertExchange(exchangeName, "topic", {
        durable: true,
      });

      // 3. Fila Principal vinculada à DLX
      await channel.assertQueue(queueName, {
        durable: true,
        arguments: {
          "x-dead-letter-exchange": dlxName,
          "x-dead-letter-routing-key": routingKey,
        },
      });
      await channel.bindQueue(queueName, exchangeName, routingKey);

      console.log(`📡 [Notification Service] Listening to '${queueName}'...`);

      await channel.consume(queueName, async (msg) => {
        if (msg) {
          try {
            const payload = JSON.parse(msg.content.toString());
            await this.processEmailNotification(payload);
            channel.ack(msg); // Confirma e remove da fila
          } catch (error: any) {
            console.error(`❌ [Consumer Error]: ${error.message}`);
            channel.nack(msg, false, false); // Manda para a DLQ
          }
        }
      });
    } catch (error) {
      this.connection = null;
      this.channel = null;
      console.error("❌ Connection error:", error);
      this.scheduleReconnect();
    } finally {
      this.isConnecting = false;
    }
  }

  private scheduleReconnect(): void {
    if (this.reconnectTimer) return;

    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      void this.connect();
    }, 5000);
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
