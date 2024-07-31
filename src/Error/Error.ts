import type { EmailErrorInterface } from "./Error.types";

export class EmailError extends Error implements EmailErrorInterface {
  name: string = "";

  description: string = "";

  constructor({
    message,
    description,
  }: {
    message: string;
    description: string;
  }) {
    super(description);
    this.name = message;
    this.description = description;
  }
}
