import type { File } from '../../main';
import { BaseGenerator } from '../baseGenerator';
import type { Model } from './types/model_entity';

export class ModelGenerator extends BaseGenerator {
  public modelFile: Model;
  public fileName: string;

  constructor(fileName: string, file: Model) {
    super();
    this.fileName = fileName;
    this.modelFile = file;
  }

  async build(): Promise<File[]> {
    return [
      {
        path: `resource_pack/models/${this.fileName}.json`,
        content: Buffer.from(JSON.stringify(this.modelFile, null, 2)),
      },
    ];
  }
}
