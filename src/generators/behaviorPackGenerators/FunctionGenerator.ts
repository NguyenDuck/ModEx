import { BaseGenerator, type File } from '~/main';

export class FunctionGenerator extends BaseGenerator {
  public functionCommands: string[];

  constructor(public fileName: string) {
    super();

    if (fileName.endsWith('.mcfunction')) {
      throw new Error(
        'Function file name should not end with .mcfunction, we will automatically add it for you'
      );
    }

    this.functionCommands = [];
  }

  async build(): Promise<File[]> {
    if (this.functionCommands.length === 0) {
      throw new Error('Could not build function: No commands were added');
    }

    return [
      {
        path: `behavior_pack/functions/${this.fileName}.mcfunction`,
        content: Buffer.from(this.functionCommands.join('\n')),
      },
    ];
  }
}
