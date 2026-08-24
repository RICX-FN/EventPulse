import { TicketStatus } from "../../../generated/prisma/enums";
import { PrismaClient } from "../../../generated/prisma/client";
import {
  TicketRepository,
  CreateTicketsDTO,
} from "../../../domain/repositories/ticket-repository.interface";

export class PrismaTicketRepository implements TicketRepository {
  constructor(private prisma: PrismaClient) {}

  async createMany({ eventId, quantity, price }: CreateTicketsDTO) {
    const tickets = Array.from({ length: quantity }, () => ({
      eventId,
      price,
      status: TicketStatus.AVAILABLE,
      version: 0,
    }));

    return await this.prisma.ticket.createMany({
      data: tickets,
    });
  }
}
