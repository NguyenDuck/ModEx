import type { LootTable } from 'bpt/loot_tables';
import { BaseGenerator, ManifestGenerator, type File } from '~/main';
import { json2buf } from '~/utils/jsonUtils';

export class LootTableGenerator extends BaseGenerator {
  lootTableFile: LootTable;

  constructor(public fileName: string) {
    super();

    if (fileName.endsWith('.json')) {
      throw new Error(
        'Loot Table file name should not end with .json, we will automatically add it for you'
      );
    }

    this.lootTableFile = {
      pools: [],
    };
  }

  async build(): Promise<File[]> {
    const { author, namespace } = ManifestGenerator.getInstance();
    return [
      {
        content: json2buf(this.lootTableFile),
        path: `behavior_pack/loot_tables/${author}/${namespace}/${this.fileName}.json`,
      },
    ];
  }
}
