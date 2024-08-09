import {
  type ApplicationSignature,
  type AttachmentType,
  type EmailBuilderClass,
  type GetSignatureType,
} from "./EmailBuilder.types";
import { Base64 } from "../Base64";
import { EmailError } from "../Error";
import { format } from "date-fns";
import type { HeadersType } from "../EmailBiulderHeader";

/**
 * Class representing an EmailBuilder.
 *
 * @implements {EmailBuilderClass}
 */
export class EmailBuilder implements EmailBuilderClass {
  /**
   * The body of the email message.
   * @type {string | null}
   */
  messagebody: string | null = null;

  /**
   * Application signature details.
   * @type {ApplicationSignature}
   */
  applicationSignature: ApplicationSignature = {
    url: "https://github.com/wildduck2",
    name: "ahmed ayob",
  };

  /**
   * Creates an instance of EmailBuilder.
   */
  constructor() {}

  /**
   * Generates the raw email message with headers and optional attachments.
   *
   * @param {HeadersType} headers - The headers for the email.
   * @param {AttachmentType[]} [attachments] - Optional attachments to include in the email.
   * @returns {string | EmailError} The raw email message or an EmailError if the message body is missing.
   */
  public getRawMessage(
    headers: HeadersType,
    attachments?: AttachmentType[]
  ): string | EmailError {
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
      MessagebodyString,
      ...Attachments,
      "--boundary--",
    ].join("\r\n");
    return headersString;
  }

  /**
   * Generates a base64-encoded email message from the provided headers and attachments.
   *
   * This method first constructs the raw email message using the provided headers and optional attachments.
   * If the raw message construction results in an `EmailError`, the method returns the error message.
   * Otherwise, it encodes the raw message in base64 format and returns it.
   *
   * @param headers - An object representing the email headers. Must conform to the `HeadersType` schema.
   * @param attachments - (Optional) An array of attachments to be included in the email. Each attachment must conform to the `AttachmentType` schema.
   * @returns The base64-encoded email message as a string, or an error message if an `EmailError` occurred.
   */
  public getEncodedMessage(
    headers: HeadersType,
    attachments?: AttachmentType[]
  ): string {
    const rawMessage = this.getRawMessage(headers, attachments);
    if (rawMessage instanceof EmailError) {
      return rawMessage.message;
    }
    return Base64.encodeToBase64(rawMessage);
  }

  /**
   * Encodes the message body in Base64 format.
   *
   * @returns {string} The encoded message body.
   */
  public getEncodedMessageBody(): string {
    return this.formatMessageBody();
  }

  /**
   * Generates the signature block for the email.
   *
   * @param {GetSignatureType} signatureDetails - An object containing the sender's email, application URL, and name.
   * @returns {string[]} The formatted signature block as an array of strings.
   */
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

  /**
   * Formats the message body and encodes it in Base64.
   *
   * @private
   * @returns {string} The formatted and encoded message body.
   */
  private formatMessageBody(): string {
    return Base64.encodeToBase64(this.messagebody as string);
  }
}
