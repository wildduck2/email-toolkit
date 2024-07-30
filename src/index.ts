import { MIMEMessage, type MIMEMessageClass } from "./MimeMessage";

export * from "./Base64";
export * from "./Error";
export * from "./Mailbox";
export * from "./MailboxHeader";
export * from "./MimeMessage";
export function createMimeMessage(): MIMEMessageClass {
    return new MIMEMessage();
}
