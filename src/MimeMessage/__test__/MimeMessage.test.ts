import { beforeEach, describe, expect, test } from "vitest";
import { MIMEMessageContent } from "../../MimeMessageContent";
import { EmailErrorInterface } from "../../Error";
import { MIMEMessage } from "../MimeMessage";

describe("MIMEMessage", () => {
    let message: MIMEMessage;

    beforeEach(() => {
        message = new MIMEMessage();
    });

    test("should add and retrieve messages", () => {
        // Add message with invalid Content-Type
        const message = new MIMEMessage();
        expect(() => {
            message.addMessage({
                headers: {
                    "Content-Type": "none",
                },
                data: "Test body",
                contentType: "text/plain",
            });
        }).toThrow(
            new EmailError(
                "MIMETEXT_INVALID_MESSAGE_TYPE",
                `Valid content types are text/html, text/plain but you specified "none".`
            )
        );
    });

    test("should add and retrieve messages with valid content type", () => {
        const message = new MIMEMessage();
        const validContentTypes = ["text/html", "text/plain"];

        validContentTypes.forEach((type) => {
            expect(() => {
                message.addMessage({
                    headers: {
                        "Content-Type": type,
                    },
                    data: "Test body",
                    contentType: type,
                });
            }).not.toThrow();
        });
    });

    test("should construct raw MIME message with attachments", () => {
        const message = new MIMEMessage();
        message.addMessage({
            headers: {
                "Content-Type": "text/plain",
            },
            data: "Test body",
            contentType: "text/plain",
        });

        expect(() => {
            message.asRaw();
        }).toThrow(
            new EmailError("MIMETEXT_MISSING_HEADER", 'The "From" header is required.')
        );
    });

    test("should construct raw MIME message with required headers", () => {
        const msg = new MIMEMessage();
        msg.setSender({ name: "Lorem Ipsum", addr: "lorem@ipsum.com" });
        msg.setRecipient("foobor@test.com");
        msg.setSubject("🚀 Issue 49!");
        msg.addMessage({
            contentType: "text/plain",
            data: `Hi, I'm a simple text.`,
        });

        expect(() => {
            const rawMessage = msg.asRaw();
            expect(rawMessage).toBeDefined();
        }).not.toThrow();
    });

    test("should set and get sender, recipients, and subject", () => {
        const message = new MIMEMessage();
        message.setSender("sender@example.com");

        expect(message.getSender()).toEqual({
            reSpecCompliantAddr: /(([^<>\r\n]+)\s)?<[^\r\n]+>/,
            name: "",
            addr: "sender@example.com",
            type: "From",
        });
    });
});
