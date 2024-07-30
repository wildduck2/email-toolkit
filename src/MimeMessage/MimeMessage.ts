import { Base64 } from "../Base64";
import { MIMEError } from "../Error";
import type {
    AttachmentOptions,
    Boundaries,
    ContentOptions,
    Email,
    MailboxAddrObject,
    MailboxAddrText,
    MailboxClass,
    MailboxType,
} from "../index.types";
import { Mailbox } from "../Mailbox";
import { MIMEMessageHeader } from "../MailboxHeader";
import { MIMEMessageContent } from "../MimeMessageContent";
import type { MIMEMessageClass } from "./MimeMessage.types";

/**
 * Represents a MIME (Multipurpose Internet Mail Extensions) message.
 * This class is responsible for constructing and encoding MIME messages, handling headers, content, and attachments.
 */
export class MIMEMessage implements MIMEMessageClass {
    /**
     * The headers of the MIME message.
     * @type {MIMEMessageHeader}
     */
    headers: MIMEMessageHeader;

    /**
     * The boundaries used to separate different parts of the MIME message.
     * @type {Boundaries}
     */
    boundaries: Boundaries = { mixed: "", alt: "", related: "" };

    /**
     * List of valid MIME content types.
     * @type {string[]}
     */
    validTypes: string[] = ["text/html", "text/plain"];

    /**
     * List of valid content transfer encodings.
     * @type {string[]}
     */
    validContentTransferEncodings: string[] = [
        "7bit",
        "8bit",
        "binary",
        "quoted-printable",
        "base64",
    ];

    /**
     * Array of MIME message contents (text, HTML, attachments).
     * @type {MIMEMessageContent[]}
     */
    messages: MIMEMessageContent[] = [];

    /**
     * Constructs a new MIMEMessage instance and initializes boundaries.
     */
    constructor() {
        this.headers = new MIMEMessageHeader();
        this.messages = [];
        this.generateBoundaries();
    }

    /**
     * Generates and returns the raw MIME message as a string.
     * @returns {string} The raw MIME message.
     * @throws {MIMEError} Throws an error if no content is added to the message.
     */
    asRaw(): string {
        const eol = "\r\n";
        const lines = this.headers.dump();
        const plaintext = this.getMessageByType("text/plain");
        const html = this.getMessageByType("text/html");
        const primaryMessage = html ? html : plaintext ? plaintext : undefined;
        if (primaryMessage === undefined) {
            throw new MIMEError(
                "MIMETEXT_MISSING_BODY",
                "No content added to the message."
            );
        }
        const hasAttachments = this.hasAttachments();
        const hasInlineAttachments = this.hasInlineAttachments();
        const structure =
            hasInlineAttachments && hasAttachments
                ? "mixed+related"
                : hasAttachments
                    ? "mixed"
                    : hasInlineAttachments
                        ? "related"
                        : plaintext && html
                            ? "alternative"
                            : "";
        if (structure === "mixed+related") {
            const attachments = this.getAttachments()
                .map((a) => "--" + this.boundaries.mixed + eol + a.dump() + eol + eol)
                .join("")
                .slice(0, -1 * eol.length);
            const inlineAttachments = this.getInlineAttachments()
                .map((a) => "--" + this.boundaries.related + eol + a.dump() + eol + eol)
                .join("")
                .slice(0, -1 * eol.length);
            return (
                lines +
                eol +
                "Content-Type: multipart/mixed; boundary=" +
                this.boundaries.mixed +
                eol +
                eol +
                "--" +
                this.boundaries.mixed +
                eol +
                "Content-Type: multipart/related; boundary=" +
                this.boundaries.related +
                eol +
                eol +
                this.dumpTextContent(plaintext, html, this.boundaries.related) +
                eol +
                eol +
                inlineAttachments +
                "--" +
                this.boundaries.related +
                "--" +
                eol +
                attachments +
                "--" +
                this.boundaries.mixed +
                "--"
            );
        } else if (structure === "mixed") {
            const attachments = this.getAttachments()
                .map((a) => "--" + this.boundaries.mixed + eol + a.dump() + eol + eol)
                .join("")
                .slice(0, -1 * eol.length);
            return (
                lines +
                eol +
                "Content-Type: multipart/mixed; boundary=" +
                this.boundaries.mixed +
                eol +
                eol +
                this.dumpTextContent(plaintext, html, this.boundaries.mixed) +
                eol +
                (plaintext && html ? "" : eol) +
                attachments +
                "--" +
                this.boundaries.mixed +
                "--"
            );
        } else if (structure === "related") {
            const inlineAttachments = this.getInlineAttachments()
                .map((a) => "--" + this.boundaries.related + eol + a.dump() + eol + eol)
                .join("")
                .slice(0, -1 * eol.length);
            return (
                lines +
                eol +
                "Content-Type: multipart/related; boundary=" +
                this.boundaries.related +
                eol +
                eol +
                this.dumpTextContent(plaintext, html, this.boundaries.related) +
                eol +
                eol +
                inlineAttachments +
                "--" +
                this.boundaries.related +
                "--"
            );
        } else if (structure === "alternative") {
            return (
                lines +
                eol +
                "Content-Type: multipart/alternative; boundary=" +
                this.boundaries.alt +
                eol +
                eol +
                this.dumpTextContent(plaintext, html, this.boundaries.alt) +
                eol +
                eol +
                "--" +
                this.boundaries.alt +
                "--"
            );
        } else {
            return lines + eol + primaryMessage.dump();
        }
    }

    /**
     * Encodes the MIME message into Base64 format.
     * @returns {string} The Base64 encoded MIME message.
     */
    asEncoded(): string {
        return Base64.toBufferURI(this.asRaw());
    }

    /**
     * Dumps text content as a string formatted with multipart boundaries.
     * @param {MIMEMessageContent | undefined} plaintext The plain text message content.
     * @param {MIMEMessageContent | undefined} html The HTML message content.
     * @param {string} boundary The boundary string for separating parts.
     * @returns {string} The formatted text content.
     */
    dumpTextContent(
        plaintext: MIMEMessageContent | undefined,
        html: MIMEMessageContent | undefined,
        boundary: string
    ): string {
        const eol = "\r\n";
        const primaryMessage = (html ? html : plaintext) as MIMEMessageContent;
        let data = "";
        if (
            plaintext &&
            html &&
            !this.hasInlineAttachments() &&
            this.hasAttachments()
        )
            data =
                "--" +
                boundary +
                eol +
                "Content-Type: multipart/alternative; boundary=" +
                this.boundaries.alt +
                eol +
                eol +
                "--" +
                this.boundaries.alt +
                eol +
                plaintext.dump() +
                eol +
                eol +
                "--" +
                this.boundaries.alt +
                eol +
                html.dump() +
                eol +
                eol +
                "--" +
                this.boundaries.alt +
                "--";
        else if (plaintext && html && this.hasInlineAttachments())
            data = "--" + boundary + eol + html.dump();
        else if (plaintext && html)
            data =
                "--" +
                boundary +
                eol +
                plaintext.dump() +
                eol +
                eol +
                "--" +
                boundary +
                eol +
                html.dump();
        else data = "--" + boundary + eol + primaryMessage!.dump();
        return data;
    }

    /**
     * Checks if the MIME message contains inline attachments.
     * @returns {boolean} True if there are inline attachments, false otherwise.
     */
    hasInlineAttachments(): boolean {
        return this.messages.some((msg) => msg.isInlineAttachment());
    }

    /**
     * Checks if the MIME message contains any attachments.
     * @returns {boolean} True if there are attachments, false otherwise.
     */
    hasAttachments(): boolean {
        return this.messages.some((msg) => msg.isAttachment());
    }

    /**
     * Retrieves all attachments from the MIME message.
     * @returns {MIMEMessageContent[]} Array of MIME message contents that are attachments.
     */
    getAttachments(): MIMEMessageContent[] {
        const matcher = (msg: MIMEMessageContent) => msg.isAttachment();
        return this.messages.some(matcher) ? this.messages.filter(matcher) : [];
    }

    /**
     * Retrieves all inline attachments from the MIME message.
     * @returns {MIMEMessageContent[]} Array of MIME message contents that are inline attachments.
     */
    getInlineAttachments(): MIMEMessageContent[] {
        const matcher = (msg: MIMEMessageContent) => msg.isInlineAttachment();
        return this.messages.some(matcher) ? this.messages.filter(matcher) : [];
    }

    /**
     * Retrieves the message content of a specific MIME type (text/plain or text/html).
     * @param {string} type The MIME type to filter by (e.g., "text/plain" or "text/html").
     * @returns {MIMEMessageContent | undefined} The MIME message content of the specified type, or undefined if not found.
     */
    getMessageByType(type: string): MIMEMessageContent | undefined {
        const matcher = (msg: MIMEMessageContent) =>
            !msg.isAttachment() &&
            !msg.isInlineAttachment() &&
            (msg.getHeader("Content-Type") || "").includes(type);
        return this.messages.some(matcher)
            ? this.messages.filter(matcher)[0]
            : undefined;
    }

    /**
     * Adds an attachment to the MIME message.
     * @param {AttachmentOptions} opts The options for the attachment, including data, filename, and headers.
     * @returns {MIMEMessageContent} The MIME message content representing the attachment.
     * @throws {MIMEError} Throws an error if the filename is missing or if the content type is invalid.
     */
    addAttachment(opts: AttachmentOptions): MIMEMessageContent {
        if (!this.isObject(opts.headers)) opts.headers = {};
        if (typeof opts.filename !== "string") {
            throw new MIMEError(
                "MIMETEXT_MISSING_FILENAME",
                "The property filename must exist while adding attachments."
            );
        }
        let type = opts.headers["Content-Type"] || opts.contentType || "none";
        if (type.length === 0) {
            throw new MIMEError(
                "MIMETEXT_INVALID_MESSAGE_TYPE",
                `You specified an invalid content type "${type}".`
            );
        }
        const encoding =
            opts.headers["Content-Transfer-Encoding"] || opts.encoding || "base64";
        if (!this.validContentTransferEncodings.includes(encoding)) {
            type = "application/octet-stream";
        }
        const contentId = opts.headers["Content-ID"];
        if (
            typeof contentId === "string" &&
            contentId.length > 2 &&
            contentId.slice(0, 1) !== "<" &&
            contentId.slice(-1) !== ">"
        ) {
            opts.headers["Content-ID"] = "<" + opts.headers["Content-ID"] + ">";
        }
        const disposition = opts.inline ? "inline" : "attachment";
        opts.headers = Object.assign({}, opts.headers, {
            "Content-Type": `${type}; name="${opts.filename}"`,
            "Content-Transfer-Encoding": encoding,
            "Content-Disposition": `${disposition}; filename="${opts.filename}"`,
        });
        return this._addMessage({ data: opts.data, headers: opts.headers });
    }

    /**
     * Adds a message (text or HTML content) to the MIME message.
     * @param {ContentOptions} opts The options for the content, including data, type, and headers.
     * @returns {MIMEMessageContent} The MIME message content representing the added message.
     * @throws {MIMEError} Throws an error if the content type is invalid.
     */
    addMessage(opts: ContentOptions): MIMEMessageContent {
        if (!this.isObject(opts.headers)) opts.headers = {};
        let type = opts.headers["Content-Type"] || opts.contentType || "none";
        if (!this.validTypes.includes(type)) {
            throw new MIMEError(
                "MIMETEXT_INVALID_MESSAGE_TYPE",
                `Valid content types are ${this.validTypes.join(
                    ", "
                )} but you specified "${type}".`
            );
        }
        const encoding =
            opts.headers["Content-Transfer-Encoding"] || opts.encoding || "7bit";
        if (!this.validContentTransferEncodings.includes(encoding)) {
            type = "application/octet-stream";
        }
        const charset = opts.charset || "UTF-8";
        opts.headers = Object.assign({}, opts.headers, {
            "Content-Type": `${type}; charset=${charset}`,
            "Content-Transfer-Encoding": encoding,
        });
        return this._addMessage({ data: opts.data, headers: opts.headers });
    }

    /**
     * Internal method to add a MIME message content to the array of messages.
     * @param {any} opts The options for the message, including data and headers.
     * @returns {MIMEMessageContent} The MIME message content added.
     */
    _addMessage(opts: any): MIMEMessageContent {
        const msg = new MIMEMessageContent(opts.data, opts.headers);
        this.messages.push(msg);
        return msg;
    }

    /**
     * Sets the sender of the MIME message.
     * @param {MailboxAddrObject | MailboxAddrText | Email} input The sender's address.
     * @param {Object} config Configuration object.
     * @param {MailboxType} config.type The type of mailbox (e.g., "From").
     * @returns {MailboxClass} The mailbox instance representing the sender.
     */
    setSender(
        input: MailboxAddrObject | MailboxAddrText | Email,
        config: { type: MailboxType } = { type: "From" }
    ): MailboxClass {
        const mailbox = new Mailbox(input, config);
        this.setHeader("From", mailbox);
        return mailbox as MailboxClass;
    }

    /**
     * Retrieves the sender of the MIME message.
     * @returns {MailboxClass | undefined | string} The sender's mailbox instance, or undefined if not set.
     */
    getSender(): MailboxClass | undefined | string {
        return this.getHeader("From");
    }

    /**
     * Sets the recipients of the MIME message.
     * @param {MailboxAddrObject | MailboxAddrText | Email} input The recipient's address.
     * @param {Object} config Configuration object.
     * @param {MailboxType} config.type The type of mailbox (e.g., "To", "Cc").
     * @returns {MailboxClass[]} Array of mailbox instances representing the recipients.
     */
    setRecipients(
        input: MailboxAddrObject | MailboxAddrText | Email,
        config: { type: MailboxType } = { type: "To" }
    ): MailboxClass[] {
        const arr = !this.isArray(input) ? [input] : input;
        const recs = arr.map((_input: any) => new Mailbox(_input, config));
        this.setHeader(config.type, recs);
        return recs as MailboxClass[];
    }

    /**
     * Retrieves the recipients of the MIME message.
     * @param {Object} config Configuration object.
     * @param {MailboxType} config.type The type of mailbox (e.g., "To").
     * @returns {MailboxClass | MailboxClass[] | undefined} The recipient(s) as mailbox instances, or undefined if not set.
     */
    getRecipients(
        config: { type: MailboxType } = { type: "To" }
    ): MailboxClass | MailboxClass[] | undefined {
        return this.getHeader(config.type) as unknown as
            | MailboxClass
            | MailboxClass[]
            | undefined;
    }

    /**
     * Sets a single recipient (usually for "To" field).
     * @param {string} input The recipient's address.
     * @returns {MailboxClass[]} Array of mailbox instances representing the recipient.
     */
    setRecipient(input: string): MailboxClass[] {
        return this.setRecipients(input, { type: "To" });
    }

    /**
     * Sets the "To" recipients of the MIME message.
     * @param {string} input The recipient's address.
     * @returns {MailboxClass[]} Array of mailbox instances representing the recipients.
     */
    setTo(input: string): MailboxClass[] {
        return this.setRecipients(input, { type: "To" });
    }

    /**
     * Sets the "Cc" recipients of the MIME message.
     * @param {string} input The recipient's address.
     * @returns {MailboxClass[]} Array of mailbox instances representing the recipients.
     */
    setCc(input: string): MailboxClass[] {
        return this.setRecipients(input, { type: "Cc" });
    }

    /**
     * Sets the "Reply-To" recipients of the MIME message.
     * @param {string} input The recipient's address.
     * @returns {MailboxClass[]} Array of mailbox instances representing the recipients.
     */
    setReplyTo(input: string): MailboxClass[] {
        return this.setRecipients(input, { type: "Reply-To" });
    }

    /**
     * Sets the "Bcc" recipients of the MIME message.
     * @param {string} input The recipient's address.
     * @returns {MailboxClass[]} Array of mailbox instances representing the recipients.
     */
    setBcc(input: string): MailboxClass[] {
        return this.setRecipients(input, { type: "Bcc" });
    }

    /**
     * Retrieves the "To" recipients of the MIME message.
     * @returns {MailboxClass[] | undefined} Array of mailbox instances representing the "To" recipients, or undefined if not set.
     */
    setSubject(value: string): string {
        this.setHeader("subject", value);
        return value;
    }

    /**
     * Retrieves the "Cc" recipients of the MIME message.
     * @returns {MailboxClass[] | undefined} Array of mailbox instances representing the "Cc" recipients, or undefined if not set.
     */
    getSubject(): string {
        return this.getHeader("subject") as string;
    }

    /**
     * Sets a header for the MIME message.
     * @param {string} name The name of the header.
     * @param {unknown} value The value of the header.
     * @returns {string} The name of the header that was set.
     */
    setHeader(name: string, value: unknown): string {
        this.headers.set(name, value);
        return name;
    }

    /**
     * Retrieves a header value from the MIME message.
     * @param {string} name The name of the header to retrieve.
     * @returns {string} The value of the header.
     */
    getHeader(name: string): string {
        return this.headers.get(name) as string;
    }

    /**
     * Sets multiple headers for the MIME message.
     * @param {Record<string, unknown>} obj An object containing header names and values.
     * @returns {string[]} An array of header names that were set.
     */
    setHeaders(obj: Record<string, unknown>): string[] {
        return Object.keys(obj).map((prop) => this.setHeader(prop, obj[prop]));
    }

    /**
     * Retrieves all headers of the MIME message as an object.
     * @returns {Record<string, string>} An object containing all headers.
     */
    getHeaders(): Record<string, string> {
        return this.headers.toObject();
    }

    /**
     * Generates unique boundary strings for different parts of the MIME message.
     */
    generateBoundaries(): void {
        this.boundaries = {
            mixed: Math.random().toString(36).slice(2),
            alt: Math.random().toString(36).slice(2),
            related: Math.random().toString(36).slice(2),
        };
    }

    /**
     * Checks if a value is an array.
     * @param {unknown} v The value to check.
     * @returns {boolean} True if the value is an array, false otherwise.
     */
    isArray(v: unknown): v is Array<unknown> {
        return !!v && v.constructor === Array;
    }

    /**
     * Checks if a value is an object.
     * @param {unknown} v The value to check.
     * @returns {boolean} True if the value is an object, false otherwise.
     */
    isObject(v: unknown): v is Object {
        return !!v && v.constructor === Object;
    }
}
