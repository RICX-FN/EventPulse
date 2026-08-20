import { describe, it, expect, beforeEach } from 'vitest';
import { UpdateEventUseCase } from './update-event';
import { InMemoryEventRepository } from './repositories/in-memory-event-repository';
import { Event } from '../domain/entities/event';

describe('UpdateEventUseCase', () => {
  let eventRepository: InMemoryEventRepository;
  let sut: UpdateEventUseCase;

  beforeEach(() => {
    eventRepository = new InMemoryEventRepository();
    sut = new UpdateEventUseCase(eventRepository);
  });

  it('should be able to update an event', async () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 15);

    const event = new Event({
      title: 'Original Title',
      description: 'Original Description',
      location: 'Original Location',
      status: 'DRAFT',
      eventDate: futureDate,
    });

    await eventRepository.create(event);

    await sut.execute({
      id: event.id,
      title: 'Updated Title',
      location: 'Updated Location',
    });

    expect(eventRepository.items[0].title).toBe('Updated Title');
    expect(eventRepository.items[0].location).toBe('Updated Location');
    expect(eventRepository.items[0].description).toBe('Original Description');
  });

  it('should throw error when updating a non-existing event', async () => {
    await expect(
      sut.execute({
        id: 'non-existing-id',
        title: 'New Title',
      })
    ).rejects.toThrow('Event not found');
  });
});