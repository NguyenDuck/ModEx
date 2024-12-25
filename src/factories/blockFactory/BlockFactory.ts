import { BlockGenerator } from '../../generators/blockGenerator/BlockGenerator';
import { ManifestGenerator } from '../../generators/packGenerators/manifestGenerator';
import type { BasePlugin } from '../plugins/basePlugin';
import { GeneratorFactory } from '../plugins/generatorFactory';

type BlockFactoryConfig = {
  name: string;
  plugins?: BasePlugin<BlockGenerator>[];
};

export class BlockFactory extends GeneratorFactory<BlockGenerator> {
  generator: BlockGenerator;

  constructor(config: BlockFactoryConfig) {
    super();

    this.generator = new BlockGenerator();

    this.generator.blockBehavior.format_version =
      ManifestGenerator.getInstance().minEngineVersion;

    const block = this.generator;

    block.blockBehavior['minecraft:block'].description.identifier = `${
      ManifestGenerator.getInstance().namespace
    }:${config.name}`;

    if (config.plugins) {
      this.addPlugins(config.plugins);
      this.build();
    }
  }

  async build(): Promise<BlockGenerator> {
    this.runPlugins();
    return this.generator;
  }
}
