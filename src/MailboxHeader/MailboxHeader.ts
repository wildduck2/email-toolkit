import { Base64 } from "../Base64";
import { MIMEError } from "../Error";
import type { HeaderField, MailboxClass } from "../index.types";
import { Mailbox } from "../Mailbox/Mailbox";
import {
    type MIMEMessageContentHeaderClass,
    type MIMEMessageHeaderClass,
} from "./MailboxHeader.types";

/**
 * Class representing the headers of a MIME message.
 * Implements the `MIMEMessageHeaderClass` interface.
 */
export class MIMEMessageHeader implements MIMEMessageHeaderClass {
    /**
     * An array of predefined header fields with their associated
     * validation, dumping, and generation functions.
     * @type {HeaderField[]}
     */
    fields: HeaderField[] = [
        {
            name: "Date",
            generator: () => new Date().toUTCString().replace(/GMT|UTC/gi, "+0000"),
        },
        {
            name: "From",
            required: true,
            validate: (v: unknown) => this.validateMailboxSingle(v),
            dump: (v: unknown) => this.dumpMailboxSingle(v),
        },
        {
            name: "Sender",
            validate: (v: unknown) => this.validateMailboxSingle(v),
            dump: (v: unknown) => this.dumpMailboxSingle(v),
        },
        {
            name: "Reply-To",
            validate: (v: unknown) => this.validateMailboxMulti(v),
            dump: (v: unknown) => this.dumpMailboxMulti(v),
        },
        {
            name: "To",
            validate: (v: unknown) => this.validateMailboxMulti(v),
            dump: (v: unknown) => this.dumpMailboxMulti(v),
        },
        {
            name: "Cc",
            validate: (v: unknown) => this.validateMailboxMulti(v),
            dump: (v: unknown) => this.dumpMailboxMulti(v),
        },
        {
            name: "Bcc",
            validate: (v: unknown) => this.validateMailboxMulti(v),
            dump: (v: unknown) => this.dumpMailboxMulti(v),
        },
        {
            name: "Message-ID",
            generator: () => {
                const randomstr = Math.random().toString(36).slice(2);
                const from = this.fields.filter((obj) => obj.name === "From")[0]!
                    .value as Mailbox;
                const domain = from.getAddrDomain();
                return `<${randomstr}@${domain}>`;
            },
        },
        {
            name: "Subject",
            required: true,
            dump: (v: unknown) => {
                return typeof v === "string"
                    ? `=?utf-8?B?${Base64.encodeToBase64(v)}?=`
                    : "";
            },
        },
        {
            name: "MIME-Version",
            generator: () => "1.0",
        },
    ];

    /**
     * Converts the header fields to a formatted string.
     * Each field is converted according to its specific dumping function
     * or defaulted to its string value if no dumping function is provided.
     * @returns {string} The formatted header fields as a string.
     * @throws {MIMEError} Throws an error if a required field is missing.
     */
    dump(): string {
        let lines = "";
        for (const field of this.fields) {
            if (field.disabled) continue;
            const isValueDefinedByUser =
                field.value !== undefined && field.value !== null;
            if (!isValueDefinedByUser && field.required) {
                throw new MIMEError(
                    "MIMETEXT_MISSING_HEADER",
                    `The "${field.name}" header is required.`
                );
            }
            if (!isValueDefinedByUser && typeof field.generator !== "function")
                continue;
            if (!isValueDefinedByUser && typeof field.generator === "function")
                field.value = field.generator();
            const strval =
                Object.hasOwn(field, "dump") && typeof field.dump === "function"
                    ? field.dump(field.value)
                    : typeof field.value === "string"
                        ? field.value
                        : "";
            lines += `${field.name}: ${strval}\r\n`;
        }
        return lines.slice(0, -2); // Remove the last \r\n
    }

    /**
     * Converts the header fields to an object where the keys are the field names
     * and the values are the field values.
     * @returns {{ [index: string]: any }} The header fields as an object.
     */
    toObject(): { [index: string]: any } {
        return this.fields.reduce((memo, item) => {
            memo[item.name] = item.value;
            return memo;
        }, {} as { [index: string]: any });
    }

    /**
     * Retrieves the value of a specific header field by name.
     * @param {string} name - The name of the header field to retrieve.
     * @returns {string | MailboxClass | undefined} The value of the header field, or `undefined` if not found.
     */
    get(name: string): string | MailboxClass | undefined {
        const fieldMatcher = (obj: HeaderField) =>
            obj.name.toLowerCase() === name.toLowerCase();
        const ind = this.fields.findIndex(fieldMatcher);
        return ind !== -1 ? this.fields[ind]!.value : undefined;
    }

    /**
     * Sets the value of a specific header field by name.
     * If the header field does not exist, it is added as a custom header.
     * @param {string} name - The name of the header field to set.
     * @param {any} value - The value to set for the header field.
     * @returns {HeaderField} The updated or newly created header field.
     * @throws {MIMEError} Throws an error if the value is invalid for the field.
     */
    set(name: string, value: any): HeaderField {
        const fieldMatcher = (obj: HeaderField) =>
            obj.name.toLowerCase() === name.toLowerCase();
        const isCustomHeader = !this.fields.some(fieldMatcher);
        if (!isCustomHeader) {
            const ind = this.fields.findIndex(fieldMatcher);
            const field = this.fields[ind];
            if (field!.validate && !field!.validate(value)) {
                throw new MIMEError(
                    "MIMETEXT_INVALID_HEADER_VALUE",
                    "You specified an invalid value for the header " + name
                );
            }
            this.fields[ind]!.value = value;
            return this.fields[ind] as HeaderField;
        }
        return this.setCustom({
            name: name,
            value: value,
            custom: true,
            dump: (v: any) => (typeof v === "string" ? v : ""),
        });
    }

    /**
     * Adds a custom header field to the list of header fields.
     * @param {HeaderField} obj - The custom header field to add.
     * @returns {HeaderField} The added custom header field.
     * @throws {MIMEError} Throws an error if the header field object is invalid.
     */
    setCustom(obj: HeaderField): HeaderField {
        if (this.isHeaderField(obj)) {
            if (typeof obj.value !== "string") {
                throw new MIMEError(
                    "MIMETEXT_INVALID_HEADER_FIELD",
                    "Custom header must have a value."
                );
            }
            this.fields.push(obj);
            return obj;
        }
        throw new MIMEError(
            "MIMETEXT_INVALID_HEADER_FIELD",
            "You specified an invalid header field object."
        );
    }

    /**
     * Validates if a value is a single Mailbox instance.
     * @param {unknown} v - The value to validate.
     * @returns {boolean} `true` if the value is a Mailbox instance, otherwise `false`.
     */
    validateMailboxSingle(v: unknown): boolean {
        return v instanceof Mailbox;
    }

    /**
     * Validates if a value is a single Mailbox instance or an array of Mailbox instances.
     * @param {unknown} v - The value to validate.
     * @returns {boolean} `true` if the value is a Mailbox instance or an array of Mailbox instances, otherwise `false`.
     */
    validateMailboxMulti(v: unknown): boolean {
        return v instanceof Mailbox || this.isArrayOfMailboxes(v);
    }

    /**
     * Converts an array of Mailbox instances or a single Mailbox instance to a formatted string.
     * @param {unknown} v - The value to convert.
     * @returns {string} The formatted string representation of the Mailbox instances.
     */
    dumpMailboxMulti(v: unknown): string {
        const dump = (item: Mailbox) =>
            item.name.length === 0
                ? item.dump()
                : `=?utf-8?B?${Base64.encodeToBase64(item.name)}?= <${item.addr}>`;
        return this.isArrayOfMailboxes(v)
            ? (v as Mailbox[]).map(dump).join(`,\r\n `)
            : v instanceof Mailbox
                ? dump(v)
                : "";
    }

    /**
     * Converts a single Mailbox instance to a formatted string.
     * @param {unknown} v - The value to convert.
     * @returns {string} The formatted string representation of the Mailbox instance.
     */
    dumpMailboxSingle(v: unknown): string {
        const dump = (item: Mailbox) =>
            item.name.length === 0
                ? item.dump()
                : `=?utf-8?B?${Base64.encodeToBase64(item.name)}?= <${item.addr}>`;
        return v instanceof Mailbox ? dump(v) : "";
    }

    /**
     * Checks if a value is an array of Mailbox instances.
     * @param {unknown} v - The value to check.
     * @returns {boolean} `true` if the value is an array of Mailbox instances, otherwise `false`.
     */
    isArrayOfMailboxes(v: unknown): v is Mailbox[] {
        return Array.isArray(v) && v.every((item) => item instanceof Mailbox);
    }

    /**
     * Checks if a given object is a valid header field.
     * @param {HeaderField} v - The object to check.
     * @returns {boolean} `true` if the object is a valid header field, otherwise `false`.
     */
    isHeaderField(v: HeaderField): v is HeaderField {
        return (
            typeof v.name === "string" &&
            (typeof v.value === "string" || v.value instanceof Mailbox) &&
            (v.dump === undefined || typeof v.dump === "function") &&
            (v.validate === undefined || typeof v.validate === "function")
        );
    }

    /**
     * Checks if the given value is an object.
     * @param {unknown} v - The value to check.
     * @returns {v is object} - Returns true if the value is an object, otherwise false.
     * @throws {Error} - Throws an error if the method is not implemented.
     */
    isObject(v: unknown): v is object {
        throw new Error("Method not implemented.");
    }

    /**
     * Checks if the given value is an array.
     * @param {unknown} v - The value to check.
     * @returns {v is any[]} - Returns true if the value is an array, otherwise false.
     * @throws {Error} - Throws an error if the method is not implemented.
     */
    isArray(v: unknown): v is any[] {
        throw new Error("Method not implemented.");
    }
}

/**
 * Class representing the headers of MIME message content.
 * Implements the `MIMEMessageContentHeaderClass` interface.
 */
export class MIMEMessageContentHeader
    extends MIMEMessageHeader
    implements MIMEMessageContentHeaderClass {
    /**
     * An array of predefined content header fields.
     * @type {Array<{ name: string }>}
     */
    fields: Array<{ name: string }> = [
        {
            /**
             * The name of the content header field.
             * @type {string}
             */
            name: "Content-ID",
        },
        {
            /**
             * The name of the content header field.
             * @type {string}
             */
            name: "Content-Type",
        },
        {
            /**
             * The name of the content header field.
             * @type {string}
             */
            name: "Content-Transfer-Encoding",
        },
        {
            /**
             * The name of the content header field.
             * @type {string}
             */
            name: "Content-Disposition",
        },
    ];
}
