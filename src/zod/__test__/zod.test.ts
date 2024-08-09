import { describe, expect, it } from "vitest";
import {
  ContentTransferEncodingSchema,
  ContentTypeSchema,
  CharsetTypeSchema,
  StringSchema,
  HeadersTypeSchema,
  AttachmentHeaderSchema,
} from "../zod";

describe("Zod Schemas", () => {
  // Testing ContentTransferEncodingSchema
  describe("ContentTransferEncodingSchema", () => {
    it("should validate valid content transfer encoding", () => {
      const validEncoding = "7bit";
      expect(
        ContentTransferEncodingSchema.safeParse(validEncoding).success
      ).toBe(true);
    });

    it("should invalidate an invalid content transfer encoding", () => {
      const invalidEncoding = "invalid-encoding";
      expect(
        ContentTransferEncodingSchema.safeParse(invalidEncoding).success
      ).toBe(false);
    });
  });

  // Testing ContentTypeSchema
  describe("ContentTypeSchema", () => {
    it("should validate a valid MIME type", () => {
      const validMimeType = "text/plain";
      expect(ContentTypeSchema.safeParse(validMimeType).success).toBe(true);
    });

    it("should invalidate an invalid MIME type", () => {
      const invalidMimeType = "invalid/type";
      expect(ContentTypeSchema.safeParse(invalidMimeType).success).toBe(false);
    });
  });

  // Testing CharsetTypeSchema
  describe("CharsetTypeSchema", () => {
    it("should validate a valid charset", () => {
      const validCharset = "utf-8";
      expect(CharsetTypeSchema.safeParse(validCharset).success).toBe(true);
    });

    it("should invalidate an invalid charset", () => {
      const invalidCharset = "invalid-charset";
      expect(CharsetTypeSchema.safeParse(invalidCharset).success).toBe(false);
    });
  });

  // Testing StringSchema
  describe("StringSchema", () => {
    it("should validate a valid string", () => {
      const validString = "This is a valid string.";
      expect(StringSchema.safeParse(validString).success).toBe(true);
    });

    it("should invalidate a non-string value", () => {
      const invalidValue = 12345;
      expect(StringSchema.safeParse(invalidValue).success).toBe(false);
    });
  });

  // Testing HeadersTypeSchema
  describe("HeadersTypeSchema", () => {
    it("should validate valid headers", () => {
      const validHeaders = {
        Subject: "Test Email",
        From: "sender@example.com",
        To: "recipient@example.com",
        Cc: "cc@example.com",
        Bcc: "bcc@example.com",
        Date: "Fri Aug 09 2024",
        "In-Reply-To": "reply@example.com",
        "Content-Type": "text/plain",
        "Content-Transfer-Encoding": "7bit",
        "MIME-Version": "1.0",
        Charset: "utf-8",
      };
      expect(HeadersTypeSchema.safeParse(validHeaders).success).toBe(true);
    });

    it("should invalidate invalid headers", () => {
      const invalidHeaders = {
        Subject: "Test Email",
        From: "sender@example.com",
        To: "recipient@example.com",
        "In-Reply-To": "invalid-email",
        "Content-Type": "invalid/type",
        "Content-Transfer-Encoding": "invalid-encoding",
        Charset: "invalid-charset",
      };
      expect(HeadersTypeSchema.safeParse(invalidHeaders).success).toBe(false);
    });
  });

  // Testing AttachmentHeaderSchema
  describe("AttachmentHeaderSchema", () => {
    it("should validate valid attachment headers", () => {
      const validAttachmentHeader = {
        "Content-Type": "application/pdf",
        "Content-Transfer-Encoding": "base64",
        "Content-Disposition": 'attachment; filename="document.pdf"',
      };
      expect(
        AttachmentHeaderSchema.safeParse(validAttachmentHeader).success
      ).toBe(true);
    });

    it("should invalidate invalid attachment headers", () => {
      const invalidAttachmentHeader = {
        "Content-Type": "invalid/type",
        "Content-Transfer-Encoding": "invalid-encoding",
        "Content-Disposition": "invalid-disposition",
      };
      expect(
        AttachmentHeaderSchema.safeParse(invalidAttachmentHeader).success
      ).toBe(false);
    });
  });
});
