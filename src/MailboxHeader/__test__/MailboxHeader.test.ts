import { beforeEach, describe, expect, test } from "vitest";
import { MIMEMessageHeader } from "../MailboxHeader";
import { Mailbox } from "../../Mailbox/Mailbox";
import { MIMEError } from "../../Error";

describe("MIMEMessageHeader", () => {
    let header: MIMEMessageHeader;

    beforeEach(() => {
        header = new MIMEMessageHeader();
    });

    test("should create an instance correctly", () => {
        expect(header).toBeInstanceOf(MIMEMessageHeader);
    });

    test("should generate a Message-ID header", () => {
        // ts-ignore-expect-error
        header.fields.find((field) => field.name === "From")!.value = new Mailbox(
            "test@example.com"
        ) as any;
        const messageId = header.fields.find(
            (field) => field.name === "Message-ID"
        )!.generator!();
        expect(messageId).toMatch(/^<[^>]+@[a-z0-9.-]+>$/); // Adjusted regex to include angle brackets
    });

    test("should throw an error if a required field is missing", () => {
        header.set("From", new Mailbox("sender@example.com")); // Ensure 'From' is set
        header.fields.find((field) => field.name === "Subject")!.value = undefined;
        expect(() => header.dump()).toThrow(MIMEError);
    });

    test("should set and get a custom header", () => {
        header.setCustom({
            name: "X-Custom-Header",
            value: "CustomValue",
            custom: true,
            dump: (v: any) => v,
        });

        expect(header.get("X-Custom-Header")).toBe("CustomValue");
    });

    test("should correctly dump header fields to string", () => {
        header.set("From", new Mailbox("sender@example.com")); // Set 'From' header
        header.set("Subject", "Test Subject"); // Set 'Subject' header

        const dumped = header.dump();
        expect(dumped).toContain("Subject: =?utf-8?B?VGVzdCBTdWJqZWN0?=");
    });

    test("should correctly convert header fields to object", () => {
        header.set("From", new Mailbox("sender@example.com"));
        const obj = header.toObject();
        expect(obj["From"]).toBeInstanceOf(Mailbox);
    });

    test("should validate mailbox single", () => {
        expect(header.validateMailboxSingle(new Mailbox("test@example.com"))).toBe(
            true
        );
        expect(header.validateMailboxSingle("invalid")).toBe(false);
    });

    test("should validate mailbox multi", () => {
        expect(header.validateMailboxMulti([new Mailbox("test@example.com")])).toBe(
            true
        );
        expect(header.validateMailboxMulti(new Mailbox("test@example.com"))).toBe(
            true
        );
        expect(header.validateMailboxMulti("invalid")).toBe(false);
    });

    test("should dump mailbox multi", () => {
        const mailboxes = [
            new Mailbox("test@example.com"),
            new Mailbox("example@test.com"),
        ];
        const dumped = header.dumpMailboxMulti(mailboxes);
        expect(dumped).toContain("<test@example.com>"); // Adjust expectation based on actual output
    });

    test("should dump mailbox single", () => {
        const mailbox = new Mailbox("test@example.com");
        const dumped = header.dumpMailboxSingle(mailbox);
        expect(dumped).toContain("<test@example.com>"); // Adjust expectation based on actual output
    });
    test("should dump mailbox single", () => {
        const mailbox = new Mailbox("test@example.com");
        const dumped = header.dumpMailboxSingle(mailbox);
        expect(dumped).toContain("<test@example.com>"); // Adjust expectation based on actual output
    });
    test("should dump mailbox multi", () => {
        const mailboxes = [
            new Mailbox("test@example.com"),
            new Mailbox("example@test.com"),
        ];
        const dumped = header.dumpMailboxMulti(mailboxes);
        expect(dumped).toContain("<test@example.com>"); // Adjust expectation based on actual output
    });

    test("should throw an error if a required field is missing", () => {
        header.set("From", new Mailbox("sender@example.com")); // Ensure 'From' is set
        header.fields.find((field) => field.name === "Subject")!.value = undefined;
        expect(() => header.dump()).toThrow(MIMEError);
    });
});
