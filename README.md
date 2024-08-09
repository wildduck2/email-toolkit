# `@ahmedayob/email-toolkit`

A powerful and flexible toolkit for building, validating, and processing emails with TypeScript. This library offers utilities for handling email headers, attachments, and encoding, making it easier to compose and manage emails programmatically.

## Features

- **Email Header Management**: Easily create and manage email headers.
- **Attachment Handling**: Add, validate, and format email attachments.
- **Encoding Utilities**: Encode content in Base64 for attachments.
- **Validation**: Ensure email content, headers, and attachments are valid with built-in validation schemas.

## Installation

To install the toolkit, use npm or yarn:

```bash
npm install @ahmedayob/email-toolkit
# or
yarn add @ahmedayob/email-toolkit
```

## Usage

Here's a quick guide on how to use the library:

### Email Header

Create and configure email headers:

```typescript
import { EmailBuilderHeader } from "@ahmedayob/email-toolkit";

const header = new EmailBuilderHeader();
header
  .setFrom("ahmed <ahmed@gmail.com>")
  .setTo("ahmed <ahmed@gmail.com>")
  .setCc("ahmed <ahmed@gmai.com>")
  .setBcc("ahmed <ahmed@gmai.com>")
  .setSubject("this is wild duck email test subject")
  .setInReplyTo("ahmed@gmail.com")
  .setMIMEVersion("1.0")
  .setContentTransferEncoding("quoted-printable")
  .setContentType("text/html")
  .setCharset("utf8");
```

### Email Attachment

Add attachments to your email:

```typescript
import { EmailBuilderAttachment } from "@ahmedayob/email-toolkit";
import { Base64 } from "@ahmedayob/email-toolkit";

const attachment = new EmailBuilderAttachment();
attachment.addAttachment({
  headers: {
    "Content-Type": 'text/plain; charset="utf-8"',
    "Content-Transfer-Encoding": "base64",
    "Content-Disposition": 'attachment; filename="test.txt"',
  },
  size: 1234,
  filename: "test.txt",
  mimeType: "text/plain",
  attachmentId: "1234",
  attachmentContent: Base64.encodeToBase64("test"),
});
```

### Building the Email

Combine headers and attachments to create the final email:

```typescript
import { EmailBuilder } from "@ahmedayob/email-toolkit";

const email = new EmailBuilder();
email.messagebody = "this is message body";

const finalEmail = email.getRawMessage(header.headers, attachment.attachments);
console.log(finalEmail);
```

## API

### `EmailBuilderHeader`

- **setFrom**(address: string): Sets the "From" header.
- **setTo**(address: string): Sets the "To" header.
- **setCc**(address: string): Sets the "Cc" header.
- **setBcc**(address: string): Sets the "Bcc" header.
- **setSubject**(subject: string): Sets the email subject.
- **setInReplyTo**(messageId: string): Sets the "In-Reply-To" header.
- **setMIMEVersion**(version: string): Sets the "MIME-Version" header.
- **setContentTransferEncoding**(encoding: string): Sets the "Content-Transfer-Encoding" header.
- **setContentType**(type: string): Sets the "Content-Type" header.
- **setCharset**(charset: string): Sets the charset.

### `EmailBuilderAttachment`

- **addAttachment**(attachment: AttachmentType): Adds an attachment.
- **getAttachment**(): Retrieves the formatted attachments.

### `EmailBuilder`

- **messagebody**: Sets the body of the email.
- **getRawMessage**(headers: HeadersType, attachments?: AttachmentType[]): Gets the raw email message.

### `Base64`

- **encodeToBase64**(data: string): Encodes data to Base64.

## Validation

Validation schemas are available to ensure data correctness:

- **HeadersTypeSchema**: Validates email headers.
- **AttachmentHeaderSchema**: Validates attachment headers.
- **StringSchema**: Validates strings.
- **ContentTransferEncodingSchema**: Validates content transfer encodings.
- **ContentTypeSchema**: Validates content types.
- **CharsetTypeSchema**: Validates charset types.

## Contributing

Contributions are welcome! Please open issues and pull requests on the [GitHub repository](https://github.com/ahmedayob/email-toolkit).

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.
