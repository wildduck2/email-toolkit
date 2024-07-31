import z from "zod";
import { ContentTransferEncoding, ValidTypes } from "./zod.types";

export const ContentTransferEncodingSchema = z.enum([
  ...ContentTransferEncoding,
]);
export const ContentTypeSchema = z.enum([...ValidTypes]);

export const StringSchema = z.string();

export const HeadersTypeSchema = z.object({
  Subject: z.string().optional(),
  From: z.string().optional(),
  To: z.string().optional(),
  Cc: z.string().optional(),
  Bcc: z.string().optional(),
  Date: z.string().optional(),
  "Message-Id": z.string().optional(),
  "In-Reply-To": z.string().optional(),
  References: z.string().optional(),

  "Content-Type": ContentTypeSchema.optional(),
  "Content-Transfer-Encoding": ContentTransferEncodingSchema.optional(),
  "Content-Disposition": z.string().optional(),
  "Content-ID": z.string().optional(),
});