import { json2buf } from '~/utils/jsonUtils';
import type { File } from '../../main';
import type { AnimationController } from '../../types/generated/behavior/animation_controller';
import { BaseGenerator } from '../baseGenerator';

export class BpAnimationControllerGenerator extends BaseGenerator {
  public animationControllerFile: AnimationController;

  public get format_version() {
    return this.animationControllerFile.format_version;
  }

  constructor(public fileName: string) {
    super();

    if (fileName.endsWith('.json')) {
      throw new Error(
        'Animation controller file name should not end with .json, we will automatically add it for you'
      );
    }

    this.animationControllerFile = {
      format_version: '1.10.0',
      animation_controllers: {},
    };
  }

  async build(): Promise<File[]> {
    if (
      Object.keys(this.animationControllerFile.animation_controllers).length ===
      0
    ) {
      throw new Error(
        'Could not build animation controller: No animation controllers were added'
      );
    }

    return [
      {
        content: json2buf(this.animationControllerFile),
        path: `behavior_pack/animation_controllers/${this.fileName}.json`,
      },
    ];
  }
}
