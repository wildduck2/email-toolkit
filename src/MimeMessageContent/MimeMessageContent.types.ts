export interface MIMEMessageContentClass {
    headers: any;
    data: any;
    dump(): string;
    isAttachment(): boolean;
    isInlineAttachment(): boolean;
    setHeader(name: string, value: any): string;
    getHeader(name: string): any;
    setHeaders(obj: { [index: string]: string }): string[];
    getHeaders(): any;
}
