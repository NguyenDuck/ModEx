import fs from "fs";
import path from "path";
import type { File, FileHandlerPort } from "../domain/ports/FileHandlerPort";

interface BasicFileHandlerConfig {
    resourcePackPath: string;
    behaviorPackPath: string;
    cacheFilePath: string;
}

export class BasicFileHandler implements FileHandlerPort {
    private resourcePackPath: string;
    private behaviorPackPath: string;
    private cacheFilePath: string;

    constructor(config: BasicFileHandlerConfig) {
        this.resourcePackPath = config.resourcePackPath;
        this.behaviorPackPath = config.behaviorPackPath;
        this.cacheFilePath = config.cacheFilePath;
    }

    async writeFiles(files: File[]): Promise<void> {
        const currentFiles = new Set<string>();
        const previousFiles = new Set<string>();

        // Read the cache file if it exists
        if (fs.existsSync(this.cacheFilePath)) {
            const cachedData = fs.readFileSync(this.cacheFilePath, "utf-8");
            cachedData.split("\n").forEach((line) => {
                if (line.trim()) {
                    previousFiles.add(line.trim());
                }
            });
        }

        for (const file of files) {
            let filePath = "";

            // Check if the file path is valid and set the path
            if (file.path.startsWith("resource_pack")) {
                filePath = `${this.resourcePackPath}/${file.path.slice(14)}`;
            } else if (file.path.startsWith("behavior_pack")) {
                filePath = `${this.behaviorPackPath}/${file.path.slice(14)}`;
            } else {
                throw new Error(`Invalid path: ${file.path}`);
            }

            currentFiles.add(filePath);

            // If the folder path does not exist, create it recursively
            const dir = path.dirname(filePath);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }

            if (file.append) {
                fs.appendFileSync(filePath, new Uint8Array(file.content));
            } else {
                // Write the file content to the path
                fs.writeFileSync(filePath, new Uint8Array(file.content));
            }
        }

        // Delete files that are not in the current iteration
        for (const filePath of previousFiles) {
            if (!currentFiles.has(filePath)) {
                fs.unlinkSync(filePath);
                this.deleteEmptyDirectories(path.dirname(filePath));
            }
        }

        // Update the cache file with the current files
        fs.writeFileSync(this.cacheFilePath, Array.from(currentFiles).join("\n"));
    }

    private deleteEmptyDirectories(dir: string): void {
        if (fs.existsSync(dir) && fs.readdirSync(dir).length === 0) {
            fs.rmdirSync(dir);
            this.deleteEmptyDirectories(path.dirname(dir));
        }
    }
}
