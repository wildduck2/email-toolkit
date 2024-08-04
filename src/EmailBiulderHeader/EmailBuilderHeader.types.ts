import type { z } from "zod";
import type { MIMEType } from "../EmailBuilder";
import type { HeadersTypeSchema, CharsetType } from "../zod";
import type { ContentTransferEncoding } from "../index.types";
import type { CharacterEncoding } from "crypto";

export interface EmailBuilderHeaderClass {
  headers: HeadersType;
  getHeaders(): HeadersType;
}
export type ValueType = `${string} <${string}@${string}.${string}>`;

export type TupleUnion<T extends readonly unknown[]> = T[number];

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
  | "Content-ID"
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
};
