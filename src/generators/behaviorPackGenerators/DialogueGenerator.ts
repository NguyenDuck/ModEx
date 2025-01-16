import { BaseGenerator, type File } from '~/main';
import { json2buf } from '~/utils/jsonUtils';
import type { NPCDialogue } from '../../types/generated/behavior/dialogue';

export class DialogueGenrator extends BaseGenerator {
  public dialogue: NPCDialogue;

  get format_version() {
    return this.dialogue.format_version;
  }

  constructor(
    public fileName: string,
    formatVersion: string
  ) {
    super();
    if (fileName.endsWith('.json')) {
      throw new Error(
        'Dialogue file name should not end with .json, we will automatically add it for you'
      );
    }

    this.dialogue = {
      format_version: formatVersion,
      'minecraft:npc_dialogue': {},
    };
  }

  async build(): Promise<File[]> {
    return [
      {
        content: json2buf(this.dialogue),
        path: `behavior_pack/dialogue/${this.dialogue}.json`,
      },
    ];
  }
}
