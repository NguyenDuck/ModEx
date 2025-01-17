import { BaseGenerator, type File } from '~/main';
import { json2buf } from '~/utils/jsonUtils';
import type { SpawnRules } from '../../types/generated/behavior/spawn_rules';

export class SpawnRuleGenerator extends BaseGenerator {
  public spawnRuleFile: SpawnRules;

  get format_version() {
    return this.spawnRuleFile.format_version;
  }

  constructor(
    public fileName: string,
    formatVersion: SpawnRules['format_version']
  ) {
    super();

    this.spawnRuleFile = {
      format_version: formatVersion,
      'minecraft:spawn_rules': {},
    };
  }

  async build(): Promise<File[]> {
    return [
      {
        path: `behavior_pack/spawn_rules/${this.fileName}.json`,
        content: json2buf(this.spawnRuleFile),
      },
    ];
  }
}
