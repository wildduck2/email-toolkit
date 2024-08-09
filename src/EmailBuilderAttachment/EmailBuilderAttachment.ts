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
   * Calls the constructor of the `EmailValidator` class.
   */
  constructor() {
    super();
  }

  /**
   * Adds an attachment to the email.
   * If there are no existing attachments, it initializes the `attachments` array.
   *
   * @param {AttachmentType} attachment - The attachment to be added.
   * @returns {this} - The current instance of `EmailBuilderAttachment` for method chaining.
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
   * Returns an array of strings representing the attachment MIME parts.
   *
   * @returns {string[] | undefined} - An array of MIME part strings for the attachments, or `undefined` if no attachments are present.
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
