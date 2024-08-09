import z from "zod";
import { ContentTransferEncoding, MIMETypes, CharsetType } from "./zod.types";

/**
 * Schema for validating content transfer encodings.
 * This schema ensures that the value is one of the allowed content transfer encodings.
 */
export const ContentTransferEncodingSchema = z.enum([
  ...ContentTransferEncoding,
]);

/**
 * Schema for validating MIME types.
 * This schema ensures that the value is one of the allowed MIME types.
 */
export const ContentTypeSchema = z.enum([...MIMETypes]);

/**
 * Schema for validating character sets.
 * This schema ensures that the value is one of the allowed character sets.
 */
export const CharsetTypeSchema = z.enum([...CharsetType]);

/**
 * Schema for validating strings.
 * This schema ensures that the value is a string.
 */
export const StringSchema = z.string();

/**
 * Schema for validating email headers.
 * This schema ensures that the headers conform to expected formats and optional properties.
 */
export const HeadersTypeSchema = z.object({
  /**
   * The subject of the email.
   * @type {string | undefined}
   */
  Subject: z.string().optional(),

  /**
   * The sender of the email.
   * @type {string | undefined}
   */
  From: z.string().optional(),

  /**
   * The recipient of the email.
   * @type {string | undefined}
   */
  To: z.string().optional(),

  /**
   * The CC recipients of the email.
   * @type {string | undefined}
   */
  Cc: z.string().optional(),

  /**
   * The BCC recipients of the email.
   * @type {string | undefined}
   */
  Bcc: z.string().optional(),

  /**
   * The date the email was sent.
   * @type {string | undefined}
   */
  Date: z.string().optional(),

  /**
   * The email address that this message is a reply to.
   * @type {string | undefined}
   */
  "In-Reply-To": z.string().email().optional(),

  /**
   * The content type of the email.
   * @type {string | undefined}
   */
  "Content-Type": ContentTypeSchema.optional(),

  /**
   * The content transfer encoding of the email.
   * @type {string | undefined}
   */
  "Content-Transfer-Encoding": ContentTransferEncodingSchema.optional(),

  /**
   * The MIME version of the email.
   * @type {string | undefined}
   */
  "MIME-Version": z.string().optional(),

  /**
   * The character set of the email.
   * @type {string | undefined}
   */
  Charset: CharsetTypeSchema.optional(),
});

/**
 * Schema for validating content disposition headers.
 * This schema ensures that the content disposition follows the required format.
 */
const ContentDispositionType = z.string().refine(
  (val) => {
    const regex = /^(inline|attachment|form-data); filename="[^"]+"$/;
    return regex.test(val);
  },
  {
    message: "Invalid Content-Disposition format",
  }
);

/**
 * Schema for validating attachment headers.
 * This schema ensures that the attachment headers conform to expected formats.
 */
export const AttachmentHeaderSchema = z.object({
  /**
   * The content type of the attachment.
   * @type {string | undefined}
   */
  "Content-Type": ContentTypeSchema.optional(),

  /**
   * The content transfer encoding of the attachment.
   * @type {string | undefined}
   */
  "Content-Transfer-Encoding": ContentTransferEncodingSchema.optional(),

  /**
   * The content disposition of the attachment.
   * This must follow the format: "inline", "attachment", or "form-data" with a filename.
   * @type {string | undefined}
   */
  "Content-Disposition": ContentDispositionType.optional(),
});
