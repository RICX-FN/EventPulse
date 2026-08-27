import cron from "node-cron";
import prisma from "../database/prisma";
import { PrismaTicketRepository } from "../database/repositories/prisma-ticket-repository";
import { ReleaseExpiredTicketsUseCase } from "../../use-cases/release-expired-tickets";

const ticketRepository = new PrismaTicketRepository(prisma);
const releaseExpiredTicketsUseCase = new ReleaseExpiredTicketsUseCase(
  ticketRepository,
);

export function startTicketExpirationJob() {
  // Executa a cada minuto (* * * * *)
  cron.schedule("* * * * *", async () => {
    try {
      await releaseExpiredTicketsUseCase.execute();
    } catch (error) {
      console.error(
        "[Cron Worker Error] Failed to release expired tickets:",
        error,
      );
    }
  });

  console.log("⏰ Ticket expiration cron job started.");
}
