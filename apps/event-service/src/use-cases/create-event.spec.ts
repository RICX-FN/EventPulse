import { describe, beforeEach, it, expect } from "vitest";
import { CreateEventUseCase } from "./create-event";
import { InMemoryEventRepository } from "./repositories/in-memory-event-repository";

describe("CreateEventUseCase", () => {
  let eventRepository: InMemoryEventRepository;
  let sut: CreateEventUseCase; // SUT = System Under Test (Convenção de testes)

  beforeEach(() => {
    eventRepository = new InMemoryEventRepository();
    sut = new CreateEventUseCase(eventRepository);
  });

  it("should be able to create a new event", async () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 10);

    const { event } = await sut.execute({
      title: "Dev Conference 2026",
      description: "The best software engineering conference",
      location: "Luanda, Angola",
      eventDate: futureDate,
    });

    expect(event.id).toEqual(expect.any(String));
    expect(event.status).toBe("DRAFT");
    expect(eventRepository.items).toHaveLength(1);
    expect(eventRepository.items[0].title).toBe("Dev Conference 2026");
  });

  it("should not be able to create an event with a past date", async () => {
    const pastDate = new Date("2020-01-01");

    await expect(() =>
      sut.execute({
        title: "Old Conference",
        description: "Past event",
        location: "Luanda, Angola",
        eventDate: pastDate,
      }),
    ).rejects.toThrow("Event date cannot be in the past.");
  });
});
