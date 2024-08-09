import type { z } from "zod";
import {
  AttachmentHeaderSchema,
  ContentTransferEncodingSchema,
  HeadersTypeSchema,
  StringSchema,
} from "../zod/zod";
import { EmailError } from "../Error";
import type { ContentTransferEncoding } from "../index.types";
import type { HeadersType } from "../EmailBiulderHeader";
import type { EmailValidatorClass } from "./EmailValidator.types";

/**
 * A class for validating email-related data using Zod schemas.
 * Provides methods to validate headers, data, charset, MIME type, content type, and content transfer encoding.
 */
export class EmailValidator implements EmailValidatorClass {
  /**
   * Validates email headers using the HeadersTypeSchema.
   *
   * @param headers - The headers to be validated.
   * @returns A Zod safe parse result containing the validation outcome.
   */
  public isValidHeaders(
    headers: HeadersType | undefined
  ): z.SafeParseReturnType<HeadersType, z.infer<typeof HeadersTypeSchema>> {
    return HeadersTypeSchema.safeParse(headers);
  }

  /**
   * Validates a string data using the StringSchema.
   *
   * @param data - The data to be validated.
   * @returns A Zod safe parse result containing the validation outcome.
   */
  public isValidData(data: string): z.SafeParseReturnType<string, string> {
    return StringSchema.safeParse(data);
  }

  /**
   * Validates a character set using the StringSchema.
   *
   * @param charset - The charset to be validated.
   * @returns A Zod safe parse result containing the validation outcome.
   */
  public isValidCharset(
    charset: string
  ): z.SafeParseReturnType<string, string> {
    return StringSchema.safeParse(charset);
  }

  /**
   * Validates a MIME type using the StringSchema.
   *
   * @param mimeType - The MIME type to be validated.
   * @returns A Zod safe parse result containing the validation outcome.
   */
  public isValidMimeType(
    mimeType: string
  ): z.SafeParseReturnType<string, string> {
    return StringSchema.safeParse(mimeType);
  }

  /**
   * Validates a content type using the StringSchema.
   *
   * @param contentType - The content type to be validated.
   * @returns A Zod safe parse result containing the validation outcome.
   */
  public isValidContentType(
    contentType: string
  ): z.SafeParseReturnType<string, string> {
    return StringSchema.safeParse(contentType);
  }

  /**
   * Validates content transfer encoding using the ContentTransferEncodingSchema.
   *
   * @param encoding - The encoding to be validated.
   * @returns A Zod safe parse result containing the validation outcome.
   */
  public isValidContentTransferEncoding(
    encoding: ContentTransferEncoding
  ): z.SafeParseReturnType<ContentTransferEncoding, ContentTransferEncoding> {
    return ContentTransferEncodingSchema.safeParse(encoding);
  }

  /**
   * Logs an error by throwing an EmailError with the provided Zod error details.
   *
   * @param error - The Zod error to be logged.
   * @throws {EmailError} Throws an EmailError with the error message.
   */
  public logError(error: z.ZodError): void {
    throw new EmailError({
      message: error.message,
      description: error.message,
    });
  }

  /**
   * Validates an attachment header using the AttachmentHeaderSchema.
   *
   * @param attachmentHeader - The attachment header to be validated.
   * @returns A Zod safe parse result containing the validation outcome.
   */
  public isValidAttachment(
    attachmentHeader: z.infer<typeof AttachmentHeaderSchema>
  ): z.SafeParseReturnType<
    z.infer<typeof AttachmentHeaderSchema>,
    z.infer<typeof AttachmentHeaderSchema>
  > {
    return AttachmentHeaderSchema.safeParse(attachmentHeader);
  }
}
