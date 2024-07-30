Based on the information provided, here’s a complete `README.md` for the `@ahmedayob/mime-builder` package:

````markdown
# @ahmedayob/mime-builder

`@ahmedayob/mime-builder` is a TypeScript library for building and manipulating MIME (Multipurpose Internet Mail Extensions) messages. This library provides an easy-to-use API for creating, modifying, and encoding MIME messages, making it ideal for email and other internet-based communication systems.

## Features

- **Create and Manipulate MIME Messages**: Easily create and edit MIME messages.
- **Base64 Encoding/Decoding**: Encode and decode MIME parts using Base64 encoding.
- **Header Management**: Set and retrieve various headers including "Reply-To" and "Bcc".
- **MIME Boundaries**: Generate unique MIME boundaries for different parts of a message.
- **Utility Functions**: Convenient functions for encoding and decoding Base64 strings and URI encoding.

## Installation

You can install `@ahmedayob/mime-builder` using npm or yarn:

```bash
npm install @ahmedayob/mime-builder
```
````

or

```bash
yarn add @ahmedayob/mime-builder
```

## Usage

Here’s a basic example of how to use the `@ahmedayob/mime-builder` library:

```typescript
import { MimeBuilder, Base64 } from "@ahmedayob/mime-builder";

// Create a new MIME message
const mimeMessage = new MimeBuilder();
mimeMessage.setHeader("From", "sender@example.com");
mimeMessage.setHeader("To", "recipient@example.com");
mimeMessage.setHeader("Subject", "Hello World");
mimeMessage.setHeader("Reply-To", "reply@example.com");

// Add a text part
mimeMessage.addPart({
  type: "text/plain",
  content: "This is a sample email message.",
});

// Generate MIME boundaries
mimeMessage.generateBoundaries();

// Retrieve headers
const headers = mimeMessage.getHeaders();
console.log(headers);

// Encode a string to Base64
const encodedString = Base64.encodeToBase64("Sample content");
console.log(encodedString);

// Decode a Base64 string
const decodedString = Base64.decodeToBinary(encodedString);
console.log(decodedString);
```

## API

### MimeBuilder

- **`setHeader(name: string, value: unknown): string`**  
  Sets a MIME header with the given name and value.

- **`getHeader(name: string): string`**  
  Retrieves the value of a specified MIME header.

- **`setHeaders(obj: Record<string, unknown>): string[]`**  
  Sets multiple headers from an object where keys are header names and values are their corresponding values.

- **`getHeaders(): Record<string, unknown>`**  
  Retrieves all headers as an object.

- **`generateBoundaries(): void`**  
  Generates unique MIME boundaries for different parts of the message.

- **`isArray(v: unknown): v is Array<unknown>`**  
  Checks if a value is an array.

- **`isObject(v: unknown): v is Object`**  
  Checks if a value is an object.

### Base64

- **`encodeToBase64(input: string): string`**  
  Encodes a string into Base64.

- **`decodeToBinary(input: string): string`**  
  Decodes a Base64 encoded string into its original binary form.

- **`deccodeToBuffer(input: string): Buffer`**  
  Decodes a Base64 encoded string into a Buffer object.

- **`toBufferURI(input: string): string`**  
  Encodes a string to Base64 and then URI encodes the result.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## Contact

For questions or feedback, please reach out to [ahmedayobbusiness@gmail.com](mailto:ahmedayobbusiness@gmail.com).

## Links

- [GitHub Repository](https://github.com/wildduck2/mime-builder)
- [Homepage](https://github.com/wildduck2/mime-builder)

```

This README provides a clear overview of the package, including its features, installation instructions, basic usage, API details, and contact information. Make sure to adjust any details if necessary, and add any additional sections or links that may be relevant.
```
