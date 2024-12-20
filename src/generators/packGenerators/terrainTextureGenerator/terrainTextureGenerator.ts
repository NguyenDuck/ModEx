import type { File } from '../../../domain/ports/FileHandlerPort';
import { BaseSingletonGenerator } from '../../baseSingletonGenerator';
import { ManifestGenerator } from '../manifestGenerator';
import type { TerrainTextureFile, TextureData1 } from './terrain_texture';

export class TerrainTextureGenerator extends BaseSingletonGenerator {
  public file: TerrainTextureFile = {
    texture_name: 'atlas.terrain',
    resource_pack_name: ManifestGenerator.getInstance().namespace,
  };

  async build(): Promise<File[]> {
    return [
      {
        path: `resource_pack/textures/terrain_texture.json`,
        content: Buffer.from(JSON.stringify(this.file, null, 2)),
      },
    ];
  }

  async addTexture(name: string, obj: TextureData1) {
    if (!this.file.texture_data) {
      this.file.texture_data = {};
    }
    this.file.texture_data[name] = obj;
  }
}
