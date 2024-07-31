import { Base64 } from "../Base64";
import { EmailError } from "../Error";
import {
  ContentTransferEncodingSchema,
  ContentTypeSchema,
  HeadersTypeSchema,
  StringSchema,
} from "../zod/zod";

import {
  type AddMessageType,
  type EmailBuilderClass,
  type HeadersType,
  type ValueType,
} from "./EmailBuilder.types";

export class EmailBuilder implements EmailBuilderClass {
  headers: HeadersType | null = null;
  snippet: string = "";
  labels: string[] = [];
  MimeType: string = "text/plain";
  data: string = "";

  constructor() {
    const foo = this.addMessage({
      data: "https://coated.net",
      charset: "UTF-8",
      headers: {
        Subject: "Hello",
        From: "duck <a@a.com>",
        To: "duck <a@a.com>",
        "In-Reply-To": "sdf <123>",
        "Content-Type": "text/plain",
        "Content-Transfer-Encoding": "7bit",
      },
      encoding: "7bit",
      contentType: "text/plain",
    }).asRaw();

    console.log(foo);
  }

  addMessage({
    data,
    charset,
    headers,
    encoding,
    contentType,
  }: AddMessageType): this {
    const { data: parsedHeaders, error: parsedHeadersError } =
      HeadersTypeSchema.safeParse(headers);

    let typeName = parsedHeaders?.["Content-Type"] || contentType || "none";
    const { data: parsedType, error: parsedTypeError } =
      ContentTypeSchema.safeParse(typeName);

    const encodingName =
      parsedHeaders?.["Content-Transfer-Encoding"] || encoding || "7bit";
    const { data: parsedEncoding, error: parsedEncodingError } =
      ContentTransferEncodingSchema.safeParse(encodingName);

    const charsetName = charset || "UTF-8";
    const { data: parsedCharset } = StringSchema.safeParse(charsetName);
    parsedEncodingError && (typeName = "application/octet-stream");

    const error = parsedTypeError || parsedHeadersError;

    if (error) {
      throw new EmailError({
        message: error.message,
        description: error.message,
      });
    }

    this.headers = {
      ...this.headers,
      ...parsedHeaders,
      "Content-Transfer-Encoding": parsedEncoding,
      "Content-Type": `${parsedType}; charset=${parsedCharset || "UTF-8"}`,
    } as HeadersType;

    this.data = data;

    return this;
  }

  asRaw(): RawMessage {
    const cc = this.headers?.Cc;
    const bcc = this.headers?.Bcc;

    let rawMessage: RawMessage = {
      Date: new Date().toUTCString(),
      From: this.headers?.From,
      inReplyTo: this.headers?.["In-Reply-To"],
      To: this.headers?.To,
      Subject: this.headers?.Subject,
      "MIME-Version": "1.0",
      data: this.data,
      "Content-Type": this.headers?.["Content-Type"],
      "Content-Transfer-Encoding": this.headers?.["Content-Transfer-Encoding"],
    };

    if (cc || bcc) {
      rawMessage = {
        ...rawMessage,
        Cc: cc,
        Bcc: bcc,
      } as RawMessage;
    }

    return rawMessage;
  }

  asEncoded() {
    const rawMessage = this.asRaw();
    return Base64.encodeToBase64(`${JSON.stringify(rawMessage)}`);
  }
}

export interface RawMessage {
  Date: string;
  From: ValueType | undefined;
  To: ValueType | undefined;
  inReplyTo: string | undefined;
  Cc?: ValueType | undefined;
  Bcc?: ValueType | undefined;
  Subject: string | undefined;
  data: string;
  "MIME-Version": string;
  "Content-Transfer-Encoding": string | undefined;
  "Content-Type": string | undefined;
}
