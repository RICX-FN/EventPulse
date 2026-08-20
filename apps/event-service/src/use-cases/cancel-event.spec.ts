import { describe, it, expect, beforeEach } from 'vitest';
import { CancelEventUseCase } from './cancel-event';
import { InMemoryEventRepository } from './repositories/in-memory-event-repository';
import { Event } from '../domain/entities/event';

describe('CancelEventUseCase', () => {
  let eventRepository: InMemoryEventRepository;
  let sut: CancelEventUseCase;

  beforeEach(() => {
    eventRepository = new InMemoryEventRepository();
    sut = new CancelEventUseCase(eventRepository);
  });

  it('should be able to cancel an event', async () => {
    // Data futura para passar na validação da Entidade
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 7);

    const event = new Event({
      title: 'Event to Cancel',
      description: 'Description',
      location: 'Location',
      status: 'DRAFT',
      eventDate: futureDate,
    });

    await eventRepository.create(event);

    await sut.execute(event.id);

    expect(eventRepository.items[0].status).toBe('CANCELED');
  });

  it('should throw error when event is not found', async () => {
    await expect(sut.execute('non-existing-id')).rejects.toThrow('Event not found');
  });
});