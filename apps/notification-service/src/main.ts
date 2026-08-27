import dotenv from 'dotenv';
import { RabbitMQConsumer } from './rabbitmq-consumer';

dotenv.config();

async function bootstrap() {
  console.log('Starting Notification Service Worker...');
  const consumer = new RabbitMQConsumer();
  await consumer.connect();
}

bootstrap();
