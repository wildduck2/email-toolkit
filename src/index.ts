export * from "./Base64";
export * from "./EmailBuilder";
export * from "./EmailValidator";
export * from "./EmailBiulderHeader";
export * from "./EmailBuilderAttachment";
export * from "./Error";
export * from "./zod";

// import { Base64 } from "./Base64";
// import { EmailBuilderHeader } from "./EmailBiulderHeader";
// import { EmailBuilder } from "./EmailBuilder";
// import { EmailBuilderAttachment } from "./EmailBuilderAttachment/EmailBuilderAttachment";
// const header = new EmailBuilderHeader();
// header
//   .setFrom("ahmed <ahmed@gmail.com>")
//   .setTo("ahmed <ahmed@gmail.com>")
//   .setCc("ahmed <ahmed@gmai.com>")
//   .setBcc("ahmed <ahmed@gmai.com>")
//   .setSubject("this is wild duck email test subject")
//   .setInReplyTo("ahmed@gmail.com")
//   .setMIMEVersion("1.0")
//   .setContentTransferEncoding("quoted-printable")
//   .setContentType("text/html")
//   .setCharset("utf8");
//
// const attachment = new EmailBuilderAttachment();
// attachment.addAttachment({
//   headers: {
//     "Content-Type": 'text/plain; charset="utf-8"',
//     "Content-Transfer-Encoding": "base64",
//     "Content-Disposition": 'attachment; filename="test.txt"',
//   },
//   size: 1234,
//   filename: "test.txt",
//   mimeType: "text/plain",
//   attachmentId: "1234",
//   attachmentContent: Base64.encodeToBase64("test"),
// });
// attachment.addAttachment({
//   headers: {
//     "Content-Type": 'text/plain; charset="utf-8"',
//     "Content-Transfer-Encoding": "base64",
//     "Content-Disposition": 'attachment; filename="test.txt"',
//   },
//   size: 1234,
//   filename: "test.txt",
//   mimeType: "text/plain",
//   attachmentId: "1234",
//   attachmentContent: Base64.encodeToBase64("test"),
// });
//
// // console.log(header.attachments);
//
// const email = new EmailBuilder();
// email.messagebody = "this is message body";
//
// const finalEmail = email.getRawMessage(header.headers, attachment.attachments);
// console.log(finalEmail);
