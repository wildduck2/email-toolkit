import {
  type ApplicationSignature,
  type AttachmentType,
  type EmailBuilderClass,
  type GetSignatureType,
} from "./EmailBuilder.types";
import { EmailBuilderUtils } from "./EmailBuilderUtils";
import type { HeadersType } from "../EmailBiulderHeader";
import { Base64 } from "../Base64";
import { EmailError } from "../Error";
import { format } from "date-fns";

export class EmailBuilder
  extends EmailBuilderUtils
  implements EmailBuilderClass
{
  messagebody: string | null = null;
  applicationSignature: ApplicationSignature = {
    url: "https://github.com/wildduck2",
    name: "ahmed ayob",
  };

  constructor() {
    super();
  }

  public getRawMessage(headers: HeadersType, attachments?: AttachmentType[]) {
    const MessageBody = this.formatMessageBody();
    if (!this.messagebody) {
      return new EmailError({
        message: "MessageBody is missed",
        description: "The email message should contain a body",
      });
    }

    const MessagebodyString = [
      `<div contenteditable="true" style="outline: none;">`,
      `<div style="margin: 1rem">`,
      `---------------------------------`,
      `<p>From: ${headers.From}</p>`,
      `<p>Date: ${format(new Date(), "PPpp")}</p>`,
      `<p>Subject: ${headers.Subject}</p>`,
      `<p>To: ${headers.To}</p>`,
      `---------------------------------`,
      ``,
      `${MessageBody}`,
      ``,
      `</div>`,
      ``,
      this.getSignature({ from: headers.From, ...this.applicationSignature }),
    ].join("\r\n");

    const Attachments =
      attachments?.flatMap((attachment) => {
        return [
          ``,
          `--boundary`,
          `Content-Type: ${attachment.headers?.["Content-Type"]}`,
          `Content-Transfer-Encoding: ${attachment.headers?.["Content-Transfer-Encoding"]}`,
          `Content-Disposition: attachment; filename="${attachment.filename}"`,
          ``,
          attachment.attachmentContent,
          ``,
        ];
      }) || "";

    let headersString = [
      `To: ${headers.To}`,
      `From: ${headers.From}`,
      `Subject: ${headers.Subject}`,
      `Content-Type: multipart/mixed; boundary="boundary"`,
      "",
      "--boundary",
      `Content-Type: ${headers["Content-Type"]}`,
      `Content-Transfer-Encoding: ${headers["Content-Transfer-Encoding"]}`,
      "",
      Base64.encodeToBase64(MessagebodyString),
      ...Attachments,
      "--boundary--",
    ].join("\r\n");
    return headersString;
  }

  public getEncodedMessageBody() {
    return Base64.encodeToBase64(this.formatMessageBody());
  }
  public getSignature({ from, url, name }: GetSignatureType): string[] {
    return [
      ``,
      `</div>`,
      `<div style="margin: 1rem">`,
      `---------------------------------`,
      `<p>This email was sent from ${from} by <a style="color: blue" href="${url}" target="_blank">${name}</a> app</p>`,
      `---------------------------------`,
      `</div>`,
    ];
  }

  private formatMessageBody() {
    return Base64.encodeToBase64(this.messagebody);
  }
}
