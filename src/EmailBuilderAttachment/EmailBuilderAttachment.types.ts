import type { z } from "zod";
import type { TupleUnion } from "../EmailBiulderHeader";
import type { MIMEType } from "../EmailBuilder";
import {
  AttachmentHeaderSchema,
  type AttachmentContentType,
  type ContentDispositionType,
} from "../zod";

export declare class EmailBuilderAttachmentClass {
  attachments: AttachmentType[] | undefined;
  boundary?: string | undefined;
  constructor();
}

export type AttachmentHeaderType = Omit<
  z.infer<typeof AttachmentHeaderSchema>,
  "Content-Type" | "Content-Disposition"
> & {
  "Content-Type": AttachmentContentType;
  "Content-Disposition": ContentDispositionType;
};

export type AttachmentType = {
  size: number;
  attachmentId: string;
  attachmentContent: string;
  headers: Required<AttachmentHeaderType>;
  filename: string;
  mimeType: TupleUnion<MIMEType>;
};
