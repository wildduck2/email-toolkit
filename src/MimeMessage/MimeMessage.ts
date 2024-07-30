import { Base64 } from "../Base64";
import { MIMEError } from "../Error";
import type {
    AttachmentOptions,
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

export class MIMEMessage implements MIMEMessageClass {
    headers;
    boundaries = { mixed: "", alt: "", related: "" };
    validTypes = ["text/html", "text/plain"];
    validContentTransferEncodings = [
        "7bit",
        "8bit",
        "binary",
        "quoted-printable",
        "base64",
    ];
    messages: MIMEMessageContent[] = [];
    constructor() {
        this.headers = new MIMEMessageHeader();
        this.messages = [];
        this.generateBoundaries();
    }

    asRaw() {
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

    asEncoded(): string {
        return Base64.toBufferURI(this.asRaw());
    }

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

    hasInlineAttachments(): boolean {
        return this.messages.some((msg) => msg.isInlineAttachment());
    }

    hasAttachments(): boolean {
        return this.messages.some((msg) => msg.isAttachment());
    }

    getAttachments(): MIMEMessageContent[] {
        const matcher = (msg: MIMEMessageContent) => msg.isAttachment();
        return this.messages.some(matcher) ? this.messages.filter(matcher) : [];
    }

    getInlineAttachments(): MIMEMessageContent[] {
        const matcher = (msg: MIMEMessageContent) => msg.isInlineAttachment();
        return this.messages.some(matcher) ? this.messages.filter(matcher) : [];
    }

    getMessageByType(type: string): MIMEMessageContent | undefined {
        const matcher = (msg: MIMEMessageContent) =>
            !msg.isAttachment() &&
            !msg.isInlineAttachment() &&
            (msg.getHeader("Content-Type") || "").includes(type);
        return this.messages.some(matcher)
            ? this.messages.filter(matcher)[0]
            : undefined;
    }

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

    _addMessage(opts: any): MIMEMessageContent {
        const msg = new MIMEMessageContent(opts.data, opts.headers);
        this.messages.push(msg);
        return msg;
    }

    setSender(
        input: MailboxAddrObject | MailboxAddrText | Email,
        config: { type: MailboxType } = { type: "From" }
    ): MailboxClass {
        const mailbox = new Mailbox(input, config);
        this.setHeader("From", mailbox);
        return mailbox as MailboxClass;
    }

    getSender(): MailboxClass | undefined | string {
        return this.getHeader("From");
    }

    setRecipients(
        input: MailboxAddrObject | MailboxAddrText | Email,
        config: { type: MailboxType } = { type: "To" }
    ): MailboxClass[] {
        const arr = !this.isArray(input) ? [input] : input;
        const recs = arr.map((_input: any) => new Mailbox(_input, config));
        this.setHeader(config.type, recs);
        return recs as MailboxClass[];
    }

    getRecipients(
        config = { type: "To" }
    ): MailboxClass | MailboxClass[] | undefined {
        return this.getHeader(config.type) as unknown as
            | MailboxClass
            | MailboxClass[]
            | undefined;
    }

    setRecipient(input: string): MailboxClass[] {
        return this.setRecipients(input, { type: "To" });
    }

    setTo(input: string): MailboxClass[] {
        return this.setRecipients(input, { type: "To" });
    }

    setCc(input: string): MailboxClass[] {
        return this.setRecipients(input, { type: "Cc" });
    }

    setReplyTo(input: string): MailboxClass[] {
        return this.setRecipients(input, { type: "Reply-To" });
    }

    setBcc(input: string): MailboxClass[] {
        return this.setRecipients(input, { type: "Bcc" });
    }

    setSubject(value: string): string {
        this.setHeader("subject", value);
        return value;
    }

    getSubject(): string {
        return this.getHeader("subject") as string;
    }

    setHeader(name: string, value: unknown) {
        this.headers.set(name, value);
        return name;
    }

    getHeader(name: string): string {
        return this.headers.get(name) as string;
    }

    setHeaders(obj: Record<string, unknown>) {
        return Object.keys(obj).map((prop) => this.setHeader(prop, obj[prop]));
    }

    getHeaders() {
        return this.headers.toObject();
    }

    generateBoundaries() {
        this.boundaries = {
            mixed: Math.random().toString(36).slice(2),
            alt: Math.random().toString(36).slice(2),
            related: Math.random().toString(36).slice(2),
        };
    }

    isArray(v: unknown): v is Array<unknown> {
        return !!v && v.constructor === Array;
    }

    isObject(v: unknown): v is Object {
        return !!v && v.constructor === Object;
    }
}
