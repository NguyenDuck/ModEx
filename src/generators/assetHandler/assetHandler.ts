import fs from 'fs';
import path from 'path';
import type { File } from '../../domain/ports/FileHandlerPort';
import { AssetGenerator } from './assetGenerator';

type AssetHandlerConfig = {
  assetsFolderPath: string;
};

export class AssetHandler {
  private static instance: AssetHandler;

  public readonly assetFolders = [
    'animations',
    'textures',
    'models',
    'sounds',
  ] as const;

  static getInstance(): AssetHandler {
    if (!AssetHandler.instance) {
      AssetHandler.instance = new AssetHandler();
    }
    return AssetHandler.instance;
  }

  private constructor() {}

  private config!: AssetHandlerConfig;

  configurate(config: AssetHandlerConfig): void {
    this.config = config;

    // Create the assets folder hierarchy if it doesn't exist
    fs.mkdirSync(this.config.assetsFolderPath, { recursive: true });

    for (const folder of this.assetFolders) {
      if (!fs.existsSync(`${this.config.assetsFolderPath}/${folder}`)) {
        fs.mkdirSync(`${this.config.assetsFolderPath}/${folder}`, {
          recursive: true,
        });
      }
    }
  }

  clone(
    assetFolder: (typeof AssetHandler.prototype.assetFolders)[number],
    filename: string,
    destination: File['path']
  ) {
    const filePath = path.join(
      this.config.assetsFolderPath,
      assetFolder,
      filename
    );

    new AssetGenerator({
      filePath: filePath,
      destination: destination,
    });
  }
}
