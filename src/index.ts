import { EmailBuilder } from "./EmailBuilder";
import { MIMEMessage, type MIMEMessageClass } from "./MimeMessage";

export * from "./Base64";
export * from "./Error";
export * from "./Mailbox";
export * from "./MailboxHeader";
export * from "./MimeMessage";
export * from "./EmailBuilder";
export function createMimeMessage(): MIMEMessageClass {
  return new MIMEMessage();
}

new EmailBuilder();

// const msg = new MIMEMessage();
// msg.setSender({ name: "Lorem Ipsum", addr: "lorem@ipsum.com" });
// msg.setRecipient("foobor@test.com");
// msg.setSubject("🚀 Issue 49!");
// msg.addMessage({
//     contentType: "text/plain",
//     data: `Hi, I'm a simple text.`,
// });
//
// console.log(msg.asRaw());
//
// console.log(msg.getSender());
