import { Event } from '../domain/entities/event';
import { EventRepository } from '../domain/repositories/event-repository';

export class ListEventsUseCase {
  constructor(private eventRepository: EventRepository) {}

  async execute(): Promise<Event[]> {
    return await this.eventRepository.findAll();
  }
}