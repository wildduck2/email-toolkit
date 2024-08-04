import { Base64 } from "./Base64";
import { EmailBuilderHeader } from "./EmailBiulderHeader/EmailBuilderHeader";

export * from "./Base64";
export * from "./Error";
export * from "./EmailBuilder";

import { EmailBuilder } from "./EmailBuilder";

const header = new EmailBuilderHeader();
header
  .setFrom("ahmed <ahmed@gmail.com>")
  .setTo("ahmed <ahmed@gmail.com>")
  .setCc("ahmed <ahmed@gmai.com>")
  .setBcc("ahmed <ahmed@gmai.com>")
  .setSubject("this is wild duck email test subject")
  .setInReplyTo("ahmed@gmail.com")
  .setMIMEVersion("1.0")
  .setContentTransferEncoding("quoted-printable")
  .setContentType("text/html")
  .setCharset("utf8");

console.log(header.getHeaders());

// const foo = new EmailBuilder()
//   .addMessage({
//     headers: {
//       Date: "Wed, 31 Jul 2024 13:39:10 GMT",
//       From: "wildduck2/email-builder <email-builder@noreply.github.com>",
//       To: "Ahmed Ayob <notifications@github.com>",
//       Cc: "Ahmed Ayob <notifications@github.com>",
//       Bcc: "Ahmed Ayob <notifications@github.com>",
//       "Message-Id": "19108cbf60f51f1a",
//       Subject: "RE: [wildduck/email-builder] Run failed: CI - main (b682de3)",
//       "In-Reply-To": "19108cbf60f51f1a",
//       "Content-Type": "text/html",
//       "Content-Transfer-Encoding": "base64",
//     },
//     data: "<p>asdf</p>",
//   })
//   .asRaw();
//
// console.log(foo);
