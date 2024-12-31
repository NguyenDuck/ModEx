import { BaseGenerator, type File } from '~/main';
import type { Features } from '~/types/generated/behavior/features';
import { json2buf } from '~/utils/jsonUtils';

export class FeatureGenerator extends BaseGenerator {
  public featureFile: Features;

  constructor(
    public fileName: string,
    formatVersion: string
  ) {
    super();

    this.featureFile = {
      format_version: formatVersion,
    };
  }

  async build(): Promise<File[]> {
    return [
      {
        path: `behavior_pack/features/${this.fileName}.json`,
        content: json2buf(this.featureFile),
      },
    ];
  }
}
