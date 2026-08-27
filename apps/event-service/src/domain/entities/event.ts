import { randomUUID } from "node:crypto";

export interface EventProps {
  id?: string;
  title: string;
  description: string;
  location: string;
  bannerUrl?: string | null;
  userId: string;
  status?: "DRAFT" | "PUBLISHED" | "CANCELED" | "FINISHED";
  eventDate: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UpdateEventProps {
  title?: string;
  description?: string;
  location?: string;
  bannerUrl?: string;
  eventDate?: Date;
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
  get userId(): string {
    return this.props.userId;
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
  get createdAt(): Date {
    return this.props.createdAt!;
  }
  get updatedAt(): Date {
    return this.props.updatedAt!;
  }

  toJSON(): EventProps {
    return { ...this.props };
  }

  // Métodos do Domínio para alterar estados
  public publish() {
    if (this.props.status === "CANCELED") {
      throw new Error("Cannot publish a canceled event");
    }
    if (this.props.status === "FINISHED") {
      throw new Error("Cannot publish a finished event");
    }
    this.props.status = "PUBLISHED";
  }

  public cancel(): void {
    this.props.status = "CANCELED";
    this.props.updatedAt = new Date();
  }

  update(props: UpdateEventProps) {
    if (this.props.status === "CANCELED") {
      throw new Error("Cannot update a canceled event");
    }
    if (this.props.status === "FINISHED") {
      throw new Error("Cannot update a finished event");
    }

    if (props.title !== undefined) this.props.title = props.title;
    if (props.description !== undefined)
      this.props.description = props.description;
    if (props.location !== undefined) this.props.location = props.location;
    if (props.bannerUrl !== undefined) this.props.bannerUrl = props.bannerUrl;
    if (props.eventDate !== undefined) this.props.eventDate = props.eventDate;

    this.props.updatedAt = new Date();
  }
}
