import { TextureHandler } from '../../../generators/assetHandler/handlers/textureHandler';
import type { BlockGenerator } from '../../../generators/blockGenerator/BlockGenerator';
import { TerrainTextureGenerator } from '../../../generators/packGenerators/terrainTextureGenerator/terrainTextureGenerator';
import { BasePlugin } from '../../plugins/basePlugin';

type BasicBlockTexturePluginConfig = {
  texture: string;
};

export class BlockBasicTexturePlugin extends BasePlugin<BlockGenerator> {
  constructor(private config: BasicBlockTexturePluginConfig) {
    super();
  }

  async run(b: BlockGenerator): Promise<void> {
    const terrainTexture = TerrainTextureGenerator.getInstance();
    const [namespace, id] = b.getIdentifierSplitted();

    const texture = TextureHandler.getInstance().addTexture(
      this.config.texture,
      'blocks/' + id
    );

    const terrainTextureName = 'b_' + id;

    terrainTexture.addTexture(terrainTextureName, {
      textures: {
        path: texture.destinationPath,
      },
    });

    const f = b.blockBehavior;

    f['minecraft:block'].components['minecraft:material_instances'] = {
      '*': {
        texture: terrainTextureName,
      },
    };
  }
}
