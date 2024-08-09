import { describe, it, expect, beforeEach } from "vitest";
import { EmailBuilderHeader } from "../EmailBuilderHeader";

describe("EmailBuilderHeader", () => {
  let emailBuilderHeader: EmailBuilderHeader;

  beforeEach(() => {
    emailBuilderHeader = new EmailBuilderHeader();
  });

  it('should set the "From" header', () => {
    emailBuilderHeader.setFrom("example <example@example.com>");
    const headers = emailBuilderHeader.getHeaders();
    expect(headers.From).toBe("example <example@example.com>");
  });

  it('should set the "To" header', () => {
    emailBuilderHeader.setTo("example <example@example.com>");
    const headers = emailBuilderHeader.getHeaders();
    expect(headers.To).toBe("example <example@example.com>");
  });

  it('should set the "Cc" header', () => {
    emailBuilderHeader.setCc("example <example@example.com>");
    const headers = emailBuilderHeader.getHeaders();
    expect(headers.Cc).toBe("example <example@example.com>");
  });

  it('should set the "Bcc" header', () => {
    emailBuilderHeader.setBcc("example <example@example.com>");
    const headers = emailBuilderHeader.getHeaders();
    expect(headers.Bcc).toBe("example <example@example.com>");
  });

  it('should set the "Date" header', () => {
    const date = new Date().toISOString();
    emailBuilderHeader.setDate(date);
    const headers = emailBuilderHeader.getHeaders();
    expect(headers.Date).toBe(date);
  });

  it('should set the "Subject" header', () => {
    const subject = "Test Subject";
    emailBuilderHeader.setSubject(subject);
    const headers = emailBuilderHeader.getHeaders();
    expect(headers.Subject).toBe(subject);
  });

  it('should set the "In-Reply-To" header', () => {
    const inReplyTo = "message-id@example.com";
    emailBuilderHeader.setInReplyTo(inReplyTo);
    const headers = emailBuilderHeader.getHeaders();
    expect(headers["In-Reply-To"]).toBe(inReplyTo);
  });

  it('should set the "MIME-Version" header', () => {
    const mimeVersion = "1.0";
    emailBuilderHeader.setMIMEVersion(mimeVersion);
    const headers = emailBuilderHeader.getHeaders();
    expect(headers["MIME-Version"]).toBe(mimeVersion);
  });

  it('should set the "Content-Transfer-Encoding" header', () => {
    const encoding = "7bit";
    emailBuilderHeader.setContentTransferEncoding(encoding);
    const headers = emailBuilderHeader.getHeaders();
    expect(headers["Content-Transfer-Encoding"]).toBe(encoding);
  });

  it('should set the "Content-Type" header', () => {
    const contentType = "text/plain";
    emailBuilderHeader.setContentType(contentType);
    const headers = emailBuilderHeader.getHeaders();
    expect(headers["Content-Type"]).toBe(contentType);
  });

  it('should set the "Charset" header', () => {
    const charset = "utf-8";
    emailBuilderHeader.setCharset(charset);
    const headers = emailBuilderHeader.getHeaders();
    expect(headers.Charset).toBe(charset);
  });

  it("should validate headers correctly", () => {
    emailBuilderHeader
      .setFrom("example <example@example.com>")
      .setTo("example <example@example.com>")
      .setDate(new Date().toISOString())
      .setSubject("Test Subject");

    const headers = emailBuilderHeader.getHeaders();
    expect(headers.From).toBe("example <example@example.com>");
    expect(headers.To).toBe("example <example@example.com>");
  });
});
