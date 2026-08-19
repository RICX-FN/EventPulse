import { Event } from "../../domain/entities/event";
import { EventRepository } from "../../domain/repositories/event-repository";

export class InMemoryEventRepository implements EventRepository {
  public items: Event[] = [];

  async create(event: Event): Promise<void> {
    this.items.push(event);
  }

  async findById(id: string): Promise<Event | null> {
    const event = this.items.find((item) => item.id === id);
    return event ?? null;
  }

  async findAll(): Promise<Event[]> {
    return this.items;
  }
}
