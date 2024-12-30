import { ManifestGenerator } from '~/main';
import { json2buf } from '~/utils/jsonUtils';
import type { File } from '../../domain/ports/FileHandlerPort';
import type { BlockBehavior } from '../../types/generated/behavior/blocks';
import { BaseGenerator } from '../baseGenerator';

export class BlockGenerator extends BaseGenerator {
  public blockBehavior: BlockBehavior;

  public get format_version() {
    return this.blockBehavior.format_version;
  }

  constructor() {
    super();

    // Initialize the blockBehavior object
    this.blockBehavior = {
      format_version: ManifestGenerator.getInstance().minEngineVersion,
      'minecraft:block': {
        description: {
          identifier: '',
        },
        components: {},
      },
    };
  }

  get identifier(): string {
    return this.blockBehavior['minecraft:block'].description.identifier;
  }

  /**
   * Get the identifier splitted by the colon
   * @returns [namespace, id]
   */
  getIdentifierSplitted(): [string, string] {
    return this.identifier.split(':') as [string, string];
  }

  set identifier(value: string) {
    this.blockBehavior['minecraft:block'].description.identifier = value;
  }

  async build(): Promise<File[]> {
    if (this.identifier === '') {
      throw new Error('Could not build block: Identifier is required');
    }

    return [
      {
        path: `behavior_pack/blocks/${this.getIdentifierSplitted()[1]}.json`,
        content: json2buf(this.blockBehavior),
      },
    ];
  }
}
export type { BlockBehavior };
