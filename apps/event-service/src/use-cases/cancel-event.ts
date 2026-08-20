import { EventRepository } from "../domain/repositories/event-repository";

export class CancelEventUseCase {
  constructor(private eventRepository: EventRepository) {}

  async execute(id: string): Promise<void> {
    const event = await this.eventRepository.findById(id);

    if (!event) {
      throw new Error("Event not found");
    }

    event.cancel();

    await this.eventRepository.save(event);
  }
}
