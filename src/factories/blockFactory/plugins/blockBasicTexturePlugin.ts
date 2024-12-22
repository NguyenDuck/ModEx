import { TextureHandler } from '../../../generators/assetHandler/handlers/textureHandler';
import type { BlockGenerator } from '../../../generators/blockGenerator/BlockGenerator';
import { ModelGenerator } from '../../../generators/modelGenerator/modelGenerator';
import { TerrainTextureGenerator } from '../../../generators/packGenerators/terrainTextureGenerator/terrainTextureGenerator';
import { AssetHandler } from '../../../main';
import { BasePlugin } from '../../plugins/basePlugin';

type BasicBlockTexturePluginConfig = {
  texture: string;
  model?: string;
  rotation?: boolean;
};

export class BlockBasicTexturePlugin extends BasePlugin<BlockGenerator> {
  constructor(private config: BasicBlockTexturePluginConfig) {
    super();
  }

  async run(b: BlockGenerator): Promise<void> {
    const assetHandler = AssetHandler.getInstance();
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

      new ModelGenerator(id, model);
    }

    f['minecraft:block'].components['minecraft:geometry'] = {
      identifier: !this.config.model
        ? 'minecraft:geometry.full_block'
        : modelName,
    };
    f['minecraft:block'].components['minecraft:material_instances'] = {
      '*': {
        texture: terrainTextureName,
      },
    };
    
    if (this.config.rotation === true) {
      if (f['minecraft:block'].permutations === undefined) {
        f['minecraft:block'].permutations = [];
      }
      f['minecraft:block'].permutations.push(
        {"condition": "q.block_state('minecraft:cardinal_direction') == 'north'","components": {"minecraft:transformation": {"rotation": [0,0,0]}}},
        {"condition": "q.block_state('minecraft:cardinal_direction') == 'south'","components": {"minecraft:transformation": {"rotation": [0,180,0]}}},
        {"condition": "q.block_state('minecraft:cardinal_direction') == 'west'","components": {"minecraft:transformation": {"rotation": [0,90,0]}}},
        {"condition": "q.block_state('minecraft:cardinal_direction') == 'east'","components": {"minecraft:transformation": {"rotation": [0,-90,0]}}}
      );
      if (f['minecraft:block'].description.traits === undefined) {
        f['minecraft:block'].description.traits = {};
      }
      f['minecraft:block'].description.traits['minecraft:placement_direction'] = {"enabled_states": ["minecraft:cardinal_direction"],"y_rotation_offset": 180}
    }
  }
}
