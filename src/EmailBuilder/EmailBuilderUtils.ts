import type { z } from "zod";
import { EmailError } from "../Error";
import {
  ContentTransferEncodingSchema,
  HeadersTypeSchema,
  LabelsTypeSchema,
  StringSchema,
} from "../zod/zod";
import type { ContentTransferEncoding } from "../index.types";
import type { HeadersType } from "./EmailBuilder.types";

export class EmailBuilderUtils {
  constructor() {}

  public getSignature({ from, url, name }: GetSignatureType): string[] {
    return [
      ``,
      `</div>`,
      `<div style="margin: 1rem">`,
      `---------------------------------`,
      `<p>This email was sent from ${from} by <a style="color: blue" href="${url}" target="_blank">${name}</a> app</p>`,
      `---------------------------------`,
      `</div>`,
    ];
  }
}
