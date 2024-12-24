import type { File } from '../../main';
import { BaseGenerator } from '../baseGenerator';
import type { Model } from './types/model_entity';

export class ModelGenerator extends BaseGenerator {
  public modelFile: Model;
  public fileName: string;
  public folder: 'blocks' | 'entity';

  constructor(folder: 'blocks' | 'entity', fileName: string, file: Model) {
    super();
    this.fileName = fileName;
    this.modelFile = file;
    this.folder = folder;
  }

  async build(): Promise<File[]> {
    return [
      {
        path: `resource_pack/models/${this.folder}/${this.fileName}.json`,
        content: Buffer.from(JSON.stringify(this.modelFile, null, 2)),
      },
    ];
  }
}
