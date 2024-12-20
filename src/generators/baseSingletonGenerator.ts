import { modExCore } from '../domain/modExCore';
import type { File } from '../domain/ports/FileHandlerPort';
import type { GeneratorPort } from '../domain/ports/GeneratorPort';

export abstract class BaseSingletonGenerator implements GeneratorPort {
  private static instances: Map<new () => any, any> = new Map();

  constructor() {
    // Prevent direct instantiation from outside
    if (BaseSingletonGenerator.instances.has(this.constructor as any)) {
      throw new Error(
        `${this.constructor.name} is a singleton and cannot be instantiated multiple times.`
      );
    }

    modExCore.getInstance().addGenerator(this);
  }

  abstract build(): Promise<File[]>;

  static getInstance<T>(this: new () => T): T {
    if (!BaseSingletonGenerator.instances.has(this)) {
      const instance = new this();
      BaseSingletonGenerator.instances.set(this, instance);
    }
    return BaseSingletonGenerator.instances.get(this) as T;
  }
}
