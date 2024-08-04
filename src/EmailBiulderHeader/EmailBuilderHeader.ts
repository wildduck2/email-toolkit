import type { MIMEType, TupleUnion } from "../EmailBuilder";
import { EmailValidator } from "../EmailValidator";
import type { ContentTransferEncoding } from "../index.types";
import type {
  EmailBuilderHeaderClass,
  HeadersType,
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
    References: undefined,
    Subject: undefined,
    "Reply-To": undefined,
    "Delivered-To": undefined,
    "Message-Id": undefined,
    "Content-ID": undefined,
    "In-Reply-To": undefined,
    "MIME-Version": undefined,
    "Content-Disposition": undefined,
    "Content-Transfer-Encoding": undefined,
    "Mime-Type": "text/html",
  };

  constructor() {
    super();
  }

  public getHeaders(): HeadersType {
    return this.headers as HeadersType;
  }

  public setFrom(from: ValueType): this {
    this.headers.From = from as ValueType;
    return this;
  }

  public setTo(to: ValueType): this {
    this.headers.To = to as ValueType;
    return this;
  }

  public setCc(cc: ValueType): this {
    this.headers.Cc = cc as ValueType;
    return this;
  }

  public setBcc(bcc: ValueType): this {
    this.headers.Bcc = bcc as ValueType;
    return this;
  }

  public setDate(date: string): this {
    this.headers.Date = date;
    return this;
  }

  public setMimeType(mimeType: TupleUnion<MIMEType>): this {
    this.headers["Mime-Type"] = mimeType as TupleUnion<MIMEType>;
    return this;
  }
}
