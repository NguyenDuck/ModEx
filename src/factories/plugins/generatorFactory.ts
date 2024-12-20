import type { BasePlugin } from './basePlugin';

export abstract class GeneratorFactory<T> {
  protected plugins: BasePlugin<T>[] = [];

  addPlugins(plugin: BasePlugin<T>[] | BasePlugin<T>): this {
    if (Array.isArray(plugin)) {
      this.plugins.push(...plugin);
      return this;
    }
    this.plugins.push(plugin);
    return this;
  }

  abstract build(): Promise<T>;
}
