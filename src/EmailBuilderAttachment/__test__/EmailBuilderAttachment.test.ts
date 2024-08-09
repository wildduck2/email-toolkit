import { describe, it, expect } from "vitest";
import { EmailBuilderAttachment } from "../EmailBuilderAttachment";
import type { AttachmentType } from "../EmailBuilderAttachment.types";

describe("EmailBuilderAttachment", () => {
  const emailBuilderAttachment = new EmailBuilderAttachment();

  const attachment: AttachmentType = {
    attachmentId: "test-attachment-id",
    mimeType: "text/plain",
    size: 1234,
    filename: "test.txt",
    headers: {
      "Content-Type": 'text/html; charset="utf8"',
      "Content-Transfer-Encoding": "7bit",
      "Content-Disposition": 'attachment; filename="test.txt"',
    },
    attachmentContent: "Test content",
  };

  it("should initialize with no attachments", () => {
    expect(emailBuilderAttachment.attachments).toBeUndefined();
  });

  it("should add an attachment", () => {
    emailBuilderAttachment.addAttachment(attachment);

    expect(emailBuilderAttachment.attachments).toHaveLength(1);
    expect(emailBuilderAttachment.attachments![0]).toEqual(attachment);
  });

  it("should generate MIME parts for attachments", () => {
    emailBuilderAttachment.addAttachment(attachment);

    const mimeParts = emailBuilderAttachment.getAttachment();

    expect(mimeParts).toBeDefined();
    expect(mimeParts).toContain(`--${emailBuilderAttachment.boundary}`);
    expect(mimeParts).toContain('Content-Type: text/html; charset="utf8"');
    expect(mimeParts).toContain("Content-Transfer-Encoding: 7bit");
    expect(mimeParts).toContain(
      `Content-Disposition: attachment; filename="test.txt"`
    );
    expect(mimeParts).toContain(`Test content`);
  });
});
