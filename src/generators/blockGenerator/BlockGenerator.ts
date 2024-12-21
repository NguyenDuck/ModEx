import type { File } from '../../domain/ports/FileHandlerPort';
import { BaseGenerator } from '../baseGenerator';
import type { BlockBehavior } from './types/block';

export class BlockGenerator extends BaseGenerator {
  public blockBehavior: BlockBehavior;

  constructor() {
    super();

    // Initialize the blockBehavior object
    this.blockBehavior = {
      format_version: '1.16.0',
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
        content: Buffer.from(JSON.stringify(this.blockBehavior, null, 2)),
      },
    ];
  }
}
