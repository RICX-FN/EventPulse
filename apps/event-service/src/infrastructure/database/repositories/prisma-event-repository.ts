import { PrismaClient } from "../../../generated/prisma/client";
import { Event } from "../../../domain/entities/event";
import { EventRepository } from "../../../domain/repositories/event-repository";

export class PrismaEventRepository implements EventRepository {
  constructor(private prisma: PrismaClient) {}

  async create(event: Event): Promise<void> {
    await this.prisma.event.create({
      data: {
        id: event.id,
        title: event.title,
        description: event.description,
        location: event.location,
        bannerUrl: event.bannerUrl,
        status: event.status as "DRAFT" | "PUBLISHED" | "CANCELED" | "FINISHED",
        eventDate: event.eventDate,
      },
    });
  }

  async findById(id: string): Promise<Event | null> {
    const rawEvent = await this.prisma.event.findUnique({
      where: { id },
    });

    if (!rawEvent) return null;

    return new Event({
      id: rawEvent.id,
      title: rawEvent.title,
      description: rawEvent.description,
      location: rawEvent.location,
      bannerUrl: rawEvent.bannerUrl,
      status: rawEvent.status,
      eventDate: rawEvent.eventDate,
      createdAt: rawEvent.createdAt,
      updatedAt: rawEvent.updatedAt,
    });
  }

  async findAll(): Promise<Event[]> {
    const rawEvents = await this.prisma.event.findMany({
      orderBy: { createdAt: "desc" },
    });

    return rawEvents.map(
      (raw) =>
        new Event({
          id: raw.id,
          title: raw.title,
          description: raw.description,
          location: raw.location,
          bannerUrl: raw.bannerUrl,
          status: raw.status,
          eventDate: raw.eventDate,
          createdAt: raw.createdAt,
          updatedAt: raw.updatedAt,
        }),
    );
  }

  async save(event: Event): Promise<void> {
    await this.prisma.event.update({
      where: { id: event.id },
      data: {
        title: event.title,
        description: event.description,
        location: event.location,
        bannerUrl: event.bannerUrl,
        status: event.status as "DRAFT" | "PUBLISHED" | "CANCELED" | "FINISHED",
        eventDate: event.eventDate,
      },
    });
  }
}
