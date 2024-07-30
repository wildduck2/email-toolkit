import { MIMEMessageContentHeader } from "../MailboxHeader";
import type { MIMEMessageContentClass } from "./MimeMessageContent.types";

/**
 * Represents the content of a MIME message, including its headers and data.
 */
export class MIMEMessageContent implements MIMEMessageContentClass {
    headers: any;
    data;

    /**
     * Creates an instance of MIMEMessageContent.
     * @param {string} data - The content or body of the MIME message.
     * @param {{ [index: string]: string }} [headers={}] - Optional object containing headers to be set in the MIME message.
     */
    constructor(data: string, headers: { [index: string]: string } = {}) {
        this.headers = new MIMEMessageContentHeader();
        this.data = data;
        this.setHeaders(headers);
    }

    /**
     * Returns a string representation of the MIME message content.
     * The string includes the headers followed by two line breaks (end of headers) and then the content data.
     * @returns {string} The string representation of the MIME message content.
     */
    dump(): string {
        const eol = "\r\n";
        return this.headers.dump() + eol + eol + this.data;
    }

    /**
     * Checks if the content is an attachment by examining the Content-Disposition header.
     * @returns {boolean} True if the header includes the term "attachment", otherwise false.
     */
    isAttachment(): boolean {
        const disposition = this.headers.get("Content-Disposition");
        return (
            typeof disposition === "string" && disposition.includes("attachment")
        );
    }

    /**
     * Checks if the content is an inline attachment by examining the Content-Disposition header.
     * @returns {boolean} True if the header includes the term "inline", otherwise false.
     */
    isInlineAttachment(): boolean {
        const disposition = this.headers.get("Content-Disposition");
        return typeof disposition === "string" && disposition.includes("inline");
    }

    /**
     * Sets a header with the specified name and value.
     * @param {string} name - The name of the header to set.
     * @param {string} value - The value of the header to set.
     * @returns {string} The name of the header that was set.
     */
    setHeader(name: string, value: string): string {
        this.headers.set(name, value);
        return name;
    }

    /**
     * Retrieves the value of the specified header.
     * @param {string} name - The name of the header to retrieve.
     * @returns {string | undefined} The value of the specified header, or undefined if the header is not set.
     */
    getHeader(name: string): string | undefined {
        return this.headers.get(name);
    }

    /**
     * Sets multiple headers using an object where the keys are header names and the values are header values.
     * @param {{ [index: string]: string }} obj - An object containing headers to be set.
     * @returns {string[]} Array of header names that were set.
     */
    setHeaders(obj: { [index: string]: string }): string[] {
        return Object.keys(obj).map((prop) => this.setHeader(prop, obj[prop]!));
    }

    /**
     * Returns an object representation of the headers.
     * @returns {{ [index: string]: string }} An object containing all headers as key-value pairs.
     */
    getHeaders(): { [index: string]: string } {
        return this.headers.toObject();
    }
}
