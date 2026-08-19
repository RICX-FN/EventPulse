import { Event } from '../domain/entities/event';
import { EventRepository } from '../domain/repositories/event-repository';

export class GetEventByIdUseCase {
  constructor(private eventRepository: EventRepository) {}

  async execute(id: string): Promise<Event | null> {
    const event = await this.eventRepository.findById(id);
    return event;
  }
}