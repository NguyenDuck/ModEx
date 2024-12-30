import type { Biomes } from 'bpt/biomes';
import { BaseGenerator, type File } from '~/main';
import { json2buf } from '~/utils/jsonUtils';

export class BiomeGenerator extends BaseGenerator {
  public biomeFile: Biomes;

  get format_version() {
    return this.biomeFile.format_version;
  }

  constructor(
    public fileName: string,
    formatVersion: string
  ) {
    super();

    if (fileName.endsWith('.json')) {
      throw new Error(
        'Biome file name should not end with .json, we will automatically add it for you'
      );
    }

    if (fileName.includes('/')) {
      throw new Error('Biome file name should not contain /');
    }

    this.biomeFile = {
      format_version: formatVersion,
      'minecraft:biomes': {},
    };
  }

  async build(): Promise<File[]> {
    return [
      {
        content: json2buf(this.biomeFile),
        path: `behavior_pack/biomes/${this.fileName}.json`,
      },
    ];
  }
}
