import amqp, { Channel } from "amqplib";

export class RabbitMQClient {
  private connection: amqp.ChannelModel | null = null;
  private channel: Channel | null = null;
  private readonly exchangeName = "eventpulse_events";

  async connect(): Promise<void> {
    if (this.connection) return;

    const rabbitUrl = process.env.RABBITMQ_URL || "amqp://localhost:5672";

    try {
      this.connection = await amqp.connect(rabbitUrl);
      this.channel = await this.connection.createChannel();

      if (!this.channel) {
        throw new Error("Failed to create RabbitMQ channel.");
      }

      // Garante que a exchange do tipo 'topic' existe
      await this.channel.assertExchange(this.exchangeName, "topic", {
        durable: true,
      });

      console.log("🐰 Connected to RabbitMQ successfully.");
    } catch (error) {
      console.error("Error connecting to RabbitMQ:", error);
      throw error;
    }
  }

  async publish(routingKey: string, message: object): Promise<boolean> {
    if (!this.channel) {
      throw new Error("RabbitMQ channel is not initialized.");
    }

    const payload = Buffer.from(
      JSON.stringify({
        ...message,
        occurredOn: new Date().toISOString(),
      }),
    );

    return this.channel.publish(this.exchangeName, routingKey, payload, {
      persistent: true,
    });
  }

  async consume(
    queueName: string,
    routingKey: string,
    onMessage: (msg: any) => void,
  ): Promise<void> {
    if (!this.channel) {
      throw new Error("RabbitMQ channel is not initialized.");
    }

    // Cria/Garante a fila
    await this.channel.assertQueue(queueName, { durable: true });

    // Faz o bind da fila com a exchange e a routing key
    await this.channel.bindQueue(queueName, this.exchangeName, routingKey);

    // Começa a escutar a fila
    this.channel.consume(queueName, (msg) => {
      if (msg) {
        const content = JSON.parse(msg.content.toString());
        onMessage(content);
        this.channel?.ack(msg); // Confirma o processamento da mensagem
      }
    });

    console.log(
      `👂 Listening to queue '${queueName}' with routing key '${routingKey}'`,
    );
  }
}

export const rabbitMQClient = new RabbitMQClient();
