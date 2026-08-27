import Redis from "ioredis";

export class RedisClient {
  private client: Redis | null = null;

  connect(): Redis {
    if (this.client) return this.client;

    const redisUrl = process.env.REDIS_URL || "redis://localhost:6380";

    this.client = new Redis(redisUrl, {
      maxRetriesPerRequest: 3,
      retryStrategy(times) {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
    });

    this.client.on("connect", () => {
      console.log("Connected to Redis successfully.");
    });

    this.client.on("error", (err) => {
      console.error("Redis Error:", err);
    });

    return this.client;
  }

  async get<T>(key: string): Promise<T | null> {
    const data = await this.connect().get(key);
    return data ? JSON.parse(data) : null;
  }

  async set(key: string, value: any, ttlInSeconds = 300): Promise<void> {
    await this.connect().set(key, JSON.stringify(value), "EX", ttlInSeconds);
  }

  async del(key: string): Promise<void> {
    await this.connect().del(key);
  }
}

export const redisClient = new RedisClient();
