import type {
  HeadernameType,
  HeadersType,
  TupleUnion,
  ValueType,
} from "../EmailBiulderHeader";
import type { AttachmentHeaderType } from "../EmailBuilderAttachment/EmailBuilderAttachment.types";
import type { ContentTransferEncoding } from "../index.types";
import type { MIMETypes } from "../zod/zod.types";

export type GetSignatureType = {
  from: string | undefined;
  url: string | undefined;
  name: string | undefined;
};

export type MIMEType = typeof MIMETypes;

export interface EmailBuilderClass {}

export interface ApplicationSignature {
  from: string;
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

export type AttachmentType = {
  size: number;
  attachmentId: string;
  attachmentContent: string;
  headers: AttachmentHeaderType;
  filename: string;
  mimeType: TupleUnion<MIMEType>;
};

export type NonNullableType<T> = {
  [K in keyof T]: NonNullable<T[K]>;
};
