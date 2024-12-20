import type { File } from './FileHandlerPort';

export interface GeneratorPort {
  build(): Promise<File[]>;
}
