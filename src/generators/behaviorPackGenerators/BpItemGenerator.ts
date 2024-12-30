import { BaseGenerator, ManifestGenerator, type File } from '~/main';
import { json2buf } from '~/utils/jsonUtils';
import type { Item } from '../../types/generated/behavior/items';

export class BpItemGenerator extends BaseGenerator {
  public itemFile: Item;

  get format_version() {
    return this.itemFile.format_version;
  }

  constructor(public id: string) {
    super();
    const { minEngineVersion, namespace } = ManifestGenerator.getInstance();
    this.itemFile = {
      format_version: minEngineVersion,
      'minecraft:item': {
        description: {
          identifier: `${namespace}:${id}`,
        },
        components: {},
      },
    };
  }

  async build(): Promise<File[]> {
    if (this.itemFile['minecraft:item'].description.identifier === '') {
      throw new Error('Could not build item: Identifier is required');
    }

    return [
      {
        content: json2buf(this.itemFile),
        path: `behavior_pack/items/${this.id}.json`,
      },
    ];
  }
}
