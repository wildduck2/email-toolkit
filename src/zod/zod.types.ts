export const ContentTransferEncoding = [
  "7bit",
  "8bit",
  "binary",
  "base64",
  "quoted-printable",
] as const;

export const CharsetType = [
  "utf-8",
  "utf8",
  "utf16le",
  "utf-16le",
  "latin1",
] as const;
export const MIMETypes = ["text/html", "text/plain"] as const;
export type ContentDispositionType =
  `${AttachmentTypeType}; filename="${string}"`;
export type AttachmentTypeType = "inline" | "attachment" | "form-data";
