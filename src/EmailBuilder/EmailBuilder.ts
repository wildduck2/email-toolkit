import type { z } from "zod";
import { Base64 } from "../Base64";
import { EmailError } from "../Error";
import {
  ContentTransferEncodingSchema,
  HeadersTypeSchema,
  LabelsTypeSchema,
  StringSchema,
} from "../zod/zod";

import {
  type AddMessageType,
  type ApplicationSignature,
  type AttachmentType,
  type EmailBuilderClass,
  type HeadersType,
} from "./EmailBuilder.types";
import type { ContentTransferEncoding } from "../index.types";
import { EmailBuilderUtils } from "./EmailBuilderUtils";
import { EmailValidator } from "../EmailValidator";

export class EmailBuilder
  extends EmailBuilderUtils
  implements EmailBuilderClass
{
  headers: HeadersType | null = null;
  snippet: string = "";
  labels: Uppercase<string>[] = [];
  MimeType: string = "text/plain";
  messageBody: string = "";
  attachments: AttachmentType[] = [];
  applicationSignature: ApplicationSignature | null = null;
  boundary = "boundary";

  constructor() {
    super();
  }
}

//  public createFileWithMessage() {
//    const binary = Base64.encodeToBase64(this.asRaw());
//    return {
//      size: binary.length,
//      type: "application/octet-stream",
//      data: binary,
//    };
//  }
//
//  addMessage({
//    data,
//    charset,
//    headers,
//    encoding,
//    contentType,
//    attachments,
//  }: AddMessageType): this {
//    const { data: parsedHeaders, error: parsedHeadersError } =
//      this.isValidHeaders(headers);
//
//    let typeName = parsedHeaders?.["Content-Type"] || contentType || "none";
//    const { data: parsedType, error: parsedTypeError } =
//      this.isValidContentType(typeName);
//
//    const encodingName =
//      parsedHeaders?.["Content-Transfer-Encoding"] || encoding || "7bit";
//    const { data: parsedEncoding, error: parsedEncodingError } =
//      this.isVValidContentTransferEncoding(encodingName);
//
//    const charsetName = charset || "UTF-8";
//    const { data: parsedCharset } = this.isValidCharset(charsetName);
//    parsedEncodingError && (typeName = "application/octet-stream");
//
//    const error = parsedTypeError || parsedHeadersError;
//    if (error) {
//      this.logError(error);
//    }
//
//    this.headers = {
//      ...this.headers,
//      ...parsedHeaders,
//      "Content-Transfer-Encoding": parsedEncoding,
//      "Content-Type": `${parsedType}; charset=${parsedCharset || "UTF-8"}`,
//    } as HeadersType;
//
//    const { data: parsedData, error: parsedDataError } = this.isValidData(data);
//    if (parsedDataError) {
//      this.logError(parsedDataError);
//    }
//
//    this.messageBody = parsedData as string;
//    return this;
//  }
//
//  public asRaw(): string {
//    const cc = this.headers?.Cc;
//    const bcc = this.headers?.Bcc;
//    const inReplyTo = this.headers?.["In-Reply-To"];
//
//    const rawMessage = [
//      `From: ${this.headers?.From}`,
//      `To: ${this.headers?.To}`,
//      `Subject: ${this.headers?.Subject}`,
//      cc ? `Cc: ${cc}` : "",
//      bcc ? `Bcc: ${bcc}` : "",
//      `In-Reply-To: ${inReplyTo}`,
//      `Content-Type: multipart/mixed; boundary="${this.boundary}"`,
//      ``,
//      `--${this.boundary}`,
//      `Content-Type: ${this.headers?.["Content-Type"]}`,
//      `Content-Transfer-Encoding: ${this.headers?.["Content-Transfer-Encoding"]}`,
//      ``,
//      `${this.messageBody}`,
//
//      ...this.createAttachmentContent(),
//      "--" + "boundary" + "--",
//      // ...this.getSignature(),
//    ].join("\r\n");
//
//    return rawMessage;
//  }
//
//  public createAttachmentContent() {
//    return this.attachments.flatMap((attachment) => {
//      return [
//        ``,
//        `--${this.boundary}`,
//        `Content-Type: ${this.headers?.["Content-Type"]}`,
//        `Content-Transfer-Encoding: ${this.headers?.["Content-Transfer-Encoding"]}`,
//        `Content-Disposition: attachment; filename="${attachment.filename}"`,
//        ``,
//        attachment.attachmentContent,
//        ``,
//      ];
//    });
//  }
//
//  public createEmailWithAttachment() {
//    const emailParts = [
//      `To: wezonaser50@gmail.com`,
//      `From: wezonaser50@gmail.com`,
//      `Subject: Hello mr duck`,
//      'Content-Type: multipart/mixed; boundary="' + "boundary" + '"',
//      "",
//      "--" + "boundary",
//      'Content-Type: text/plain; charset="UTF-8"',
//      "Content-Transfer-Encoding: 7bit",
//      "",
//      "Hello mr duck what do you want to eat",
//      "",
//      "--" + "boundary",
//      'Content-Type: text/html; charset="UTF-8"',
//      "Content-Transfer-Encoding: 7biy",
//      'Content-Disposition: attachment; filename="message.html"',
//      "",
//      // thread.textHtml,
//      "--" + "boundary" + "--",
//    ];
//
//    // const hi = parseMail(emailParts.join("\n"));
//  }
//
//  public asEncoded(): string {
//    const rawMessage = this.asRaw();
//    return Base64.encodeToBase64(rawMessage);
//  }
//
//
//  public setApplicationSignature(
//    applicationSignature: ApplicationSignature
//  ): this {
//    this.applicationSignature = applicationSignature;
//    return this;
//  }
//
