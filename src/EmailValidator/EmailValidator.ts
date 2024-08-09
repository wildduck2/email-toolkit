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
 *
 * @class
 * @implements {EmailValidatorClass}
 */
export class EmailValidator implements EmailValidatorClass {
  /**
   * Validates email headers using the `HeadersTypeSchema`.
   *
   * @param {HeadersType | undefined} headers - The headers to be validated. Must conform to the `HeadersType` schema. If `undefined`, the validation result will be based on the provided headers or lack thereof.
   * @returns {z.SafeParseReturnType<HeadersType, z.infer<typeof HeadersTypeSchema>>} A Zod safe parse result containing the validation outcome, including data if valid or errors if invalid.
   *
   * @example
   * const headers = {
   *   "From": "example <example@example.com>",
   *   "To": "recipient <recipient@example.com>",
   *   "Subject": "Hello World"
   * };
   * const result = emailValidator.isValidHeaders(headers);
   * if (result.success) {
   *   console.log("Headers are valid:", result.data);
   * } else {
   *   console.error("Header validation errors:", result.error);
   * }
   */
  public isValidHeaders(
    headers: HeadersType | undefined
  ): z.SafeParseReturnType<HeadersType, z.infer<typeof HeadersTypeSchema>> {
    return HeadersTypeSchema.safeParse(headers);
  }

  /**
   * Validates a string data using the `StringSchema`.
   *
   * @param {string} data - The data to be validated. Must be a string conforming to the `StringSchema`.
   * @returns {z.SafeParseReturnType<string, string>} A Zod safe parse result containing the validation outcome, which includes the data if valid or errors if invalid.
   *
   * @example
   * const data = "This is a sample string.";
   * const result = emailValidator.isValidData(data);
   * if (result.success) {
   *   console.log("Data is valid:", result.data);
   * } else {
   *   console.error("Data validation errors:", result.error);
   * }
   */
  public isValidData(data: string): z.SafeParseReturnType<string, string> {
    return StringSchema.safeParse(data);
  }

  /**
   * Validates a character set using the `StringSchema`.
   *
   * @param {string} charset - The charset to be validated. Must be a string conforming to the `StringSchema`.
   * @returns {z.SafeParseReturnType<string, string>} A Zod safe parse result containing the validation outcome, which includes the charset if valid or errors if invalid.
   *
   * @example
   * const charset = "UTF-8";
   * const result = emailValidator.isValidCharset(charset);
   * if (result.success) {
   *   console.log("Charset is valid:", result.data);
   * } else {
   *   console.error("Charset validation errors:", result.error);
   * }
   */
  public isValidCharset(
    charset: string
  ): z.SafeParseReturnType<string, string> {
    return StringSchema.safeParse(charset);
  }

  /**
   * Validates a MIME type using the `StringSchema`.
   *
   * @param {string} mimeType - The MIME type to be validated. Must be a string conforming to the `StringSchema`.
   * @returns {z.SafeParseReturnType<string, string>} A Zod safe parse result containing the validation outcome, which includes the MIME type if valid or errors if invalid.
   *
   * @example
   * const mimeType = "text/plain";
   * const result = emailValidator.isValidMimeType(mimeType);
   * if (result.success) {
   *   console.log("MIME type is valid:", result.data);
   * } else {
   *   console.error("MIME type validation errors:", result.error);
   * }
   */
  public isValidMimeType(
    mimeType: string
  ): z.SafeParseReturnType<string, string> {
    return StringSchema.safeParse(mimeType);
  }

  /**
   * Validates a content type using the `StringSchema`.
   *
   * @param {string} contentType - The content type to be validated. Must be a string conforming to the `StringSchema`.
   * @returns {z.SafeParseReturnType<string, string>} A Zod safe parse result containing the validation outcome, which includes the content type if valid or errors if invalid.
   *
   * @example
   * const contentType = "text/html";
   * const result = emailValidator.isValidContentType(contentType);
   * if (result.success) {
   *   console.log("Content type is valid:", result.data);
   * } else {
   *   console.error("Content type validation errors:", result.error);
   * }
   */
  public isValidContentType(
    contentType: string
  ): z.SafeParseReturnType<string, string> {
    return StringSchema.safeParse(contentType);
  }

  /**
   * Validates content transfer encoding using the `ContentTransferEncodingSchema`.
   *
   * @param {ContentTransferEncoding} encoding - The encoding to be validated. Must conform to the `ContentTransferEncodingSchema`.
   * @returns {z.SafeParseReturnType<ContentTransferEncoding, ContentTransferEncoding>} A Zod safe parse result containing the validation outcome, which includes the encoding if valid or errors if invalid.
   *
   * @example
   * const encoding = "base64";
   * const result = emailValidator.isValidContentTransferEncoding(encoding);
   * if (result.success) {
   *   console.log("Content transfer encoding is valid:", result.data);
   * } else {
   *   console.error("Content transfer encoding validation errors:", result.error);
   * }
   */
  public isValidContentTransferEncoding(
    encoding: ContentTransferEncoding
  ): z.SafeParseReturnType<ContentTransferEncoding, ContentTransferEncoding> {
    return ContentTransferEncodingSchema.safeParse(encoding);
  }

  /**
   * Logs an error by throwing an `EmailError` with the provided Zod error details.
   *
   * @param {z.ZodError} error - The Zod error to be logged. Contains detailed error information from the Zod validation process.
   * @throws {EmailError} Throws an `EmailError` with the error message and description based on the Zod error.
   *
   * @example
   * try {
   *   const result = emailValidator.isValidData("Invalid data");
   *   if (!result.success) {
   *     emailValidator.logError(result.error);
   *   }
   * } catch (e) {
   *   console.error("An error occurred:", e);
   * }
   */
  public logError(error: z.ZodError): void {
    throw new EmailError({
      message: error.message,
      description: error.message,
    });
  }

  /**
   * Validates an attachment header using the `AttachmentHeaderSchema`.
   *
   * @param {z.infer<typeof AttachmentHeaderSchema>} attachmentHeader - The attachment header to be validated. Must conform to the `AttachmentHeaderSchema`.
   * @returns {z.SafeParseReturnType<z.infer<typeof AttachmentHeaderSchema>, z.infer<typeof AttachmentHeaderSchema>>} A Zod safe parse result containing the validation outcome, which includes the attachment header if valid or errors if invalid.
   *
   * @example
   * const attachmentHeader = {
   *   "Content-Type": "application/pdf",
   *   "Content-Disposition": "attachment; filename=\"example.pdf\"",
   *   "Content-Transfer-Encoding": "base64"
   * };
   * const result = emailValidator.isValidAttachment(attachmentHeader);
   * if (result.success) {
   *   console.log("Attachment header is valid:", result.data);
   * } else {
   *   console.error("Attachment header validation errors:", result.error);
   * }
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
