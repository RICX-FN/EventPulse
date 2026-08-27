import { EventRepository } from "../../domain/repositories/event-repository.interface";
import { Event } from "../../domain/entities/event";
import { RedisClient } from "./redis-client";

export class CachedEventRepository implements EventRepository {
  private readonly CACHE_PREFIX = "events:list:v2";

  constructor(
    private prismaRepository: EventRepository,
    private redis: RedisClient,
  ) {}

  async findAll(): Promise<Event[]> {
    const cacheKey = `${this.CACHE_PREFIX}:all`;

    try {
      // 1. Tenta buscar da Cache
      const cachedEvents = await this.redis.get<Event[]>(cacheKey);
      if (cachedEvents) {
        console.log("⚡ [Redis Cache HIT] Returning events from cache");
        return cachedEvents;
      }
    } catch (error) {
      console.warn(
        "[Redis Warning] Failed to fetch from cache, falling back to database.",
      );
    }

    // 2. Cache Miss ou Erro no Redis: Busca no PostgreSQL
    console.log("🐢 [Redis Cache MISS] Fetching events from PostgreSQL");
    const events = await this.prismaRepository.findAll();

    try {
      // 3. Tenta guardar na Cache com TTL de 5 minutos
      await this.redis.set(cacheKey, events, 300);
    } catch (error) {
      console.warn("[Redis Warning] Failed to write to cache.");
    }

    return events;
  }

  async findById(id: string): Promise<Event | null> {
    return this.prismaRepository.findById(id);
  }

  async create(event: Event): Promise<void> {
    await this.prismaRepository.create(event);
    await this.redis.del(`${this.CACHE_PREFIX}:all`);
    console.log(
      "[Redis Cache Invalidate] Cleared events list cache after create",
    );
  }

  async save(event: Event): Promise<void> {
    await this.prismaRepository.save(event);
    await this.redis.del(`${this.CACHE_PREFIX}:all`);
    console.log(
      "[Redis Cache Invalidate] Cleared events list cache after save",
    );
  }
}
