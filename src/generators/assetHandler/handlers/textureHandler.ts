import { ManifestGenerator } from '../../packGenerators/manifestGenerator';
import { AssetHandler } from '../assetHandler';

type TextureOptions = {
  destinationPath: string;
};

export class Texture {
  private destPath: string;

  constructor(opts: TextureOptions) {
    this.destPath = opts.destinationPath;
  }

  get destinationPath() {
    return this.destPath;
  }
}

export class TextureHandler {
  private static instance: TextureHandler;

  private assetHandler: AssetHandler = AssetHandler.getInstance();

  private constructor() {
    // Prevent direct instantiation from outside
    if (TextureHandler.instance) {
      throw new Error(
        `${TextureHandler.name} is a singleton and cannot be instantiated multiple times.`
      );
    }

    // Initialize the instance
    TextureHandler.instance = this;
  }

  static getInstance(): TextureHandler {
    if (!TextureHandler.instance) {
      TextureHandler.instance = new TextureHandler();
    }
    return TextureHandler.instance;
  }

  private textures: Map<string, Texture> = new Map();

  addTexture(assetsPath: string, destinationPath: string): Texture {
    if (assetsPath.endsWith('.png')) {
      throw new Error(
        'For simplicity, texture path should not end with .png. We will automatically add it for you.'
      );
    } else if (destinationPath.endsWith('.png')) {
      throw new Error(
        'For simplicity, destination path should not end with .png. We will automatically add it for you.'
      );
    }

    assetsPath += '.png';

    if (this.textures.has(assetsPath)) {
      return this.textures.get(assetsPath)!;
    }

    const assetHandler = this.assetHandler;

    const manifest = ManifestGenerator.getInstance();

    const author = manifest.author;
    const projectNamespace = manifest.namespace;

    const finalPath = `textures/${author}/${projectNamespace}/${destinationPath}`;
    assetHandler.clone(
      'textures',
      assetsPath,
      `resource_pack/${finalPath}.png`
    );

    const texture = new Texture({
      destinationPath: finalPath,
    });

    return texture;
  }
}
