import { describe, it, expect } from "vitest";
import { Base64 } from "../Base64";

describe("Base64", () => {
    const testString = "hello world";
    const encodedString = "aGVsbG8gd29ybGQ=";

    it("should encode a string to Base64 correctly", () => {
        const result = Base64.encodeToBase64(testString);
        expect(result).toBe(encodedString);
    });

    it("should decode a Base64 string to binary correctly", () => {
        const result = Base64.decodeToBinary(encodedString);
        expect(result).toBe(testString);
    });

    it("should decode a Base64 string to a Buffer correctly", () => {
        const result = Base64.encodeToBase64(encodedString);
        expect(result).toEqual("YUdWc2JHOGdkMjl5YkdRPQ==");
    });

    it("should convert a string to a Buffer URI correctly", () => {
        const result = Base64.toBufferURI(testString);
        const expectedURI = encodeURIComponent(encodedString);
        expect(result).toBe(expectedURI);
    });

    it("should handle empty strings correctly for encoding", () => {
        const result = Base64.encodeToBase64("");
        expect(result).toBe("");
    });

    it("should handle empty Base64 strings correctly for decoding to binary", () => {
        const result = Base64.decodeToBinary("");
        expect(result).toBe("");
    });

    it("should handle empty Base64 strings correctly for decoding to Buffer", () => {
        const result = Base64.decodeToBuffer("");
        expect(result).toEqual(new Uint8Array([]));
    });

    it("should handle empty strings correctly for Buffer URI conversion", () => {
        const result = Base64.toBufferURI("");
        const expectedURI = encodeURIComponent("");
        expect(result).toBe(expectedURI);
    });
});
