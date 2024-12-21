import { v4 } from 'uuid';
import type { File } from '../../domain/ports/FileHandlerPort';
import type {
  ManifestV2Schema,
  Version2,
  VersionNumbering2,
} from '../../types/general/manifest/manifest.2';
import { BaseSingletonGenerator } from '../baseSingletonGenerator';

type ManifestGeneratorConfig = {
  // Project required information
  company: string;
  projectName: string;

  // Project optional information
  packName?: string;
  packDescription?: string;
  packVersion?: `${number}.${number}.${number}` | number;

  // Pack options
  includeResourcePack?: boolean;
  includeBehaviorPack?: boolean;
  minEngineVersion?: `${number}.${number}.${number}`;

  // Script options
  scripting?: {
    '@minecraft/server'?: string;
    '@minecraft/server-net'?: string;
    '@minecraft/server-gametest'?: string;
    '@minecraft/server-ui'?: string;
  };
};

class ManifestV2 {
  public manifest: ManifestV2Schema;
  constructor(packUUID: string, version: Version2) {
    this.manifest = {
      format_version: 2,
      header: {
        description: '',
        name: '',
        uuid: packUUID,
        version: version,
      },
    };
  }
}

class UUIDGenerator {
  constructor(
    private company: string,
    private projectName: string,
    private UUIDRolls: number
  ) {}

  public generateUUIDFromSeed(seed: string): string {
    return this.uuidFromStr(`${this.company}.${this.projectName}.${seed}`);
  }

  private uuidFromStr(str: string): string {
    return v4({
      random: Uint8Array.from(Buffer.from(str)),
    });
  }
}

class BaseManifestBuilder {
  protected UUIDGenerator: UUIDGenerator;
  constructor(public config: ManifestGeneratorConfig) {
    this.UUIDGenerator = new UUIDGenerator(
      config.company,
      config.projectName,
      0
    );
  }

  public get description(): string {
    if (this.config.packDescription) {
      return this.config.packDescription;
    }
    return `A pack generated by ${this.config.company} for ${this.config.projectName}`;
  }

  public get name(): string {
    if (this.config.packName) {
      return this.config.packName;
    }
    return `${this.config.company}.${this.config.projectName}`;
  }

  public get version(): Version2 {
    if (this.config.packVersion) {
      if (typeof this.config.packVersion === 'number') {
        return [this.config.packVersion, 0, 0];
      } else {
        return this.config.packVersion
          .split('.')
          .map((v) => parseInt(v)) as Version2;
      }
    }
    return [1, 0, 0];
  }

  public get minEngineVersion(): VersionNumbering2 {
    if (this.config.minEngineVersion) {
      return this.config.minEngineVersion
        .split('.')
        .map((v) => parseInt(v)) as VersionNumbering2;
    }
    return [1, 20, 0];
  }

  public get namespace(): string {
    return `${this.config.company}_${this.config.projectName}`;
  }
}

class BehaviorManifestBuilder extends BaseManifestBuilder {
  public build(): ManifestV2 {
    const manifest = new ManifestV2(
      this.UUIDGenerator.generateUUIDFromSeed('behavior_manifest'),
      this.version
    );

    const m = manifest.manifest;

    m.header.description = this.description;
    m.header.name = this.name;
    m.header.min_engine_version = this.minEngineVersion;

    m.modules = [
      {
        type: 'data',
        uuid: this.UUIDGenerator.generateUUIDFromSeed('behavior_data'),
        version: this.version,
      },
    ];

    if (this.config.scripting) {
      m.modules = [];
      m.dependencies = [];

      for (const [key, value] of Object.entries(this.config.scripting)) {
        if (key === '@minecraft/server') {
          m.modules.push({
            type: 'script',
            uuid: this.UUIDGenerator.generateUUIDFromSeed('server_script'),
            version: [1, 0, 0],
            description: key,
          });
        }

        m.dependencies.push({
          module_name: key,
          version: value,
        });
      }
    }

    return manifest;
  }
}

class ResourcePackManifestBuilder extends BaseManifestBuilder {
  public build(): ManifestV2 {
    const manifest = new ManifestV2(
      this.UUIDGenerator.generateUUIDFromSeed('resource_manifest'),
      this.version
    );

    const m = manifest.manifest;

    m.header.description = this.description;
    m.header.name = this.name;
    m.header.min_engine_version = this.minEngineVersion;

    return manifest;
  }
}

export class ManifestGenerator extends BaseSingletonGenerator {
  private config!: ManifestGeneratorConfig;
  private UUIDGenerator!: UUIDGenerator;

  public behaviorPackManifest!: ManifestV2;
  public resourcePackManifest!: ManifestV2;

  configurate(config: ManifestGeneratorConfig) {
    this.config = config;

    this.UUIDGenerator = new UUIDGenerator(
      config.company,
      config.projectName,
      0
    );

    this.behaviorPackManifest = new BehaviorManifestBuilder(config).build();
    this.resourcePackManifest = new ResourcePackManifestBuilder(config).build();

    return this;
  }

  public get namespace(): string {
    return `${this.config.company}_${this.config.projectName}`;
  }

  async build(): Promise<File[]> {
    return [
      {
        content: Buffer.from(
          JSON.stringify(this.behaviorPackManifest.manifest, null, 2)
        ),
        path: 'behavior_pack/manifest.json',
      },
      {
        content: Buffer.from(
          JSON.stringify(this.resourcePackManifest.manifest, null, 2)
        ),
        path: 'resource_pack/manifest.json',
      },
    ];
  }
}
