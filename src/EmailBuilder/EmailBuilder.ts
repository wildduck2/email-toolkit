import {
  type ApplicationSignature,
  type AttachmentType,
  type EmailBuilderClass,
  type GetSignatureType,
  type NonNullableType,
} from "./EmailBuilder.types";
import { Base64 } from "../Base64";
import { EmailError } from "../Error";
import { format } from "date-fns";
import type { HeadersType } from "../EmailBiulderHeader";

/**
 * Class representing an `EmailBuilder`.
 *
 * This class is used for constructing and validating email headers, as well as generating email messages with optional attachments and signatures.
 * It implements the `EmailBuilderClass` interface, providing methods for setting various email headers and constructing raw or encoded email messages.
 *
 * @implements {EmailBuilderClass}
 */
export class EmailBuilder implements EmailBuilderClass {
  /**
   * The body of the email message.
   *
   * This property holds the content of the email message. It can be a string containing the message body or `null` if no body is set.
   *
   * @type {string | null}
   */
  messagebody: string | null = null;

  /**
   * Application signature details.
   *
   * This property contains the details for the email signature, including the URL and name associated with the application or service.
   *
   * @type {ApplicationSignature}
   */
  applicationSignature: Omit<ApplicationSignature, "from"> = {
    url: "https://github.com/wildduck2",
    name: "ahmed ayob",
  };

  /**
   * Creates an instance of the `EmailBuilder` class.
   *
   * The constructor initializes an instance of `EmailBuilder`, setting up default values for `messagebody` and `applicationSignature`.
   */
  constructor() {}

  /**
   * Generates the raw email message with headers and optional attachments.
   *
   * This method constructs the raw email message by combining the provided headers, message body, and any optional
   * attachments. It formats the email content as HTML and includes boundary markers for multipart content.
   * If the email message body is missing, it returns an `EmailError`.
   *
   * @param {HeadersType} headers - The headers for the email. This includes fields such as "To", "From", "Subject", etc.
   * @param {AttachmentType[]} [attachments] - Optional attachments to include in the email. Each attachment includes
   *   headers, content type, and content.
   * @returns {string | EmailError} The raw email message formatted as a string. If the message body is missing,
   *   returns an `EmailError` indicating that the message body is required.
   *
   * @example
   * const emailBuilder = new EmailBuilder();
   * emailBuilder.messagebody = "This is the body of the email.";
   * const rawMessage = emailBuilder.getRawMessage(
   *   {
   *     To: "recipient <recipient@example.com>",
   *     From: "sender <sender@example.com>",
   *     Subject: "Test Email",
   *     "Content-Type": "text/html",
   *     "Content-Transfer-Encoding": "quoted-printable"
   *   },
   *   [
   *     {
   *       headers: {
   *         "Content-Type": "text/plain; charset=\"utf-8\"",
   *         "Content-Transfer-Encoding": "base64",
   *         "Content-Disposition": "attachment; filename=\"test.txt\""
   *       },
   *       filename: "test.txt",
   *       attachmentContent: "dGVzdCBjb250ZW50"
   *     }
   *   ]
   * );
   * console.log(rawMessage);
   */
  public getRawMessage(
    headers: HeadersType,
    attachments?: AttachmentType[]
  ): string | EmailError {
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
      `${this.messagebody}`,
      ``,
      `</div>`,
      ``,
      this.getSignature({
        ...this.applicationSignature,
        from: headers.From,
      }),
      `</div>`,
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
   * If the raw message construction results in an `EmailError`, it returns the error message. Otherwise,
   * it encodes the raw message in base64 format and returns the encoded string.
   *
   * @param {HeadersType} headers - An object representing the email headers. This should include fields such as "To", "From", "Subject", etc.
   * @param {AttachmentType[]} [attachments] - Optional. An array of attachments to be included in the email. Each attachment should conform to the `AttachmentType` schema.
   * @returns {string} The base64-encoded email message as a string. If an `EmailError` occurred during raw message construction, the method returns the error message.
   *
   * @example
   * const emailBuilder = new EmailBuilder();
   * emailBuilder.messagebody = "This is the body of the email.";
   * const encodedMessage = emailBuilder.getEncodedMessage(
   *   {
   *     To: "recipient <recipient@example.com>",
   *     From: "sender <sender@example.com>",
   *     Subject: "Test Email",
   *     "Content-Type": "text/html",
   *     "Content-Transfer-Encoding": "quoted-printable"
   *   },
   *   [
   *     {
   *       headers: {
   *         "Content-Type": "text/plain; charset=\"utf-8\"",
   *         "Content-Transfer-Encoding": "base64",
   *         "Content-Disposition": "attachment; filename=\"test.txt\""
   *       },
   *       filename: "test.txt",
   *       attachmentContent: "dGVzdCBjb250ZW50"
   *     }
   *   ]
   * );
   * console.log(encodedMessage);
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
   * Generates the signature block for the email.
   *
   * This method creates a formatted signature block to be included in the email. The signature contains
   * information about the sender and the application used to send the email. It returns the signature block
   * as an array of strings, which can be included in the email body.
   *
   * @param {GetSignatureType} signatureDetails - An object containing the details for the signature. It should include:
   *   - `from`: The sender's email address.
   *   - `url`: The URL of the application used to send the email.
   *   - `name`: The name of the application.
   * @returns {string[]} An array of strings representing the formatted signature block.
   *
   * @example
   * const signature = emailBuilder.getSignature({
   *   from: "sender@example.com",
   *   url: "https://example.com",
   *   name: "ExampleApp"
   * });
   * console.log(signature.join("\n"));
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
   * Sets the signature details for the email.
   *
   * This method updates the `applicationSignature` property with the provided URL and name.
   * The `url` and `name` parameters must be non-nullable and are used to personalize the email signature.
   *
   * @param {Object} params - The signature details.
   * @param {string} params.url - The URL associated with the email signature, such as the website or application URL.
   * @param {string} params.name - The name associated with the email signature, such as the name of the application or service.
   * @returns {this}
   *
   * @example
   * emailBuilder.setSignature({
   *   url: "https://example.com",
   *   name: "ExampleApp"
   * });
   */
  public setSignature({
    url,
    name,
  }: NonNullableType<Omit<GetSignatureType, "from">>): this {
    this.applicationSignature = {
      url,
      name,
    };
    return this;
  }
}
