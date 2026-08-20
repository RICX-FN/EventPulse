import { randomUUID } from "node:crypto";

export interface EventProps {
  id?: string;
  title: string;
  description: string;
  location: string;
  bannerUrl?: string | null;
  status?: "DRAFT" | "PUBLISHED" | "CANCELED" | "FINISHED";
  eventDate: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Event {
  private props: EventProps;

  constructor(props: EventProps) {
    this.props = {
      ...props,
      id: props.id ?? randomUUID(), // Usando o randomUUID importado
      status: props.status ?? "DRAFT",
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
    };

    this.validate();
  }

  // Regra de Negócio de Validação
  private validate(): void {
    if (!this.props.title || this.props.title.trim().length < 3) {
      throw new Error("Event title must have at least 3 characters.");
    }

    if (this.props.eventDate < new Date()) {
      throw new Error("Event date cannot be in the past.");
    }
  }

  // Getters para encapsulamento
  get id(): string {
    return this.props.id!;
  }
  get title(): string {
    return this.props.title;
  }
  get description(): string {
    return this.props.description;
  }
  get location(): string {
    return this.props.location;
  }
  get bannerUrl(): string | null | undefined {
    return this.props.bannerUrl;
  }
  get status(): string {
    return this.props.status!;
  }
  get eventDate(): Date {
    return this.props.eventDate;
  }

  // Métodos do Domínio para alterar estados
  public publish(): void {
    this.props.status = "PUBLISHED";
    this.props.updatedAt = new Date();
  }

  public cancel(): void {
    this.props.status = "CANCELED";
    this.props.updatedAt = new Date();
  }
  
}
