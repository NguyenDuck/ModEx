import {
  Texture,
  TextureHandler,
} from '../../../generators/assetHandler/handlers/textureHandler';
import type { BlockGenerator } from '../../../generators/blockGenerator/BlockGenerator';
import type {
  MaterialInstance,
  MaterialInstances,
} from '../../../generators/blockGenerator/types/block';
import { ModelGenerator } from '../../../generators/modelGenerator/modelGenerator';
import { TerrainTextureGenerator } from '../../../generators/packGenerators/terrainTextureGenerator/terrainTextureGenerator';
import { AssetHandler, ManifestGenerator } from '../../../main';
import { BasePlugin } from '../../plugins/basePlugin';

type BlockTexture =
  | string
  /**
   * MaterialInstances of the block.
   */
  | Record<string, Exclude<MaterialInstance, string>>;

type BasicBlockTexturePluginConfig = {
  /**
   * Path of the texture to use on the block. The texture should either be in the `assets/texture` folder or
   * be an object with the `textures` property that contains a MaterialInstances object.
   *
   * For raw textures (for example, textures that are in Minecraft vanilla), you can use the "raw:" prefix.
   */
  texture: BlockTexture;

  /**
   * Path of the model file to use for the block. The model should be in the `assets/models` folder.
   */
  model?: string;

  /**
   * If the block should rotate based on the player's placement direction.
   */
  rotation?: boolean;
};

export class BlockBasicTexturePlugin extends BasePlugin<BlockGenerator> {
  checkVersion = BasePlugin.explicitFormatVersions(['1.20.0']);

  constructor(private config: BasicBlockTexturePluginConfig) {
    super();
  }

  async run(b: BlockGenerator): Promise<void> {
    const assetHandler = AssetHandler.getInstance();
    const terrainTexture = TerrainTextureGenerator.getInstance();
    const [namespace, id] = b.getIdentifierSplitted();

    const f = b.blockBehavior;

    const addedTextures: Record<string, Texture> = {};
    const materialInstances: MaterialInstances = {
      '*': 'black', // Default black texture to prevent errors
    };

    const removeRawPrefix = (texture: string) => {
      if (texture.startsWith('raw:')) {
        return texture.substring(4);
      }
      throw new Error(`Texture is not a raw texture: ${texture}`);
    };

    const author = ManifestGenerator.getInstance().author;

    if (typeof this.config.texture === 'string') {
      // Single texture
      if (this.config.texture.startsWith('raw:')) {
        materialInstances['*'] = removeRawPrefix(this.config.texture);
      } else {
        const texture = TextureHandler.getInstance().addTexture(
          this.config.texture,
          'blocks/' + id
        );

        const textureName = `block_${author}_${id}`;
        addedTextures[textureName] = texture;

        materialInstances['*'] = {
          texture: textureName,
        };
      }
    } else {
      // Multiple textures
      let textureId = 0;
      for (const [key, value] of Object.entries(this.config.texture)) {
        if (value.texture?.startsWith('raw:')) {
          // If the texture is a raw texture, remove the prefix and pass it as is
          materialInstances[key] = {
            ...value,
            texture: removeRawPrefix(value.texture),
          };
        } else {
          const texture = TextureHandler.getInstance().addTexture(
            value.texture!,
            'blocks/' + id + '_' + textureId
          );
          const textureName = `block_${author}_${id}_${textureId}`;

          addedTextures[textureName] = texture;

          materialInstances[key] = {
            ...value,
            texture: textureName,
          };

          textureId++;
        }
      }
    }

    for (const texture of Object.entries(addedTextures)) {
      terrainTexture.addTexture(texture[0], {
        textures: {
          path: texture[1].destinationPath,
        },
      });
    }

    f['minecraft:block'].components['minecraft:material_instances'] =
      materialInstances;

    let modelName = ''; // Set when model is provided from a file

    if (this.config.model) {
      if (this.config.model.endsWith('.json')) {
        throw new Error(
          `Model file should not have the .json extension: ${this.config.model}`
        );
      }

      const model = JSON.parse(
        assetHandler.read('models', this.config.model + '.json')
      );

      if (!model['minecraft:geometry']) {
        throw new Error(`Invalid model file: ${this.config.model}`);
      }

      if (model['minecraft:geometry'].length > 1) {
        throw new Error(
          `Model file with two geometries: ${this.config.model}. Please use only one geometry per file.`
        );
      }

      const modelObject = model['minecraft:geometry'][0];
      modelName = `geometry.${namespace}.${id}`;
      modelObject.description.identifier = modelName;

      new ModelGenerator('blocks', id, model);
    }

    f['minecraft:block'].components['minecraft:geometry'] = {
      identifier: !this.config.model
        ? 'minecraft:geometry.full_block'
        : modelName,
    };

    if (this.config.rotation === true) {
      if (f['minecraft:block'].permutations === undefined) {
        f['minecraft:block'].permutations = [];
      }
      f['minecraft:block'].permutations.push(
        {
          condition: "q.block_state('minecraft:cardinal_direction') == 'north'",
          components: { 'minecraft:transformation': { rotation: [0, 0, 0] } },
        },
        {
          condition: "q.block_state('minecraft:cardinal_direction') == 'south'",
          components: { 'minecraft:transformation': { rotation: [0, 180, 0] } },
        },
        {
          condition: "q.block_state('minecraft:cardinal_direction') == 'west'",
          components: { 'minecraft:transformation': { rotation: [0, 90, 0] } },
        },
        {
          condition: "q.block_state('minecraft:cardinal_direction') == 'east'",
          components: { 'minecraft:transformation': { rotation: [0, -90, 0] } },
        }
      );
      if (f['minecraft:block'].description.traits === undefined) {
        f['minecraft:block'].description.traits = {};
      }
      f['minecraft:block'].description.traits['minecraft:placement_direction'] =
        {
          enabled_states: ['minecraft:cardinal_direction'],
          y_rotation_offset: 180,
        };
    }
  }
}
