import { describe, it, expect, beforeEach } from 'vitest';
import { ListEventsUseCase } from './list-events-use-case';
import { InMemoryEventRepository } from './repositories/in-memory-event-repository';
import { Event } from '../domain/entities/event';

describe('ListEventsUseCase', () => {
  let eventRepository: InMemoryEventRepository;
  let sut: ListEventsUseCase;

  beforeEach(() => {
    eventRepository = new InMemoryEventRepository();
    sut = new ListEventsUseCase(eventRepository);
  });

  it('should be able to list all events', async () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 5);

    const event1 = new Event({
      title: 'Event 1',
      description: 'Desc 1',
      location: 'Loc 1',
      status: 'DRAFT',
      eventDate: futureDate,
    });

    const event2 = new Event({
      title: 'Event 2',
      description: 'Desc 2',
      location: 'Loc 2',
      status: 'PUBLISHED',
      eventDate: futureDate,
    });

    await eventRepository.create(event1);
    await eventRepository.create(event2);

    const events = await sut.execute();

    expect(events).toHaveLength(2);
    expect(events).toEqual([event1, event2]);
  });
});