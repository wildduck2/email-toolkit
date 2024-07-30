import type { HeaderField, MailboxClass } from "../index.types";

export interface MIMEMessageHeaderClass {
    fields: HeaderField[];
    dump(): string;
    toObject(): {
        [index: string]: any;
    };
    get(name: string): string | MailboxClass | undefined;
    set(name: string, value: any): HeaderField;
    setCustom(obj: HeaderField): HeaderField;
    validateMailboxSingle(v: unknown): boolean;
    validateMailboxMulti(v: unknown): boolean;
    dumpMailboxMulti(v: unknown): string;
    dumpMailboxSingle(v: unknown): string;
    isHeaderField(v: unknown): v is HeaderField;
    isObject(v: unknown): v is object;
    isArrayOfMailboxes(v: unknown): boolean;
    isArray(v: unknown): v is any[];
}

export interface MIMEMessageContentHeaderClass {
    fields: {
        name: string;
    }[];
}
