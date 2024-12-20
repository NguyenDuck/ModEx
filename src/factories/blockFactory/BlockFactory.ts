import { BlockGenerator } from '../../generators/blockGenerator/BlockGenerator';
import { ManifestGenerator } from '../../generators/packGenerators/manifestGenerator';
import type { BasePlugin } from '../plugins/basePlugin';
import { GeneratorFactory } from '../plugins/generatorFactory';

type BlockFactoryConfig = {
  name: string;
  plugins?: BasePlugin<BlockGenerator>[];
};

export class BlockFactory extends GeneratorFactory<BlockGenerator> {
  private block: BlockGenerator;

  constructor(config: BlockFactoryConfig) {
    super();

    this.block = new BlockGenerator();

    const block = this.block;

    block.blockBehavior['minecraft:block'].description.identifier = `${
      ManifestGenerator.getInstance().namespace
    }:${config.name}`;

    if (config.plugins) {
      this.addPlugins(config.plugins);
      this.build();
    }
  }

  async build(): Promise<BlockGenerator> {
    for (const plugin of this.plugins) {
      plugin.run(this.block);
    }

    return this.block;
  }
}
