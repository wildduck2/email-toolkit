import type { z } from "zod";
import { HeadersTypeSchema } from "../zod/zod";
import type { ContentTransferEncoding } from "../index.types";

export interface EmailBuilderClass {
  headers: HeadersType | null;
  snippet: string;
  labels: string[];
  MimeType: string;
}

export interface EmailType {
  id: string;
  threadId: string;
  labelIds: string[];
  snippet: string;
  historyId: string;
  internalDate: string;
  payload: {
    partId: string;
    mimeType: string;
    filename: string;
    headers: HeadersType[];
    body: {};
    parts: EmailType[];
  };
  sizeEstimate: number;
  raw: string;
}

export interface SetHeaderType {
  name: HeadernameType;
  value: ValueType;
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
  "Content-Type": string;
  "Content-Transfer-Encoding"?: ContentTransferEncoding | undefined;
  "Content-Disposition"?: string | undefined;
  "Content-ID"?: string | undefined;
};

export type AddMessageType = {
  data: string;
  encoding?: ContentTransferEncoding | undefined;
  contentType: string;
  headers?: HeadersType | undefined;
  charset?: string | undefined;
};
