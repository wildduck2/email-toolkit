import type { MIMEErrorClass } from "./Error.types";

/**
 * Custom error class for handling MIME text errors.
 *
 * @extends {Error}
 */
export class MIMEError extends Error implements MIMEErrorClass {
    /**
     * @type {string}
     */
    name: string = "";

    /**
     * @type {string}
     */
    description: string = "";

    /**
     * Creates an instance of MIMETextError.
     *
     * @param {string} message - The name of the error.
     * @param {string} [description=""] - A description providing more details about the error.
     */
    constructor(message: string, description: string = "") {
        super(description);
        this.name = message;
        this.description = description;
    }
}
