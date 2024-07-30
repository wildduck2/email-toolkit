````markdown
# Base64 Utility Library

## Description

The Base64 utility library is a lightweight JavaScript library designed for encoding and decoding Base64 strings on the client side. It provides simple and efficient methods to convert text to Base64, decode Base64 back to text, and handle Base64 encoded data with URI encoding. By leveraging modern web APIs like `TextEncoder` and `TextDecoder`, this library ensures compatibility and performance in various web environments.

## Features

- **Encode to Base64**: Convert any string to a Base64 encoded string.
- **Decode from Base64**: Decode a Base64 encoded string back to its original text.
- **Decode to Buffer**: Decode a Base64 encoded string into a `Uint8Array` buffer.
- **URI Encode Base64**: Encode a string to Base64 and then URI encode the result.

## Installation

To include the Base64 utility library in your project, you can either clone the repository or install it via a package manager.

### Using npm

```sh
npm install base64-utility-library
```
````

### Using Yarn

```sh
yarn add base64-utility-library
```

## Usage

First, import the functions from the library:

```javascript
import {
  toBase64,
  fromBase64,
  toBase64EncodeURI,
} from "base64-utility-library";
```

### Encoding to Base64

Convert a string to Base64:

```javascript
const base64String = toBase64("hello world");
console.log(base64String); // Outputs: aGVsbG8gd29ybGQ=
```

### Decoding from Base64

Decode a Base64 encoded string back to its original text:

```javascript
const originalText = fromBase64("aGVsbG8gd29ybGQ=");
console.log(originalText); // Outputs: hello world
```

### URI Encode Base64

Encode a string to Base64 and then URI encode the result:

```javascript
const uriEncodedBase64 = toBase64EncodeURI("hello world");
console.log(uriEncodedBase64); // Outputs: aGVsbG8gd29ybGQ%3D
```

## API Reference

### `toBase64(text: string): string`

Encodes a given string into Base64.

- **text**: The string to be encoded.
- **returns**: The Base64 encoded string.

### `fromBase64(base64: string): string`

Decodes a Base64 encoded string back to its original text.

- **base64**: The Base64 encoded string to be decoded.
- **returns**: The decoded string.

### `toBase64EncodeURI(text: string): string`

Encodes a string into Base64 and then URI encodes the result.

- **text**: The string to be encoded and URI encoded.
- **returns**: The URI encoded Base64 string.

## Contributing

We welcome contributions! Please read our [CONTRIBUTING](CONTRIBUTING.md) guidelines for more details.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE.md) file for details.

## Keywords

- Base64
- Encoding
- Decoding
- JavaScript
- Client-side
- TextEncoder
- TextDecoder

```

This README file provides a comprehensive overview of the library, including its features, installation instructions, usage examples, and API reference. It also includes sections for contributing and licensing information.
```
