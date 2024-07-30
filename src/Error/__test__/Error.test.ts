import { describe, it, expect } from "vitest";
import { MIMEError } from "../Error";

describe("MIMETextError", () => {
    it("should correctly set the name and description properties", () => {
        const error = new MIMEError("TestError", "This is a test description");

        expect(error).toBeInstanceOf(MIMEError);
        expect(error.name).toBe("TestError");
        expect(error.description).toBe("This is a test description");
        expect(error.message).toBe("This is a test description");
    });

    it("should correctly set the name property when no description is provided", () => {
        const error = new MIMEError("TestErrorWithoutDescription");

        expect(error).toBeInstanceOf(MIMEError);
        expect(error.name).toBe("TestErrorWithoutDescription");
        expect(error.description).toBe("");
        expect(error.message).toBe("");
    });

    it("should correctly set the description property when only description is provided", () => {
        const error = new MIMEError("TestError", "");

        expect(error).toBeInstanceOf(MIMEError);
        expect(error.name).toBe("TestError");
        expect(error.description).toBe("");
        expect(error.message).toBe("");
    });
});
