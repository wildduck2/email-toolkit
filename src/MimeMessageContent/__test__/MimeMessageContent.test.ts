import { beforeEach, describe, expect, test } from "vitest";
import { MIMEMessageContent } from "../MimeMessageContent";

describe("MIMEMessageContent", () => {
    let content: MIMEMessageContent;

    beforeEach(() => {
        content = new MIMEMessageContent("Test data");
    });

    test("should create an instance correctly", () => {
        expect(content).toBeInstanceOf(MIMEMessageContent);
    });

    test("should dump content with headers and data", () => {
        content.setHeader("Content-Type", "text/plain");
        const dumped = content.dump();
        expect(dumped).toContain("Content-Type: text/plain");
        expect(dumped).toContain("Test data");
    });

    test("should check if content is an attachment", () => {
        content.setHeader("Content-Disposition", "attachment; filename=test.txt");
        expect(content.isAttachment()).toBe(true);
        content.setHeader("Content-Disposition", "inline; filename=test.txt");
        expect(content.isAttachment()).toBe(false);
    });

    test("should check if content is an inline attachment", () => {
        content.setHeader("Content-Disposition", "inline; filename=test.txt");
        expect(content.isInlineAttachment()).toBe(true);
        content.setHeader("Content-Disposition", "attachment; filename=test.txt");
        expect(content.isInlineAttachment()).toBe(false);
    });

    test("should set and get a single header", () => {
        content.setHeader("X-Custom-Header", "CustomValue");
        expect(content.getHeader("X-Custom-Header")).toBe("CustomValue");
    });

    test("should set multiple headers", () => {
        const headers = {
            "X-Custom-Header1": "Value1",
            "X-Custom-Header2": "Value2",
        };
        content.setHeaders(headers);
        expect(content.getHeader("X-Custom-Header1")).toBe("Value1");
        expect(content.getHeader("X-Custom-Header2")).toBe("Value2");
    });

    test("should get headers as an object", () => {
        content.setHeader("Content-Type", "text/plain");
        const headers = content.getHeaders();
        expect(headers["Content-Type"]).toBe("text/plain");
    });
});
