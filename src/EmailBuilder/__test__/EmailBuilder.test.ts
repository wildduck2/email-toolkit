import { describe, it, expect, beforeEach } from "vitest";
import { Base64 } from "../../Base64";
import type {
  AttachmentType,
  GetSignatureType,
  NonNullableType,
} from "../EmailBuilder.types";
import { EmailError } from "../../Error";
import { EmailBuilder } from "../EmailBuilder";
import { EmailBuilderHeader, type HeadersType } from "../../EmailBiulderHeader";

describe("EmailBuilder", () => {
  let emailBuilder: EmailBuilder;
  let headers: HeadersType;

  beforeEach(() => {
    emailBuilder = new EmailBuilder();
    headers = {
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
  });

  it("should generate a raw message correctly", () => {
    emailBuilder.messagebody = "This is a test email.";
    const result = emailBuilder.getRawMessage(headers);

    const decodedResult = result as string;

    const expectedBody = [
      `To: receiver <receiver@example.com>`,
      `From: sender <sender@example.com>`,
      `Subject: Test Email`,
      `Content-Type: multipart/mixed; boundary="boundary"`,
      ``,
      `--boundary`,
      `Content-Type: text/plain`,
      `Content-Transfer-Encoding: 7bit`,
      ``,
    ].join("\r\n");

    expect(decodedResult).toContain(expectedBody);
  });

  it("should return an EmailError if message body is missing", () => {
    const result = emailBuilder.getRawMessage(headers);
    expect(result).toBeInstanceOf(EmailError);
    expect((result as EmailError).message).toBe(
      "The email message should contain a body"
    );
  });

  it("should generate the correct signature block", () => {
    const signature = emailBuilder.getSignature({
      from: "sender@example.com",
      url: emailBuilder.applicationSignature.url,
      name: emailBuilder.applicationSignature.name,
    });

    expect(signature).toEqual([
      "",
      `</div>`,
      `<div style="margin: 1rem">`,
      `---------------------------------`,
      `<p>This email was sent from sender@example.com by <a style="color: blue" href="${emailBuilder.applicationSignature.url}" target="_blank">${emailBuilder.applicationSignature.name}</a> app</p>`,
      `---------------------------------`,
      `</div>`,
    ]);
  });

  it("should include attachments in the raw message", () => {
    emailBuilder.messagebody = "This is a test email.";
    const attachments: AttachmentType[] = [
      {
        size: 12,
        mimeType: "text/plain",
        attachmentId: "1",
        filename: "test.txt",
        attachmentContent: Base64.encodeToBase64("This is a test attachment."),
        headers: {
          "Content-Disposition": 'attachment; filename="test.txt"',
          "Content-Type": 'text/html; charset="utf8"',
          "Content-Transfer-Encoding": "base64",
        },
      },
    ];

    const result = emailBuilder.getRawMessage(headers, attachments);
    expect(result).toContain(
      'Content-Disposition: attachment; filename="test.txt"'
    );
    expect(result).toContain(
      Base64.encodeToBase64("This is a test attachment.")
    );
  });

  it("should encode the message correctly when no errors occur", () => {
    const header = new EmailBuilderHeader();
    header
      .setFrom("sender <sender@example.com>")
      .setTo("receiver <receiver@example.com>")
      .setSubject("Test Email");

    emailBuilder.messagebody = "This is a test email.";
    const attachments: AttachmentType[] = [
      {
        size: 12,
        mimeType: "text/plain",
        attachmentId: "1",
        filename: "test.txt",
        attachmentContent: Base64.encodeToBase64("This is a test attachment."),
        headers: {
          "Content-Disposition": 'attachment; filename="test.txt"',
          "Content-Type": 'text/html; charset="utf8"',
          "Content-Transfer-Encoding": "base64",
        },
      },
    ];

    const encodedMessage = emailBuilder.getEncodedMessage(
      header.headers,
      attachments
    );
    const rawMessage = emailBuilder.getRawMessage(header.headers, attachments);

    // Assert the message is correctly encoded in base64
    expect(encodedMessage).toBe(Base64.encodeToBase64(rawMessage as string));
  });

  it("should return the error message if an EmailError occurs", () => {
    const invalidHeader = {} as any;
    const encodedMessage = emailBuilder.getEncodedMessage(invalidHeader);

    expect(encodedMessage).toContain("The email message should contain a body");
  });

  it("should set the email signature correctly", () => {
    const signatureData: NonNullableType<Omit<GetSignatureType, "from">> = {
      url: "https://example.com",
      name: "Example App",
    };

    emailBuilder.setSignature(signatureData);

    expect(emailBuilder.applicationSignature).toEqual({
      url: "https://example.com",
      name: "Example App",
    });
  });
});
