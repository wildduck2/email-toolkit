import type { z } from "zod";
import { HeadersTypeSchema } from "../zod/zod";
import type { ContentTransferEncoding } from "../index.types";
import type { MIMETypes } from "../zod/zod.types";

export type MIMEType = typeof MIMETypes;

export interface EmailBuilderClass {
  headers: HeadersType | null;
  snippet: string;
  labels: Uppercase<string>[];
  MimeType: string;
  applicationSignature: ApplicationSignature | null;
  setHeaders(headers: HeadersType): this;
  setSnippet(snippet: string): this;
  setLabels(labels: string[]): this;
  setData(data: string): this;
  setApplicationSignature(applicationSignature: ApplicationSignature): this;
  setMimeType(mimeType: string): this;
  addMessage({
    data,
    charset,
    headers,
    encoding,
    contentType,
  }: AddMessageType): this;
  asRaw(): string;
  asEncoded(): string;
}

export interface ApplicationSignature {
  name: string;
  url: string;
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

export type AddMessageType = {
  data: string;
  encoding?: ContentTransferEncoding | undefined;
  contentType?: string;
  headers?: HeadersType | undefined;
  charset?: string | undefined;
  attachments?: AttachmentType[] | undefined;
};

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
  "Mime-Type": TupleUnion<MIMEType> | undefined;
}

export type TupleUnion<T extends readonly unknown[]> = T[number];

export type AttachmentType = {
  size: number;
  attachmentId: string;
  attachmentContent: string;
  headers: HeadersType;
  filename: string;
  mimeType: TupleUnion<MIMEType>;
};
