import type { z } from "zod";
import type { MIMEType } from "../EmailBuilder";
import type { HeadersTypeSchema, CharsetType } from "../zod";
import type { ContentTransferEncoding } from "../index.types";

export declare class EmailBuilderHeaderClass {
  headers: HeadersType;
  constructor();
  public getHeaders(): HeadersType;
  public setFrom(From: ValueType): this;
  public setTo(To: ValueType): this;
  public setCc(Cc: ValueType): this;
  public setBcc(Bcc: ValueType): this;
  public setDate(Date: string): this;
  public setSubject(Subject: string): this;
  public setInReplyTo(InReplyTo: string): this;
  public setMIMEVersion(MIMEVersion: string): this;
  public setContentTransferEncoding(
    ContentTransferEncoding: ContentTransferEncoding
  ): this;
  public setContentType(ContentType: TupleUnion<MIMEType>): this;
  public setCharset(Charset: TupleUnion<typeof CharsetType>): this;
}

export type EmailType = `${string}@${string}.${string}`;
export type ValueType = `${string} <${EmailType}>`;
export type TupleUnion<T extends readonly unknown[]> = T[number];
export type HeaderskeyNameType = z.infer<typeof HeadersTypeSchema>;
export type HeadernameType = keyof HeaderskeyNameType;

export type ExcludedHeadernameType = Exclude<
  HeadernameType,
  | "From"
  | "To"
  | "Cc"
  | "Bcc"
  | "Content-Type"
  | "Content-Transfer-Encoding"
  | "Content-ID"
  | "In-Reply-To"
>;

export type HeadersType = {
  [key in ExcludedHeadernameType]?: string | undefined;
} & {
  From?: ValueType | undefined;
  To?: ValueType | undefined;
  Cc?: ValueType | undefined;
  Bcc?: ValueType | undefined;
  Charset: TupleUnion<typeof CharsetType> | undefined;
  "Content-Type": TupleUnion<MIMEType> | undefined;
  "Content-Transfer-Encoding"?: ContentTransferEncoding | undefined;
  "In-Reply-To": EmailType | undefined;
};
