import z from "zod";
import { ContentTransferEncoding, MIMETypes, CharsetType } from "./zod.types";

export const ContentTransferEncodingSchema = z.enum([
  ...ContentTransferEncoding,
]);
export const ContentTypeSchema = z.enum([...MIMETypes]);
export const CharsetTypeSchema = z.enum([...CharsetType]);

export const StringSchema = z.string();

export const HeadersTypeSchema = z.object({
  Subject: z.string().optional(),
  From: z.string().optional(),
  To: z.string().optional(),
  Cc: z.string().optional(),
  Bcc: z.string().optional(),
  Date: z.string().optional(),
  "In-Reply-To": z.string().optional(),
  "Content-Type": ContentTypeSchema.optional(),
  "Content-Transfer-Encoding": ContentTransferEncodingSchema.optional(),
  "MIME-Version": z.string().optional(),
  Charset: CharsetTypeSchema.optional(),
});

export const LabelsTypeSchema = z.array(z.string().toUpperCase());

export const AttachmentHeaderSchema = z.object({
  "Mime-Type": ContentTypeSchema.optional(),
  "Content-Transfer-Encoding": ContentTransferEncodingSchema.optional(),
  "Content-Disposition": z.string().optional(),
});
