import type {
  AttachmentType,
  EmailBuilderAttachmentClass,
} from "./EmailBuilderAttachment.types";

export class EmailBuilderAttachment implements EmailBuilderAttachmentClass {
  attachments: AttachmentType[] | undefined;
  boundary?: string | undefined = "boundary";
  constructor() {}

  public createAttachmentContent() {
    return this.attachments?.flatMap((attachment) => {
      return [
        ``,
        `--${this.boundary}`,
        `Content-Type: ${attachment.headers?.["Content-Type"]}`,
        `Content-Transfer-Encoding: ${attachment.headers?.["Content-Transfer-Encoding"]}`,
        `Content-Disposition: attachment; filename="${attachment.filename}"`,
        ``,
        attachment.attachmentContent,
        ``,
      ];
    });
  }
}
