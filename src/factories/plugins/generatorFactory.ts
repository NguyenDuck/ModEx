import type { BasePlugin } from './basePlugin';

/**
 * An abstract factory class for generating objects of type `T` with the help of plugins.
 * Plugins are pieces of code that modify the generated object in some way.
 *
 * @template T The type of object that this factory generates.
 */
export abstract class GeneratorFactory<T> {
  protected plugins: BasePlugin<T>[] = [];

  /**
   * The generator instance that this factory uses to generate objects.
   */
  protected abstract generator: T;

  /**
   * Adds a plugin to the factory.
   * A plugin is a piece of code that modifies the object in some way.
   * When the plugin is added, it is not immediately run. Instead, it should be run when the factory is built.
   * @param plugin An array of plugins or a single plugin to add to the factory.
   * @returns The factory instance.
   */
  addPlugins(plugin: BasePlugin<T>[] | BasePlugin<T>): this {
    if (Array.isArray(plugin)) {
      this.plugins.push(...plugin);
      return this;
    }
    this.plugins.push(plugin);
    return this;
  }

  /**
   * Executes all plugins by calling their `run` method with the generator instance.
   * This method should be called when the factory is built.
   *
   * @returns {Promise<any[]>} A promise that resolves when all plugins have finished running.
   */
  protected runPlugins() {
    return Promise.all(
      this.plugins.map((plugin) => {
        plugin.checkVersion(this.generator);
        plugin.run(this.generator);
      })
    );
  }

  abstract build(): Promise<T>;
}
