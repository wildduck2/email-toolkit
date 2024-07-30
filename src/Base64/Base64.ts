const encoder = new TextEncoder();

/**
 * Utility class for Base64 encoding and decoding.
 */
export class Base64 {
    /**
     * Encodes a given string into Base64.
     *
     * @param {string} input - The string to be encoded into Base64.
     * @returns {string} The Base64 encoded string.
     *
     * @example
     * const encoded = Base64.encodeToBase64('hello world');
     * console.log(encoded); // Outputs: aGVsbG8gd29ybGQ=
     */
    public static encodeToBase64(input: string): string {
        const bytes = encoder.encode(input);
        const binString = String.fromCodePoint(...bytes);
        return btoa(binString);
    }

    /**
     * Decodes a Base64 encoded string back to its binary representation.
     *
     * @param {string} input - The Base64 encoded string to be decoded.
     * @returns {string} The decoded binary string.
     *
     * @example
     * const decoded = Base64.decodeToBinary('aGVsbG8gd29ybGQ=');
     * console.log(decoded); // Outputs: hello world
     */
    public static decodeToBinary(input: string): string {
        const binString = atob(input);
        const bytes = new Uint8Array(binString.length);
        for (let i = 0; i < binString.length; i++) {
            bytes[i] = binString.charCodeAt(i);
        }
        const decoder = new TextDecoder();
        return decoder.decode(bytes);
    }

    /**
     * Decodes a Base64 encoded string into a Uint8Array.
     *
     * @param {string} input - The Base64 encoded string to be decoded.
     * @returns {Uint8Array} The decoded Uint8Array.
     *
     * @example
     * const buffer = Base64.decodeToBuffer('aGVsbG8gd29ybGQ=');
     * console.log(new TextDecoder().decode(buffer)); // Outputs: hello world
     */
    public static decodeToBuffer(input: string): Uint8Array {
        const binString = atob(input);
        const bytes = new Uint8Array(binString.length);
        for (let i = 0; i < binString.length; i++) {
            bytes[i] = binString.charCodeAt(i);
        }
        return bytes;
    }

    /**
     * Encodes a string into Base64 and then URI encodes the result.
     *
     * @param {string} input - The string to be encoded and URI encoded.
     * @returns {string} The URI encoded Base64 string.
     *
     * @example
     * const uriEncoded = Base64.toBufferURI('hello world');
     * console.log(uriEncoded); // Outputs: aGVsbG8gd29ybGQ%3D
     */
    public static toBufferURI(input: string): string {
        return encodeURIComponent(this.encodeToBase64(input));
    }
}
