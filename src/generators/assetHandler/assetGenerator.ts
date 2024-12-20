import fs from 'fs';
import type { File } from '../../domain/ports/FileHandlerPort';
import { BaseGenerator } from '../baseGenerator';

type AssetGeneratorConfig = {
  filePath: string;
  destination: File['path'];
};

export class AssetGenerator extends BaseGenerator {
  constructor(public config: AssetGeneratorConfig) {
    super();
  }

  async build(): Promise<File[]> {
    try {
      var content = fs.readFileSync(this.config.filePath);
    } catch (error) {
      throw new Error(`Could not read file: ${JSON.stringify(error)}`);
    }

    return [
      {
        path: this.config.destination,
        content: content,
      },
    ];
  }
}
