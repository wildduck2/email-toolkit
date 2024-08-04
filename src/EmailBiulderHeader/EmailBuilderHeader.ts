import { EmailValidator } from "../EmailValidator";
import type { MIMEType } from "../EmailBuilder";
import type { ContentTransferEncoding } from "../index.types";
import type { CharsetType } from "../zod";
import type {
  EmailBuilderHeaderClass,
  HeadersType,
  TupleUnion,
  ValueType,
} from "./EmailBuilderHeader.types";

export class EmailBuilderHeader
  extends EmailValidator
  implements EmailBuilderHeaderClass
{
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

  constructor() {
    super();
  }

  public getHeaders(): HeadersType {
    const { data: parsedHeaders, error: headersError } =
      EmailValidator.isValidHeaders(this.headers);

    if (headersError) this.logError(headersError);
    return parsedHeaders as HeadersType;
  }

  public setFrom(From: ValueType): this {
    this.headers.From = From as ValueType;
    return this;
  }

  public setTo(To: ValueType): this {
    this.headers.To = To as ValueType;
    return this;
  }

  public setCc(Cc: ValueType): this {
    this.headers.Cc = Cc as ValueType;
    return this;
  }

  public setBcc(Bcc: ValueType): this {
    this.headers.Bcc = Bcc as ValueType;
    return this;
  }

  public setDate(Date: string): this {
    this.headers.Date = Date;
    return this;
  }

  public setSubject(Subject: string): this {
    this.headers.Subject = Subject;
    return this;
  }

  setInReplyTo(InReplyTo: string): this {
    this.headers["In-Reply-To"] = InReplyTo;
    return this;
  }

  setMIMEVersion(MIMEVersion: string): this {
    this.headers["MIME-Version"] = MIMEVersion;
    return this;
  }

  setContentTransferEncoding(
    ContentTransferEncoding: ContentTransferEncoding
  ): this {
    this.headers["Content-Transfer-Encoding"] = ContentTransferEncoding;
    return this;
  }

  public setContentType(ContentType: TupleUnion<MIMEType>): this {
    this.headers["Content-Type"] = ContentType as TupleUnion<MIMEType>;
    return this;
  }

  public setCharset(Charset: TupleUnion<typeof CharsetType>): this {
    this.headers.Charset = Charset;
    return this;
  }
}
