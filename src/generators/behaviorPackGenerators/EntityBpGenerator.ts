import { json2buf } from '~/utils/jsonUtils';
import { ManifestGenerator, type File } from '../../main';
import type { EntityBehavior } from '../../types/generated/behavior/entities';
import { BaseGenerator } from '../baseGenerator';

export class EntityBpGenerator extends BaseGenerator {
  public entityFile: EntityBehavior;

  public get format_version() {
    return this.entityFile.format_version;
  }

  constructor(public fileName: string) {
    super();

    if (fileName.endsWith('.json')) {
      throw new Error(
        'Entity file name should not end with .json, we will automatically add it for you'
      );
    }

    this.entityFile = {
      format_version: ManifestGenerator.getInstance().minEngineVersion,
      'minecraft:entity': {
        description: {
          identifier: '',
        },
        components: {},
      },
    };
  }

  async build(): Promise<File[]> {
    if (this.entityFile['minecraft:entity'].description.identifier === '') {
      throw new Error('Could not build entity: Identifier is required');
    }

    return [
      {
        content: json2buf(this.entityFile),
        path: `behavior_pack/entities/${this.fileName}.json`,
      },
    ];
  }
}
