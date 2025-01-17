export interface File {
    path: `${"resource_pack" | "behavior_pack"}/${string}`;
    content: Buffer;
    append?: boolean;
}

export interface FileHandlerPort {
    writeFiles(files: File[]): Promise<void>;
}
