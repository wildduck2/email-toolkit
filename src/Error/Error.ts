import type { EmailErrorInterface } from "./Error.types";

/**
 * Custom error class for handling email-related errors.
 * This class extends the built-in `Error` class and implements the `EmailErrorInterface`.
 * It provides additional details about the error through a `description` property.
 *
 * @class
 * @implements {EmailErrorInterface}
 */
export class EmailError extends Error implements EmailErrorInterface {
  /**
   * The name of the error. It is set to the provided message.
   *
   * @type {string}
   */
  name: string;

  /**
   * A description of the error providing additional context.
   * Initialized as an empty string and set via the constructor.
   *
   * @type {string}
   */
  description: string = "";

  /**
   * Creates an instance of `EmailError`.
   * Initializes the error with a message and a description.
   *
   * @param {Object} params - The parameters to initialize the error.
   * @param {string} params.message - The message describing the error.
   * @param {string} params.description - A detailed description of the error.
   */
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
