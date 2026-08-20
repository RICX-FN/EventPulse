import { describe, it, expect, beforeEach } from 'vitest';
import { PublishEventUseCase } from './publish-event';
import { InMemoryEventRepository } from './repositories/in-memory-event-repository';
import { Event } from '../domain/entities/event';

describe('PublishEventUseCase', () => {
  let eventRepository: InMemoryEventRepository;
  let sut: PublishEventUseCase;

  beforeEach(() => {
    eventRepository = new InMemoryEventRepository();
    sut = new PublishEventUseCase(eventRepository);
  });

  it('should be able to publish an event', async () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 10);

    const event = new Event({
      title: 'Event to Publish',
      description: 'Description',
      location: 'Location',
      status: 'DRAFT',
      eventDate: futureDate,
    });

    await eventRepository.create(event);

    await sut.execute(event.id);

    expect(eventRepository.items[0].status).toBe('PUBLISHED');
  });

  it('should throw error when event is not found', async () => {
    await expect(sut.execute('non-existing-id')).rejects.toThrow('Event not found');
  });
});