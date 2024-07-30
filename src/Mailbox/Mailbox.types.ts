import type {
    MailboxAddrObject,
    MailboxAddrText,
    MailboxType,
    Email,
} from "../index.types";

export interface MailboxClass {
    reSpecCompliantAddr: RegExp;
    name: string;
    addr: string;
    type: MailboxType;

    getAddrDomain(): string;
    dump(): string;
    parse(input: MailboxAddrObject | MailboxAddrText | Email): this;
    isMailboxAddrText(v: unknown): v is MailboxAddrText;
    isMailboxAddrObject(v: unknown): v is MailboxAddrObject;
    isObject(v: unknown): v is object;
}
