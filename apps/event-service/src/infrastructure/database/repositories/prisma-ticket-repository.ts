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

    return await this.prisma.ticket.createMany({ data: tickets });
  }

  async findAvailableTicket(eventId: string) {
    return await this.prisma.ticket.findFirst({
      where: {
        eventId,
        status: TicketStatus.AVAILABLE,
      },
    });
  }

  async reserveWithOptimisticLock({
    ticketId,
    version,
    userId,
    reservedUntil,
  }: {
    ticketId: string;
    version: number;
    userId: string;
    reservedUntil: Date;
  }): Promise<boolean> {
    // A chave do Optimistic Locking está no WHERE: [id + version]
    const result = await this.prisma.ticket.updateMany({
      where: {
        id: ticketId,
        version: version, // Garante que a versão não mudou entre o SELECT e o UPDATE
        status: TicketStatus.AVAILABLE,
      },
      data: {
        status: TicketStatus.RESERVED,
        reservedBy: userId,
        reservedUntil: reservedUntil,
        version: { increment: 1 }, // Incrementa a versão para invalidar leituras concorrentes
      },
    });

    // Se count === 1, a reserva funcionou. Se count === 0, outro processo alterou o bilhete primeiro!
    return result.count > 0;
  }

  async releaseExpiredReservations(): Promise<number> {
    const result = await this.prisma.ticket.updateMany({
      where: {
        status: TicketStatus.RESERVED,
        reservedUntil: {
          lt: new Date(), // Menor que o timestamp atual (já expirou)
        },
      },
      data: {
        status: TicketStatus.AVAILABLE,
        reservedBy: null,
        reservedUntil: null,
        version: { increment: 1 }, // Incrementa a versão por segurança
      },
    });

    return result.count;
  }

  async findById(ticketId: string) {
    return await this.prisma.ticket.findUnique({
      where: { id: ticketId },
    });
  }

  async markAsSold({
    ticketId,
    version,
    userId,
  }: {
    ticketId: string;
    version: number;
    userId: string;
  }): Promise<boolean> {
    const result = await this.prisma.ticket.updateMany({
      where: {
        id: ticketId,
        version: version, // Optimistic Locking
        status: TicketStatus.RESERVED,
        reservedBy: userId, // Garante que só quem reservou pode comprar
      },
      data: {
        status: TicketStatus.SOLD,
        reservedUntil: null, // Limpa o tempo limite de reserva
        version: { increment: 1 },
      },
    });

    return result.count > 0;
  }
}
