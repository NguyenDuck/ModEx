import semver from 'semver';
import { ManifestGenerator } from '../../main';

type ObjectWithFormatVersion = {
  format_version: string;
};

export abstract class BasePlugin<T> {
  static explicitFormatVersions<T>(
    versions: string[]
  ): (obj: ObjectWithFormatVersion & T) => boolean {
    const manifest = ManifestGenerator.getInstance();
    const minEngineVersion =
      manifest.behaviorPackManifest.manifest.header.min_engine_version;

    return (obj: ObjectWithFormatVersion & T) => {
      // If the object's format version is greater than the minimum engine version, throw an error.
      if (
        obj.format_version &&
        minEngineVersion &&
        semver.gt(obj.format_version, minEngineVersion.join('.'))
      ) {
        throw new Error(
          'The format version of the object is greater than the minimum engine version.'
        );
      }

      // Check if the object's format version is in the list of versions.
      return versions.includes(obj.format_version);
    };
  }

  /**
   * Check if the plugin is compatible with the current version of the generator.
   * This should return true if the plugin is compatible, false if it's not, and undefined if it's unknown.
   * When the plugin is not compatible, the factory implementing this plugin should throw an error.
   */
  abstract checkVersion(generator: T): boolean | undefined;

  /**
   * Runs the plugin on the given object.
   * A plugin is a piece of code that modifies the object in some way.
   * @param obj The object to run the plugin on.
   */
  abstract run(obj: T): Promise<void>;
}
