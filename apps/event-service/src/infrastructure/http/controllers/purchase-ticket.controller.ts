import { Request, Response } from "express";
import { PurchaseTicketUseCase } from "../../../use-cases/purchase-ticket";

export class PurchaseTicketController {
  constructor(private purchaseTicketUseCase: PurchaseTicketUseCase) {}

  async handle(req: Request, res: Response): Promise<Response> {
    const { ticketId } = req.params;
    const userId = req.user?.id;

    if (typeof ticketId !== "string") {
      return res.status(400).json({ error: "Invalid ticket ID." });
    }

    if (!userId) {
      return res.status(401).json({ error: "User non-authenticated." });
    }

    try {
      const result = await this.purchaseTicketUseCase.execute({
        ticketId,
        userId,
      });
      return res.status(200).json(result);
    } catch (error: any) {
      const status =
        error.message.includes("Conflict") ||
        error.message.includes("Unauthorized")
          ? 409
          : 400;
      return res.status(status).json({ error: error.message });
    }
  }
}
