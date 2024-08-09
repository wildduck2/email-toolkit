import { EmailValidator } from "../EmailValidator";
import type { MIMEType } from "../EmailBuilder";
import type { EmailTypeString } from "./EmailBuilderHeader.types";
import type { ContentTransferEncoding } from "../index.types";
import type { CharsetType } from "../zod";
import type {
  EmailBuilderHeaderClass,
  HeadersType,
  TupleUnion,
  ValueType,
} from "./EmailBuilderHeader.types";

/**
 * Class for building and validating email headers.
 *
 * This class extends the `EmailValidator` class and implements the `EmailBuilderHeaderClass` interface.
 * It provides methods to set various email headers and validate them according to email standards.
 *
 * The class allows you to configure email headers such as "From", "To", "Cc", "Bcc", "Subject", and more.
 * It ensures that headers are set correctly and adheres to the email format standards.
 *
 * @extends {EmailValidator}
 * @implements {EmailBuilderHeaderClass}
 *
 * @example
 * const emailHeader = new EmailBuilderHeader();
 * emailHeader
 *   .setFrom("sender@example.com")
 *   .setTo("recipient@example.com")
 *   .setSubject("Test Email");
 */
export class EmailBuilderHeader
  extends EmailValidator
  implements EmailBuilderHeaderClass
{
  /**
   * Object representing the email headers.
   *
   * This property holds all the headers associated with the email. It includes fields such as "From", "To", "Subject",
   * "Cc", "Bcc", "Date", and other standard email headers. The `HeadersType` defines the structure and types
   * for each header field.
   *
   * @type {HeadersType}
   */
  headers: HeadersType = {
    From: undefined,
    To: undefined,
    Cc: undefined,
    Bcc: undefined,
    Date: undefined,
    Subject: undefined,
    Charset: undefined,
    "In-Reply-To": undefined,
    "MIME-Version": undefined,
    "Content-Transfer-Encoding": undefined,
    "Content-Type": undefined,
  };

  /**
   * Constructs an instance of `EmailBuilderHeader`.
   */
  constructor() {
    super();
  }

  /**
   * Retrieves the email headers after validating them.
   *
   * This method validates the current headers stored in the instance using the `isValidHeaders` method.
   * If any validation errors are detected, they are logged, but the method still returns the parsed headers.
   *
   * @returns {HeadersType} The validated and parsed email headers.
   *
   * @example
   * const emailBuilder = new EmailBuilder();
   * emailBuilder.setHeaders({
   *   From: "sender@example.com",
   *   To: "recipient@example.com",
   *   Subject: "Test Email"
   * });
   * const headers = emailBuilder.getHeaders();
   * console.log(headers);
   */
  public getHeaders(): HeadersType {
    const { data: parsedHeaders, error: headersError } = this.isValidHeaders(
      this.headers
    );

    if (headersError) this.logError(headersError);
    return parsedHeaders as HeadersType;
  }

  /**
   * Sets the headers for the email.
   *
   * This method validates the provided headers using the `isValidHeaders` method.
   * If the headers are invalid, it logs the error and still assigns the headers.
   *
   * @param {HeadersType} headers - The headers object to be set. This should contain key-value pairs representing the email headers.
   * @returns {this} The current instance of the EmailBuilder class for method chaining.
   *
   * @example
   * const emailBuilder = new EmailBuilder();
   * emailBuilder.setHeaders({
   *   "From": "sender@example.com",
   *   "To": "recipient@example.com",
   *   "Subject": "Test Email"
   * });
   */
  public setHeaders(headers: HeadersType): this {
    const { data: parsedHeaders, error: headersError } =
      this.isValidHeaders(headers);

    if (headersError) this.logError(headersError);
    this.headers = parsedHeaders as HeadersType;
    return this;
  }

  /**
   * Sets the "From" header of the email.
   *
   * This method allows you to specify the sender's email address by setting the "From" header.
   *
   * @param {ValueType} From - The sender's email address, typically in the format `"name@example.com"` or `"Name <name@example.com>"`.
   * @returns {this} The current instance of `EmailBuilderHeader`, allowing for method chaining.
   *
   * @example
   * const emailHeader = new EmailBuilderHeader();
   * emailHeader.setFrom("sender@example.com");
   */
  public setFrom(From: ValueType): this {
    this.headers.From = From as ValueType;
    return this;
  }

  /**
   * Sets the "To" header of the email.
   *
   * This method specifies the recipient's email address. The "To" header indicates the primary recipient(s) of the email. It can include individual email addresses or multiple addresses separated by commas.
   *
   * @param {ValueType} To - The recipient's email address or addresses. This should be a string in the format `"name@example.com"` or `"Name <name@example.com>"`, or a comma-separated list of such addresses.
   * @returns {this} The current instance of `EmailBuilderHeader`, allowing for method chaining.
   *
   * @example
   * const emailHeader = new EmailBuilderHeader();
   * emailHeader.setTo("recipient@example.com");
   *
   * // For multiple recipients
   * emailHeader.setTo("recipient1@example.com, recipient2@example.com");
   */
  public setTo(To: ValueType): this {
    this.headers.To = To as ValueType;
    return this;
  }

  /**
   * Sets the "Cc" (Carbon Copy) header of the email.
   *
   * This method allows you to specify additional recipients who will receive a copy of the email. The email address can be in a simple format or include a name.
   *
   * @param {ValueType} Cc - The carbon copy recipient's email address. This can be a single email address or multiple addresses separated by commas.
   * @returns {this} The current instance of `EmailBuilderHeader`, allowing for method chaining.
   *
   * @example
   * const emailHeader = new EmailBuilderHeader();
   * emailHeader.setCc("cc@example.com");
   * // or with multiple addresses
   * emailHeader.setCc("cc1@example.com, cc2@example.com");
   */
  public setCc(Cc: ValueType): this {
    this.headers.Cc = Cc as ValueType;
    return this;
  }

  /**
   * Sets the "Bcc" (Blind Carbon Copy) header of the email.
   *
   * This method allows you to specify additional recipients who will receive a blind copy of the email. Their addresses will be hidden from other recipients.
   *
   * @param {ValueType} Bcc - The blind carbon copy recipient's email address. This can be a single email address or multiple addresses separated by commas.
   * @returns {this} The current instance of `EmailBuilderHeader`, enabling method chaining.
   *
   * @example
   * const emailHeader = new EmailBuilderHeader();
   * emailHeader.setBcc("bcc@example.com");
   * // or with multiple addresses
   * emailHeader.setBcc("bcc1@example.com, bcc2@example.com");
   */
  public setBcc(Bcc: ValueType): this {
    this.headers.Bcc = Bcc as ValueType;
    return this;
  }

  /**
   * Sets the "Date" header of the email.
   *
   * This method allows you to specify the date and time when the email is being sent. The date should be in a standard format that is compliant with RFC 5322.
   *
   * @param {string} Date - The date and time of the email in a string format. Example: `"Tue, 15 Aug 2024 10:00:00 +0000"`.
   * @returns {this} The current instance of `EmailBuilderHeader`, allowing for method chaining.
   *
   * @example
   * const emailHeader = new EmailBuilderHeader();
   * emailHeader.setDate("Tue, 15 Aug 2024 10:00:00 +0000");
   */
  public setDate(Date: string): this {
    this.headers.Date = Date;
    return this;
  }

  /**
   * Sets the "Subject" header of the email.
   *
   * This method allows you to specify the subject line of the email. The subject should be a concise summary of the email's content.
   *
   * @param {string} Subject - The subject of the email. Example: `"Meeting Reminder: Project Update"`.
   * @returns {this} The current instance of `EmailBuilderHeader`, enabling method chaining.
   *
   * @example
   * const emailHeader = new EmailBuilderHeader();
   * emailHeader.setSubject("Meeting Reminder: Project Update");
   */
  public setSubject(Subject: string): this {
    this.headers.Subject = Subject;
    return this;
  }

  /**
   * Sets the "In-Reply-To" header of the email.
   *
   * This method specifies the email ID that this email is replying to. The "In-Reply-To" header is used to indicate the message ID of the original message in a reply or thread.
   *
   * @param {EmailTypeString} InReplyTo - The email ID or message ID that this email is in reply to. This should be a string representing the unique identifier of the original email.
   * @returns {this} The current instance of `EmailBuilderHeader`, allowing for method chaining.
   *
   * @example
   * const emailHeader = new EmailBuilderHeader();
   * emailHeader.setInReplyTo("<message-id@example.com>");
   */
  public setInReplyTo(InReplyTo: EmailTypeString): this {
    this.headers["In-Reply-To"] = InReplyTo;
    return this;
  }

  /**
   * Sets the "MIME-Version" header of the email.
   *
   * This method specifies the MIME version used in the email. The "MIME-Version" header indicates the version of the MIME protocol that is being used for the email content.
   *
   * @param {string} MIMEVersion - The MIME version of the email, typically `"1.0"`. This indicates the version of the MIME protocol used.
   * @returns {this} The current instance of `EmailBuilderHeader`, allowing for method chaining.
   *
   * @example
   * const emailHeader = new EmailBuilderHeader();
   * emailHeader.setMIMEVersion("1.0");
   */
  public setMIMEVersion(MIMEVersion: string): this {
    this.headers["MIME-Version"] = MIMEVersion;
    return this;
  }

  /**
   * Sets the "Content-Transfer-Encoding" header of the email.
   *
   * This method specifies the encoding used for the email content. The "Content-Transfer-Encoding" header describes how the email content is encoded for transmission.
   *
   * @param {ContentTransferEncoding} ContentTransferEncoding - The encoding for the email content, such as `"7bit"`, `"8bit"`, `"base64"`, or `"quoted-printable"`.
   * @returns {this} The current instance of `EmailBuilderHeader`, allowing for method chaining.
   *
   * @example
   * const emailHeader = new EmailBuilderHeader();
   * emailHeader.setContentTransferEncoding("base64");
   */
  public setContentTransferEncoding(
    ContentTransferEncoding: ContentTransferEncoding
  ): this {
    this.headers["Content-Transfer-Encoding"] = ContentTransferEncoding;
    return this;
  }

  /**
   * Sets the "Content-Type" header of the email.
   *
   * This method specifies the MIME type of the email content. The "Content-Type" header indicates the media type and sub-type of the content, such as `"text/plain"` or `"text/html"`.
   *
   * @param {TupleUnion<MIMEType>} ContentType - The MIME type of the email content. This should be a string representing the type and sub-type of the content (e.g., `"text/html"` or `"multipart/alternative"`).
   * @returns {this} The current instance of `EmailBuilderHeader`, allowing for method chaining.
   *
   * @example
   * const emailHeader = new EmailBuilderHeader();
   * emailHeader.setContentType("text/html");
   */
  public setContentType(ContentType: TupleUnion<MIMEType>): this {
    this.headers["Content-Type"] = ContentType as TupleUnion<MIMEType>;
    return this;
  }

  /**
   * Sets the "Charset" header of the email.
   *
   * This method specifies the character set used in the email. The "Charset" header indicates the encoding standard for the email content, such as `"utf-8"` or `"iso-8859-1"`.
   *
   * @param {TupleUnion<typeof CharsetType>} Charset - The character set used in the email. This should be a string representing the character encoding standard (e.g., `"utf-8"` or `"iso-8859-1"`).
   * @returns {this} The current instance of `EmailBuilderHeader`, allowing for method chaining.
   *
   * @example
   * const emailHeader = new EmailBuilderHeader();
   * emailHeader.setCharset("utf-8");
   */
  public setCharset(Charset: TupleUnion<typeof CharsetType>): this {
    this.headers.Charset = Charset;
    return this;
  }
}
