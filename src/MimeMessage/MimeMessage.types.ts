import type {
    AttachmentOptions,
    Boundaries,
    ContentOptions,
    Email,
    MailboxClass,
    MailboxAddrObject,
    MailboxAddrText,
    MailboxType,
} from "../index.types";
import type { MIMEMessageHeader } from "../MailboxHeader";
import type { MIMEMessageContent } from "../MimeMessageContent";

export interface MIMEMessageClass {
    headers: MIMEMessageHeader;
    boundaries: Boundaries;
    validTypes: string[];
    validContentTransferEncodings: string[];
    messages: MIMEMessageContent[];
    asRaw(): string;
    asEncoded(): string;
    dumpTextContent(
        plaintext: MIMEMessageContent | undefined,
        html: MIMEMessageContent | undefined,
        boundary: string
    ): string;
    hasInlineAttachments(): boolean;
    hasAttachments(): boolean;
    getAttachments(): MIMEMessageContent[] | [];
    getInlineAttachments(): MIMEMessageContent[] | [];
    getMessageByType(type: string): MIMEMessageContent | undefined;
    addAttachment(opts: AttachmentOptions): MIMEMessageContent;
    addMessage(opts: ContentOptions): MIMEMessageContent;
    _addMessage: any;
    setSender(
        input: MailboxAddrObject | MailboxAddrText | Email,
        config?: {
            type: MailboxType;
        }
    ): MailboxClass;
    getSender(): MailboxClass | undefined | string;
    setRecipients(
        input:
            | MailboxAddrObject
            | MailboxAddrText
            | Email
            | MailboxAddrObject[]
            | MailboxAddrText[]
            | Email[],
        config?: {
            type: MailboxType;
        }
    ): MailboxClass[];
    getRecipients(config?: {
        type: MailboxType;
    }): MailboxClass | MailboxClass[] | undefined;
    setRecipient(
        input:
            | MailboxAddrObject
            | MailboxAddrText
            | Email
            | MailboxAddrObject[]
            | MailboxAddrText[]
            | Email[]
    ): MailboxClass[];
    setTo(
        input:
            | MailboxAddrObject
            | MailboxAddrText
            | Email
            | MailboxAddrObject[]
            | MailboxAddrText[]
            | Email[]
    ): MailboxClass[];
    setCc(
        input:
            | MailboxAddrObject
            | MailboxAddrText
            | Email
            | MailboxAddrObject[]
            | MailboxAddrText[]
            | Email[]
    ): MailboxClass[];
    setReplyTo(
        input:
            | MailboxAddrObject
            | MailboxAddrText
            | Email
            | MailboxAddrObject[]
            | MailboxAddrText[]
            | Email[]
    ): MailboxClass[];
    setBcc(
        input:
            | MailboxAddrObject
            | MailboxAddrText
            | Email
            | MailboxAddrObject[]
            | MailboxAddrText[]
            | Email[]
    ): MailboxClass[];
    setSubject(value: string): string;
    getSubject(): string | MailboxClass;
    setHeader(name: string, value: any): string;
    getHeader(name: string): string | MailboxClass;
    setHeaders(obj: { [index: string]: string }): string[];
    getHeaders(): {
        [index: string]: any;
    };
    generateBoundaries(): void;
    isArray(v: unknown): v is any[];
    isObject(v: unknown): v is object;
}
