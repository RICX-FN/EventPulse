import amqp, { Channel } from 'amqplib';

export class RabbitMQClient {
  private connection: amqp.ChannelModel | null = null;
  private channel: Channel | null = null;
  private readonly exchangeName = 'eventpulse_events';

  async connect(): Promise<void> {
    if (this.connection) return;

    const rabbitUrl = process.env.RABBITMQ_URL || 'amqp://localhost:5672';

    try {
      this.connection = await amqp.connect(rabbitUrl);
      this.channel = await this.connection.createChannel();

      if (!this.channel) {
        throw new Error('Failed to create RabbitMQ channel.');
      }

      // Garante que a exchange do tipo 'topic' existe
      await this.channel.assertExchange(this.exchangeName, 'topic', {
        durable: true,
      });

      console.log('🐰 Connected to RabbitMQ successfully.');
    } catch (error) {
      console.error('Error connecting to RabbitMQ:', error);
      throw error;
    }
  }

  async publish(routingKey: string, message: object): Promise<boolean> {
    if (!this.channel) {
      throw new Error('RabbitMQ channel is not initialized.');
    }

    const payload = Buffer.from(
      JSON.stringify({
        ...message,
        occurredOn: new Date().toISOString(),
      })
    );

    return this.channel.publish(this.exchangeName, routingKey, payload, {
      persistent: true,
    });
  }
}

export const rabbitMQClient = new RabbitMQClient();