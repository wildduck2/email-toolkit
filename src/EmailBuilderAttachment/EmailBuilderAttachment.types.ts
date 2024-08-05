import type { z } from "zod";
import type { HeadersType, TupleUnion } from "../EmailBiulderHeader";
import type { MIMEType } from "../EmailBuilder";
import type { AttachmentHeaderSchema, ContentDispositionType } from "../zod";

export declare class EmailBuilderAttachmentClass {
  attachments: AttachmentType[] | undefined;
  boundary?: string | undefined;
  constructor();
}

export type AttachmentHeaderType = Exclude<
  z.infer<typeof AttachmentHeaderSchema>,
  "Content-Disposition"
> & {
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
