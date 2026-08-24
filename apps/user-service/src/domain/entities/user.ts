export interface UserProps {
  id?: string;
  name: string;
  email: string;
  password: string;
  role?: 'USER' | 'ADMIN';
  createdAt?: Date;
  updatedAt?: Date;
}

export class User {
  private props: UserProps;

  constructor(props: UserProps) {
    this.props = {
      ...props,
      id: props.id ?? crypto.randomUUID(),
      role: props.role ?? 'USER',
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
    };
  }

  get id(): string { return this.props.id!; }
  get name(): string { return this.props.name; }
  get email(): string { return this.props.email; }
  get password(): string { return this.props.password; }
  get role(): 'USER' | 'ADMIN' { return this.props.role!; }
  get createdAt(): Date { return this.props.createdAt!; }
  get updatedAt(): Date { return this.props.updatedAt!; }
}