import { Event } from "../domain/entities/event";
import { EventRepository } from "../domain/repositories/event-repository.interface";

interface CreateEventUseCaseRequest {
  title: string;
  description: string;
  location: string;
  bannerUrl?: string;
  eventDate: Date;
  userId: string;
}

interface CreateEventUseCaseResponse {
  event: Event;
}

export class CreateEventUseCase {
  constructor(private eventRepository: EventRepository) {}

  async execute(
    request: CreateEventUseCaseRequest,
  ): Promise<CreateEventUseCaseResponse> {
    const { title, description, location, bannerUrl, eventDate, userId } =
      request;

    // A própria entidade valida as regras de domínio no construtor
    const event = new Event({
      title,
      description,
      location,
      bannerUrl,
      eventDate,
      userId,
    });

    await this.eventRepository.create(event);

    return { event };
  }
}
