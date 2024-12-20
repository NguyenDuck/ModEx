import type { FileHandlerPort } from './ports/FileHandlerPort';
import type { GeneratorPort } from './ports/GeneratorPort';

export class modExCore {
  private static instance: modExCore;

  private fileHandler: FileHandlerPort | null = null;
  private generatos: GeneratorPort[] = [];

  private constructor() {
    // Private constructor, singleton
    if (modExCore.instance) {
      throw new Error(
        'Error: Instantiation failed: Use modExCore.getInstance() instead of new.'
      );
    }
  }

  public static getInstance(): modExCore {
    if (!modExCore.instance) {
      modExCore.instance = new modExCore();
    }
    return modExCore.instance;
  }

  public setFileHandler(fileHandler: FileHandlerPort) {
    this.fileHandler = fileHandler;
  }

  public addGenerator(generator: GeneratorPort) {
    this.generatos.push(generator);
  }

  public async build() {
    if (!this.fileHandler) {
      throw new Error('FileHandler is not set.');
    }
    console.log('ModEx Core: Building...');

    const files = await Promise.all(
      this.generatos.map(async (generator) => {
        return await generator.build();
      })
    );
    console.log('ModEx Core: Writing files...');
    await this.fileHandler.writeFiles(files.flat());
    console.log('ModEx Core: Done.');
  }
}
