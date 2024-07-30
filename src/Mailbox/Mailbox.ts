import { MIMEError } from "../Error";
import type {
    Email,
    MailboxAddrObject,
    MailboxAddrText,
    MailboxType,
} from "../index.types";
import type { MailboxClass } from "./Mailbox.types";

export class Mailbox implements MailboxClass {
    reSpecCompliantAddr: RegExp = /(([^<>\r\n]+)\s)?<[^\r\n]+>/;
    name = "";
    addr = "";
    type: MailboxType = "To";

    constructor(
        input: MailboxAddrObject | MailboxAddrText | Email,
        config = { type: "To" } as { type: MailboxType }
    ) {
        this.type = config.type;
        this.parse(input);
    }

    getAddrDomain(): string {
        return (this.addr.includes("@") ? this.addr.split("@")[1] : "") as string;
    }

    dump() {
        return this.name ? `"${this.name}" <${this.addr}>` : `<${this.addr}>`;
    }

    parse(input: MailboxAddrObject | MailboxAddrText | Email) {
        if (this.isMailboxAddrObject(input)) {
            this.addr = input.addr;
            if (typeof input.name === "string") this.name = input.name;
            if (typeof input.type === "string") this.type = input.type;
            return this;
        }
        if (this.isMailboxAddrText(input)) {
            const text = input.trim();
            if (text.slice(0, 1) == "<" && text.slice(-1) == ">") {
                this.addr = text.slice(1, -1);
                return this;
            }
            const arr = text.split("<");
            arr[0] = arr[0]!.trim();
            arr[0] = /^("|')/.test(arr[0]) ? arr[0].slice(1) : arr[0];
            arr[0] = /("|')$/.test(arr[0]) ? arr[0].slice(0, -1) : arr[0];
            arr[1] = arr[1]!.slice(0, -1);
            this.name = arr[0];
            this.addr = arr[1];
            return this;
        }
        if (typeof input === "string") {
            this.addr = input;
            return this;
        }
        throw new MIMEError(
            "MIMETEXT_INVALID_MAILBOX",
            "The provided input does not conform to a valid mailbox address format. Please ensure the input is either a properly formatted string or an object with an 'addr' property."
        );
    }

    isMailboxAddrText(v: unknown): v is string {
        return typeof v === "string" && this.reSpecCompliantAddr.test(v);
    }

    isMailboxAddrObject(v: unknown): v is { addr: string } {
        return this.isObject(v) && Object.hasOwn(v, "addr");
    }

    isObject(v: unknown): v is Record<string, unknown> {
        return !!v && v.constructor === Object;
    }
}
