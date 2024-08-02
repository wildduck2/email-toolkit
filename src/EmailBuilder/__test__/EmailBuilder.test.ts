import { describe, it, expect, beforeEach } from "vitest";
import { EmailBuilder } from "../EmailBuilder";
import type { AddMessageType, HeadersType } from "../EmailBuilder.types";
import { Base64 } from "../../Base64";
import "blob-polyfill";

describe("EmailBuilder", () => {
  let emailBuilder: EmailBuilder;

  beforeEach(() => {
    emailBuilder = new EmailBuilder();
  });

  const headers: HeadersType = {
    Date: "Wed, 31 Jul 2024 13:39:10 GMT",
    From: "example <example@example.com>",
    To: "example <example@example.com>",
    Subject: "Test Email",
    "Content-Type": "text/html",
    "Content-Transfer-Encoding": "base64",
  };
  const message: AddMessageType = {
    data: "<p>Hello, world!</p>",
    charset: "UTF-8",
    headers: headers,
    encoding: "7bit",
    contentType: "text/plain",
  };

  it("should create an email with the given message", () => {
    emailBuilder.addMessage(message);

    const rawMessage = emailBuilder.asRaw();
    expect(rawMessage).toContain("Hello, world!");
    expect(rawMessage).toContain("From: example <example@example.com>");
    expect(rawMessage).toContain("To: example <example@example.com>");
    expect(rawMessage).toContain("Subject: Test Email");
  });

  it("should create a file with the encoded message", () => {
    emailBuilder.addMessage(message);

    const file = emailBuilder.createFileWithMessage();
    expect(file.type).toBe("application/octet-stream");
    expect(file.data).toBe(Base64.encodeToBase64(emailBuilder.asRaw()));
  });

  it("should set MIME type", () => {
    emailBuilder.setMimeType("text/html");
    expect(emailBuilder.MimeType).toBe("text/html");
  });

  it("should set application signature", () => {
    const signature = { name: "TestApp", url: "http://testapp.com" };
    emailBuilder.setApplicationSignature(signature);
    expect(emailBuilder.applicationSignature).toEqual(signature);
  });

  it("should set data", () => {
    emailBuilder.setData("<p>Hello, world!</p>");
    expect(emailBuilder.data).toBe("<p>Hello, world!</p>");
  });

  it("should set snippet", () => {
    emailBuilder.setSnippet("This is a snippet.");
    expect(emailBuilder.snippet).toBe("This is a snippet.");
  });

  it("should set headers", () => {
    emailBuilder.setHeaders(headers);
    expect(emailBuilder.headers).toEqual(headers);
  });

  it("should set labels", () => {
    const labels: Uppercase<string>[] = ["INBOX", "IMPORTANT"];
    emailBuilder.setLabels(labels);
    expect(emailBuilder.labels).toEqual(labels);
  });
});
