import type { z } from "zod";
import type { AttachmentHeaderSchema, HeadersTypeSchema } from "../zod";
import type { HeadersType } from "../EmailBiulderHeader";
import type { ContentTransferEncoding } from "../index.types";

export declare class EmailValidatorClass {
  public isValidHeaders(
    headers: HeadersType | undefined
  ): z.SafeParseReturnType<HeadersType, z.infer<typeof HeadersTypeSchema>>;
  public isValidData(data: string): z.SafeParseReturnType<string, string>;
  public isValidCharset(charset: string): z.SafeParseReturnType<string, string>;
  public isValidMimeType(
    mimeType: string
  ): z.SafeParseReturnType<string, string>;
  public isValidContentType(
    contentType: string
  ): z.SafeParseReturnType<string, string>;
  public isValidContentTransferEncoding(
    encoding: ContentTransferEncoding
  ): z.SafeParseReturnType<ContentTransferEncoding, ContentTransferEncoding>;
  public logError(error: z.ZodError): void;
  public isValidAttachment(
    attachmentHeader: z.infer<typeof AttachmentHeaderSchema>
  ): z.SafeParseReturnType<
    z.infer<typeof AttachmentHeaderSchema>,
    z.infer<typeof AttachmentHeaderSchema>
  >;
}
