import type { z } from "zod";
import type { MIMEType, TupleUnion } from "../EmailBuilder";
import type { HeadersTypeSchema } from "../zod/zod";
import type { ContentTransferEncoding } from "../index.types";

export interface EmailBuilderHeaderClass {
  headers: HeadersType;
  getHeaders(): HeadersType;
  setMimeType(mimeType: TupleUnion<MIMEType>): this;
}
export type ValueType = `${string} <${string}@${string}.${string}>`;

type HeaderskeyNameType = z.infer<typeof HeadersTypeSchema>;
export type HeadernameType = keyof HeaderskeyNameType;

type ExcludedHeadernameType = Exclude<
  HeadernameType,
  | "From"
  | "To"
  | "Cc"
  | "Bcc"
  | "Content-Type"
  | "Content-Transfer-Encoding"
  | "Content-Disposition"
  | "Content-ID"
>;

export type HeadersType = {
  [key in ExcludedHeadernameType]?: string | undefined;
} & {
  From?: ValueType | undefined;
  To?: ValueType | undefined;
  Cc?: ValueType | undefined;
  Bcc?: ValueType | undefined;
  "Delivered-To": string | undefined;
  "Mime-Type": TupleUnion<MIMEType>;
  "Content-Transfer-Encoding"?: ContentTransferEncoding | undefined;
  "Content-Disposition"?: string | undefined;
  "Content-ID"?: string | undefined;
};
