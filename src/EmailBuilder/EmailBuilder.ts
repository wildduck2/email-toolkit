import {
  type ApplicationSignature,
  type AttachmentType,
  type EmailBuilderClass,
} from "./EmailBuilder.types";
import { EmailBuilderUtils } from "./EmailBuilderUtils";
import type { HeadersType } from "../EmailBiulderHeader";
import { Base64 } from "../Base64";

export class EmailBuilder
  extends EmailBuilderUtils
  implements EmailBuilderClass
{
  messagebody: string = "";
  applicationSignature: ApplicationSignature | null = null;

  constructor() {
    super();
  }

  public getRawMessage(headers: HeadersType, attachments?: AttachmentType[]) {
    const MessageBody = this.formatMessageBody();

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
      MessageBody,
      ...Attachments,
      "--boundary--",
    ].join("\r\n");
    return headersString;
  }

  private formatMessageBody() {
    return Base64.encodeToBase64(this.messagebody);
  }
}
