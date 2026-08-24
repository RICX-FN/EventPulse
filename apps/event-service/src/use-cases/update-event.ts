import { EventRepository } from "../domain/repositories/event-repository.interface";

interface UpdateEventInput {
  id: string;
  title?: string;
  description?: string;
  location?: string;
  bannerUrl?: string;
  eventDate?: Date;
}

export class UpdateEventUseCase {
  constructor(private eventRepository: EventRepository) {}

  async execute(input: UpdateEventInput): Promise<void> {
    const event = await this.eventRepository.findById(input.id);

    if (!event) {
      throw new Error("Event not found");
    }

    event.update({
      title: input.title,
      description: input.description,
      location: input.location,
      bannerUrl: input.bannerUrl,
      eventDate: input.eventDate,
    });

    await this.eventRepository.save(event);
  }
}
