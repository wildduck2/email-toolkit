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
  type EmailBuilderClass,
  type HeadersType,
} from "./EmailBuilder.types";
import type { ContentTransferEncoding } from "../index.types";

export class EmailBuilder implements EmailBuilderClass {
  headers: HeadersType | null = null;
  snippet: string = "";
  labels: Uppercase<string>[] = [];
  MimeType: string = "text/plain";
  data: string = "";
  applicationSignature: ApplicationSignature | null = null;

  constructor() {
    // const foo = this.addMessage({
    //   data: "<p>asdf</p>",
    //   charset: "UTF-8",
    //   headers: {
    //     Date: "Wed, 31 Jul 2024 13:39:10 GMT",
    //     From: "wildduck2/email-builder <email-builder@noreply.github.com>",
    //     To: "Ahmed Ayob <notifications@github.com>",
    //     Subject:
    //       "RE: [wildduck2/email-builder] Run failed: CI - main (b682de3)",
    //     "In-Reply-To": "19108cbf60f51f1a",
    //     "Content-Type": "text/html",
    //     "Content-Transfer-Encoding": "base64",
    //   },
    //   encoding: "7bit",
    //   contentType: "text/plain",
    // }).asRaw();
    //
    // const binary = this.createFileWithMessage();
    // console.log(foo);
    // // console.log(binary);
  }

  public createFileWithMessage() {
    const binary = Base64.encodeToBase64(this.asRaw());
    const bytes = Base64.decodeToBuffer(binary);
    const byteArray = new Uint8Array(bytes);
    const blob = new Blob([byteArray], {
      type: "application/octet-stream",
    });
    const url = URL.createObjectURL(blob);
    return {
      name: url.split(":")[2],
      size: blob.size,
      type: blob.type,
      data: binary,
    };
  }

  addMessage({
    data,
    charset,
    headers,
    encoding,
    contentType,
  }: AddMessageType): this {
    const { data: parsedHeaders, error: parsedHeadersError } =
      this.isValidHeaders(headers);

    let typeName = parsedHeaders?.["Content-Type"] || contentType || "none";
    const { data: parsedType, error: parsedTypeError } =
      this.isValidContentType(typeName);

    const encodingName =
      parsedHeaders?.["Content-Transfer-Encoding"] || encoding || "7bit";
    const { data: parsedEncoding, error: parsedEncodingError } =
      this.isVValidContentTransferEncoding(encodingName);

    const charsetName = charset || "UTF-8";
    const { data: parsedCharset } = this.isValidCharset(charsetName);
    parsedEncodingError && (typeName = "application/octet-stream");

    const error = parsedTypeError || parsedHeadersError;
    if (error) {
      this.logError(error);
    }

    this.headers = {
      ...this.headers,
      ...parsedHeaders,
      "Content-Transfer-Encoding": parsedEncoding,
      "Content-Type": `${parsedType}; charset=${parsedCharset || "UTF-8"}`,
    } as HeadersType;

    const { data: parsedData, error: parsedDataError } = this.isValidData(data);
    if (parsedDataError) {
      this.logError(parsedDataError);
    }

    this.data = parsedData as string;
    return this;
  }

  public asRaw(): string {
    const cc = this.headers?.Cc;
    const bcc = this.headers?.Bcc;
    const inReplyTo = this.headers?.["In-Reply-To"];

    const rawMessage = [
      `From: ${this.headers?.From}`,
      `To: ${this.headers?.To}`,
      `Subject: ${this.headers?.Subject}`,
      cc ? `Cc: ${cc}` : "",
      bcc ? `Bcc: ${bcc}` : "",
      `In-Reply-To: ${inReplyTo}`,
      `Content-Type: text/html; charset=utf-8`,
      `Content-Transfer-Encoding: base64`,
      ``,
      `${this.data}`,
      ``,
      `</div>`,
      `<div style="margin: 1rem">`,
      `---------------------------------`,
      `<p>This email was sent from ${this.headers?.From} by <a style="color: blue" href="${this.applicationSignature?.url}" target="_blank">${this.applicationSignature?.name}</a> app</p>`,
      `---------------------------------`,
      `</div>`,
    ].join("\r\n");

    return rawMessage;
  }

  public asEncoded(): string {
    const rawMessage = this.asRaw();
    return Base64.encodeToBase64(rawMessage);
  }

  public setMimeType(mimeType: string): this {
    const { data: parsedMimeType, error: parsedTypeError } =
      this.isValidMimeType(mimeType);

    if (parsedTypeError) {
      this.logError(parsedTypeError);
    }

    this.MimeType = parsedMimeType as string;
    return this;
  }

  public setApplicationSignature(
    applicationSignature: ApplicationSignature
  ): this {
    this.applicationSignature = applicationSignature;
    return this;
  }

  public setData(data: string): this {
    this.data = data;
    return this;
  }

  public setSnippet(snippet: string): this {
    this.snippet = snippet;
    return this;
  }

  public setHeaders(headers: HeadersType): this {
    const { data: parsedHeaders, error } = this.isValidHeaders(headers);
    if (error) {
      this.logError(error);
    }

    this.headers = parsedHeaders as HeadersType;
    return this;
  }

  public setLabels(labels: Uppercase<string>[]): this {
    const { data: parsedLabels, error } = this.isValidLabels(labels);
    if (error) {
      this.logError(error);
    }

    this.labels = parsedLabels as Uppercase<string>[];
    return this;
  }

  private logError(error: z.ZodError) {
    throw new EmailError({
      message: error.message,
      description: error.message,
    });
  }

  private isValidLabels(
    labels: Uppercase<string>[]
  ): z.SafeParseReturnType<string[], string[]> {
    return LabelsTypeSchema.safeParse(labels);
  }

  private isValidHeaders(
    headers: HeadersType | undefined
  ): z.SafeParseReturnType<HeadersType, z.infer<typeof HeadersTypeSchema>> {
    return HeadersTypeSchema.safeParse(headers);
  }

  private isValidData(data: string): z.SafeParseReturnType<string, string> {
    return StringSchema.safeParse(data);
  }

  private isValidCharset(
    charset: string
  ): z.SafeParseReturnType<string, string> {
    return StringSchema.safeParse(charset);
  }

  private isValidMimeType(
    mimeType: string
  ): z.SafeParseReturnType<string, string> {
    return StringSchema.safeParse(mimeType);
  }

  private isVValidContentTransferEncoding(
    encoding: ContentTransferEncoding
  ): z.SafeParseReturnType<ContentTransferEncoding, ContentTransferEncoding> {
    return ContentTransferEncodingSchema.safeParse(encoding);
  }

  private isValidContentType(
    contentType: string
  ): z.SafeParseReturnType<string, string> {
    return StringSchema.safeParse(contentType);
  }
}
