import type { z } from "zod";
import {
  ContentTransferEncodingSchema,
  HeadersTypeSchema,
  LabelsTypeSchema,
  StringSchema,
} from "../zod/zod";
import type { HeadersType } from "../EmailBuilder";
import { EmailError } from "../Error";
import type { ContentTransferEncoding } from "../index.types";

export class EmailValidator {
  public static isValidLabels(
    labels: Uppercase<string>[]
  ): z.SafeParseReturnType<string[], string[]> {
    return LabelsTypeSchema.safeParse(labels);
  }

  public static isValidHeaders(
    headers: HeadersType | undefined
  ): z.SafeParseReturnType<HeadersType, z.infer<typeof HeadersTypeSchema>> {
    return HeadersTypeSchema.safeParse(headers);
  }

  public static isValidData(
    data: string
  ): z.SafeParseReturnType<string, string> {
    return StringSchema.safeParse(data);
  }

  public static isValidCharset(
    charset: string
  ): z.SafeParseReturnType<string, string> {
    return StringSchema.safeParse(charset);
  }

  public static isValidMimeType(
    mimeType: string
  ): z.SafeParseReturnType<string, string> {
    return StringSchema.safeParse(mimeType);
  }

  public static isValidContentType(
    contentType: string
  ): z.SafeParseReturnType<string, string> {
    return StringSchema.safeParse(contentType);
  }

  public static isValidContentTransferEncoding(
    encoding: ContentTransferEncoding
  ): z.SafeParseReturnType<ContentTransferEncoding, ContentTransferEncoding> {
    return ContentTransferEncodingSchema.safeParse(encoding);
  }

  public logError(error: z.ZodError) {
    throw new EmailError({
      message: error.message,
      description: error.message,
    });
  }
}
