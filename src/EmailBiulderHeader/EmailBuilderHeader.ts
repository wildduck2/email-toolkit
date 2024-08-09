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
 * Extends the `EmailValidator` class and implements `EmailBuilderHeaderClass`.
 */
export class EmailBuilderHeader
  extends EmailValidator
  implements EmailBuilderHeaderClass
{
  /**
   * Object representing the email headers.
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
   * Retrieves the validated email headers.
   *
   * @returns {HeadersType} The validated email headers.
   */
  public getHeaders(): HeadersType {
    const { data: parsedHeaders, error: headersError } = this.isValidHeaders(
      this.headers
    );

    if (headersError) this.logError(headersError);
    return parsedHeaders as HeadersType;
  }

  /**
   * Sets the "From" header.
   *
   * @param {ValueType} From - The sender's email address.
   * @returns {this} The current instance of `EmailBuilderHeader`.
   */
  public setFrom(From: ValueType): this {
    this.headers.From = From as ValueType;
    return this;
  }

  /**
   * Sets the "To" header.
   *
   * @param {ValueType} To - The recipient's email address.
   * @returns {this} The current instance of `EmailBuilderHeader`.
   */
  public setTo(To: ValueType): this {
    this.headers.To = To as ValueType;
    return this;
  }

  /**
   * Sets the "Cc" header.
   *
   * @param {ValueType} Cc - The carbon copy recipient's email address.
   * @returns {this} The current instance of `EmailBuilderHeader`.
   */
  public setCc(Cc: ValueType): this {
    this.headers.Cc = Cc as ValueType;
    return this;
  }

  /**
   * Sets the "Bcc" header.
   *
   * @param {ValueType} Bcc - The blind carbon copy recipient's email address.
   * @returns {this} The current instance of `EmailBuilderHeader`.
   */
  public setBcc(Bcc: ValueType): this {
    this.headers.Bcc = Bcc as ValueType;
    return this;
  }

  /**
   * Sets the "Date" header.
   *
   * @param {string} Date - The date of the email.
   * @returns {this} The current instance of `EmailBuilderHeader`.
   */
  public setDate(Date: string): this {
    this.headers.Date = Date;
    return this;
  }

  /**
   * Sets the "Subject" header.
   *
   * @param {string} Subject - The subject of the email.
   * @returns {this} The current instance of `EmailBuilderHeader`.
   */
  public setSubject(Subject: string): this {
    this.headers.Subject = Subject;
    return this;
  }

  /**
   * Sets the "In-Reply-To" header.
   *
   * @param {EmailTypeString} InReplyTo - The email ID that this email is in reply to.
   * @returns {this} The current instance of `EmailBuilderHeader`.
   */
  public setInReplyTo(InReplyTo: EmailTypeString): this {
    this.headers["In-Reply-To"] = InReplyTo;
    return this;
  }

  /**
   * Sets the "MIME-Version" header.
   *
   * @param {string} MIMEVersion - The MIME version of the email.
   * @returns {this} The current instance of `EmailBuilderHeader`.
   */
  public setMIMEVersion(MIMEVersion: string): this {
    this.headers["MIME-Version"] = MIMEVersion;
    return this;
  }

  /**
   * Sets the "Content-Transfer-Encoding" header.
   *
   * @param {ContentTransferEncoding} ContentTransferEncoding - The encoding for the email content.
   * @returns {this} The current instance of `EmailBuilderHeader`.
   */
  public setContentTransferEncoding(
    ContentTransferEncoding: ContentTransferEncoding
  ): this {
    this.headers["Content-Transfer-Encoding"] = ContentTransferEncoding;
    return this;
  }

  /**
   * Sets the "Content-Type" header.
   *
   * @param {TupleUnion<MIMEType>} ContentType - The MIME type of the email content.
   * @returns {this} The current instance of `EmailBuilderHeader`.
   */
  public setContentType(ContentType: TupleUnion<MIMEType>): this {
    this.headers["Content-Type"] = ContentType as TupleUnion<MIMEType>;
    return this;
  }

  /**
   * Sets the "Charset" header.
   *
   * @param {TupleUnion<typeof CharsetType>} Charset - The character set used in the email.
   * @returns {this} The current instance of `EmailBuilderHeader`.
   */
  public setCharset(Charset: TupleUnion<typeof CharsetType>): this {
    this.headers.Charset = Charset;
    return this;
  }
}
