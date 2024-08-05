import type { z } from "zod";
import type { HeadersType, TupleUnion } from "../EmailBiulderHeader";
import type { MIMEType } from "../EmailBuilder";
import type { AttachmentHeaderSchema } from "../zod";

export declare class EmailBuilderAttachmentClass {
  attachments: AttachmentType[] | undefined;
  constructor();
}

export type AttachmentType = {
  size: number;
  attachmentId: string;
  attachmentContent: string;
  headers: z.infer<typeof AttachmentHeaderSchema>;
  filename: string;
  mimeType: TupleUnion<MIMEType>;
};
