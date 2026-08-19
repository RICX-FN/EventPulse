import { Event } from "../entities/event";

export interface EventRepository {
  create(event: Event): Promise<void>;
  findById(id: string): Promise<Event | null>;
  findAll(): Promise<Event[]>;
}
