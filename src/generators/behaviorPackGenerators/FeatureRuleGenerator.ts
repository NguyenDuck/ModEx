import type { FeatureRules } from 'bpt/feature_rules';
import { BaseGenerator, type File } from '~/main';
import { json2buf } from '~/utils/jsonUtils';

export class FeatureRuleGenerator extends BaseGenerator {
  public featureRule: FeatureRules;
  public fileName: string;

  constructor(fileName: string, format_version: string) {
    super();

    if (fileName.endsWith('.json')) {
      throw new Error(
        'Feature Rule file name should not end with .json, we will automatically add it for you'
      );
    }

    this.fileName = fileName;

    this.featureRule = {
      format_version: format_version,
      'minecraft:feature_rules': {},
    };
  }

  async build(): Promise<File[]> {
    return [
      {
        path: `behavior_pack/feature_rules/${this.fileName}.json`,
        content: json2buf(this.featureRule),
      },
    ];
  }
}
