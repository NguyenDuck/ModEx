import { json2buf } from '~/utils/jsonUtils';
import type { File } from '../../main';
import type { Animation } from '../../types/generated/behavior/animations';
import { BaseGenerator } from '../baseGenerator';

export class BpAnimationGenerator extends BaseGenerator {
  public animationFile: Animation;

  public get format_version() {
    return this.animationFile.format_version;
  }

  constructor(public fileName: string) {
    super();

    if (fileName.endsWith('.json')) {
      throw new Error(
        'Animation file name should not end with .json, we will automatically add it for you'
      );
    }

    this.animationFile = {
      format_version: '1.10.0',
      animations: {},
    };
  }

  async build(): Promise<File[]> {
    if (Object.keys(this.animationFile.animations).length === 0) {
      throw new Error('Could not build animation: No animations were added');
    }

    return [
      {
        content: json2buf(this.animationFile),
        path: `behavior_pack/animations/${this.fileName}.json`,
      },
    ];
  }
}
