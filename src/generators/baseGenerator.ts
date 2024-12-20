import { modExCore } from '../domain/modExCore';
import type { File } from '../domain/ports/FileHandlerPort';
import type { GeneratorPort } from '../domain/ports/GeneratorPort';

export class BaseGenerator implements GeneratorPort {
  constructor() {
    const coreInstance = modExCore.getInstance();
    coreInstance.addGenerator(this);
  }

  build(): Promise<File[]> {
    throw new Error('Method not implemented.');
  }
}
