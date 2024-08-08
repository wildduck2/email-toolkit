import type {
  AttachmentType,
  EmailBuilderAttachmentClass,
} from "./EmailBuilderAttachment.types";

export class EmailBuilderAttachment implements EmailBuilderAttachmentClass {
  attachments: AttachmentType[] | undefined;
  boundary?: string | undefined = "boundary";
  constructor() {}

  public addAttachment(attachment: AttachmentType) {
    if (!this.attachments) {
      this.attachments = [];
    }
    this.attachments.push(attachment);
  }

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

//NOTE: Use Omit when you need to remove properties from an object type and possibly add them back with different types.
//
//NOTE: Use Exclude when you are dealing with union types and need to remove specific types from the union.
