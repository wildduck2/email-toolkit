import { describe, it, expect } from "vitest";
import { EmailValidator } from "../EmailValidator";
import { EmailError } from "../../Error";
import type { HeadersType } from "../../EmailBiulderHeader";

const mockHeaders = {
  From: "sender <sender@example.com>",
  To: "receiver <receiver@example.com>",
  Subject: "Test Email",
  "Content-Type": "text/plain",
  "Content-Transfer-Encoding": "7bit",
  Date: undefined,
  Cc: undefined,
  Bcc: undefined,
  Charset: undefined,
  "In-Reply-To": undefined,
  "MIME-Version": undefined,
};

const mockInvalidHeaders = {
  From: 12345,
  To: "receiver@example.com",
  Subject: "Test Subject",
  "Content-Type": "text/plain",
  "Content-Transfer-Encoding": "7bit",
};

const emailValidator = new EmailValidator();

const mockData = "Valid data";
const mockInvalidData = 12345;

const mockCharset = "UTF-8";
const mockInvalidCharset = 12345;

const mockMimeType = "text/plain";
const mockInvalidMimeType = 12345;

const mockContentType = "text/plain";
const mockInvalidContentType = 12345;

const mockEncoding = "7bit";
const mockInvalidEncoding = "unknown-encoding";

describe("EmailValidator", () => {
  it("should validate headers correctly", () => {
    const result = emailValidator.isValidHeaders(mockHeaders as HeadersType);
    expect(result.success).toBe(true);
  });

  it("should invalidate incorrect headers", () => {
    const result = emailValidator.isValidHeaders(mockInvalidHeaders as any);
    expect(result.success).toBe(false);
    expect((result.error as any).issues).toHaveLength(1);
  });

  it("should validate data correctly", () => {
    const result = emailValidator.isValidData(mockData);
    expect(result.success).toBe(true);
  });

  it("should invalidate incorrect data", () => {
    const result = emailValidator.isValidData(mockInvalidData as any);
    expect(result.success).toBe(false);
    expect((result.error as any).issues).toHaveLength(1);
  });

  it("should validate charset correctly", () => {
    const result = emailValidator.isValidCharset(mockCharset);
    expect(result.success).toBe(true);
  });

  it("should invalidate incorrect charset", () => {
    const result = emailValidator.isValidCharset(mockInvalidCharset as any);
    expect(result.success).toBe(false);
    expect((result.error as any).issues).toHaveLength(1);
  });

  it("should validate MIME type correctly", () => {
    const result = emailValidator.isValidMimeType(mockMimeType);
    expect(result.success).toBe(true);
  });

  it("should invalidate incorrect MIME type", () => {
    const result = emailValidator.isValidMimeType(mockInvalidMimeType as any);
    expect(result.success).toBe(false);
    expect((result.error as any).issues).toHaveLength(1);
  });

  it("should validate content type correctly", () => {
    const result = emailValidator.isValidContentType(mockContentType);
    expect(result.success).toBe(true);
  });

  it("should invalidate incorrect content type", () => {
    const result = emailValidator.isValidContentType(
      mockInvalidContentType as any
    );
    expect(result.success).toBe(false);
    expect((result.error as any).issues).toHaveLength(1);
  });

  it("should validate content transfer encoding correctly", () => {
    const result = emailValidator.isValidContentTransferEncoding(mockEncoding);
    expect(result.success).toBe(true);
  });

  it("should invalidate incorrect content transfer encoding", () => {
    const result = emailValidator.isValidContentTransferEncoding(
      mockInvalidEncoding as any
    );
    expect(result.success).toBe(false);
    expect((result.error as any).issues).toHaveLength(1);
  });

  it("should throw an EmailError when logging an error", () => {
    const mockError = {
      message: "Invalid data",
      issues: [],
    } as any;

    expect(() => {
      const validator = new EmailValidator();
      validator.logError(mockError);
    }).toThrowError(EmailError);
  });

  it("should validate attachment header correctly", () => {
    const mockAttachmentHeader = {
      "Content-Type": "text/plain",
      "Content-Disposition": 'attachment; filename="test.txt"',
      "Content-Transfer-Encoding": "7bit",
    };

    const result = emailValidator.isValidAttachment(
      mockAttachmentHeader as any
    );
    expect(result.success).toBe(true);
  });

  it("should invalidate incorrect attachment header", () => {
    const mockInvalidAttachmentHeader = {
      "Content-Type": 12345,
      "Content-Disposition": 'attachment; filename="test.txt"',
      "Content-Transfer-Encoding": "7bit",
    } as any;

    const result = emailValidator.isValidAttachment(
      mockInvalidAttachmentHeader
    );
    expect(result.success).toBe(false);
    expect((result.error as any).issues).toHaveLength(1);
  });
});
