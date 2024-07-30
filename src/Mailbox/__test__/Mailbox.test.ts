import { describe, it, expect } from "vitest";
import { Mailbox } from "../Mailbox";
import { MIMEError } from "../../Error";

describe("Mailbox Class", () => {
    it("should initialize with a MailboxAddrObject and correctly set properties", () => {
        const mailbox = new Mailbox({
            addr: "example@example.com",
            name: "John Doe",
            type: "To",
        });

        expect(mailbox.addr).toBe("example@example.com");
        expect(mailbox.name).toBe("John Doe");
        expect(mailbox.type).toBe("To");
    });

    it("should initialize with a MailboxAddrText and correctly set properties", () => {
        const mailbox = new Mailbox('"John Doe" <example@example.com>');

        expect(mailbox.addr).toBe("example@example.com");
        expect(mailbox.name).toBe("John Doe");
        expect(mailbox.type).toBe("To");
    });

    it("should initialize with an Email string and correctly set properties", () => {
        const mailbox = new Mailbox("example@example.com");

        expect(mailbox.addr).toBe("example@example.com");
        expect(mailbox.name).toBe("");
        expect(mailbox.type).toBe("To");
    });

    it("should throw MIMEError for invalid input", () => {
        expect(() => new Mailbox(123 as any)).toThrow(MIMEError);
    });

    it("should correctly parse and dump mailbox with name and address", () => {
        const mailbox = new Mailbox({
            addr: "example@example.com",
            name: "John Doe",
            type: "To",
        });

        expect(mailbox.dump()).toBe('"John Doe" <example@example.com>');
    });

    it("should correctly parse and dump mailbox with only address", () => {
        const mailbox = new Mailbox("example@example.com");

        expect(mailbox.dump()).toBe("<example@example.com>");
    });

    it("should correctly get address domain", () => {
        const mailbox = new Mailbox("example@example.com");

        expect(mailbox.getAddrDomain()).toBe("example.com");
    });

    it("should correctly handle mailbox address without angle brackets", () => {
        const mailbox = new Mailbox("example@example.com");

        expect(mailbox.addr).toBe("example@example.com");
        expect(mailbox.name).toBe("");
    });

    it("should correctly handle mailbox address with angle brackets", () => {
        const mailbox = new Mailbox("<example@example.com>");

        expect(mailbox.addr).toBe("example@example.com");
        expect(mailbox.name).toBe("");
    });

    it("should correctly parse mailbox address with quotes and angle brackets", () => {
        const mailbox = new Mailbox('"John Doe" <example@example.com>');

        expect(mailbox.addr).toBe("example@example.com");
        expect(mailbox.name).toBe("John Doe");
    });

    it("should correctly handle mailbox address with name and no angle brackets", () => {
        const mailbox = new Mailbox("John Doe <example@example.com>");

        expect(mailbox.addr).toBe("example@example.com");
        expect(mailbox.name).toBe("John Doe");
    });

    it("should throw an error for improperly formatted email", () => {
        expect(new Mailbox("invalid-email")).toEqual({
            addr: "invalid-email",
            name: "",
            reSpecCompliantAddr: /(([^<>\r\n]+)\s)?<[^\r\n]+>/,
            type: "To",
        });
    });
});
