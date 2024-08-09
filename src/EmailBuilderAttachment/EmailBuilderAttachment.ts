import type { TupleUnion } from "../EmailBiulderHeader";
import type { MIMEType } from "../EmailBuilder/EmailBuilder.types";
import { EmailValidator } from "../EmailValidator";
import type {
  AttachmentType,
  EmailBuilderAttachmentClass,
} from "./EmailBuilderAttachment.types";

/**
 * `EmailBuilderAttachment` class is responsible for managing email attachments
 * and generating the necessary MIME parts for these attachments in an email message.
 * It extends the `EmailValidator` class to leverage its validation functionality
 * and implements the `EmailBuilderAttachmentClass` interface to ensure proper attachment handling.
 *
 * @class
 * @extends EmailValidator
 * @implements EmailBuilderAttachmentClass
 */

export class EmailBuilderAttachment
  extends EmailValidator
  implements EmailBuilderAttachmentClass
{
  /**
   * An optional array of attachments to be included in the email.
   * It is initialized as `undefined` and populated when attachments are added.
   *
   * @type {AttachmentType[] | undefined}
   */
  attachments: AttachmentType[] | undefined;

  /**
   * The boundary string used to separate different parts of a multipart email.
   * Default value is `"boundary"`.
   *
   * @type {string | undefined}
   */
  boundary?: string | undefined = "boundary";

  /**
   * Initializes a new instance of the `EmailBuilderAttachment` class.
   * Calls the constructor of the `EmailValidator` class to initialize inherited properties.
   *
   * @constructor
   * @extends EmailValidator
   */
  constructor() {
    super();
  }

  /**
   * Adds an attachment to the email.
   *
   * If there are no existing attachments, this method initializes the `attachments` array.
   * It then adds the provided attachment to the array.
   *
   * @param {AttachmentType} attachment - The attachment to be added to the email. This should conform to the `AttachmentType` schema.
   * @returns {this} - The current instance of `EmailBuilder` for method chaining, allowing further configuration of the email.
   *
   * @example
   * const emailBuilder = new EmailBuilder();
   * emailBuilder.addAttachment({
   *   filename: "document.pdf",
   *   content: "<base64-encoded-content>",
   *   headers: {
   *     "Content-Type": "application/pdf",
   *     "Content-Transfer-Encoding": "base64"
   *   }
   * });
   */
  public addAttachment(attachment: AttachmentType): this {
    if (!this.attachments) {
      this.attachments = [];
    }
    this.attachments.push(attachment);
    return this;
  }

  /**
   * Generates the MIME parts for all the attachments in the email.
   *
   * This method constructs and returns an array of strings, each representing a MIME part for an attachment.
   * The MIME parts include headers for content type, transfer encoding, and disposition, followed by the attachment content.
   * If no attachments are present, the method returns `undefined`.
   *
   * @returns {string[] | undefined} - An array of MIME part strings for the attachments, or `undefined` if no attachments are present.
   *
   * @example
   * const emailBuilder = new EmailBuilder();
   * emailBuilder.addAttachment({
   *   filename: "document.pdf",
   *   content: "<base64-encoded-content>",
   *   headers: {
   *     "Content-Type": "application/pdf",
   *     "Content-Transfer-Encoding": "base64",
   *     "Content-Disposition": "attachment"
   *   }
   * });
   *
   * const mimeParts = emailBuilder.getAttachment();
   * // mimeParts will be an array of strings representing MIME parts for the attachments
   */
  public getAttachment(): string[] | undefined {
    return this.attachments?.flatMap((attachment) => {
      const { error: attachmentError } = this.isValidAttachment({
        "Content-Type": attachment.headers?.["Content-Type"].split(
          ";"
        )?.[0] as TupleUnion<MIMEType>,
        "Content-Disposition": attachment.headers?.["Content-Disposition"],
        "Content-Transfer-Encoding":
          attachment.headers?.["Content-Transfer-Encoding"],
      });
      if (attachmentError) this.logError(attachmentError);

      return [
        ``,
        `--${this.boundary}`,
        `Content-Type: ${attachment.headers?.["Content-Type"]}`,
        `Content-Transfer-Encoding: ${attachment.headers?.["Content-Transfer-Encoding"]}`,
        `Content-Disposition: attachment; filename="${attachment.filename}"`,
        ``,
        attachment.attachmentContent,
        ``,
      ];
    });
  }
}
