import type { Trading } from 'bpt/trading';
import { BaseGenerator, ManifestGenerator, type File } from '~/main';
import { json2buf } from '~/utils/jsonUtils';

export class TradingTableGenerator extends BaseGenerator {
  public tradingTableFile: Trading;

  constructor(
    public filePath: string,
    format_version: string
  ) {
    super();

    this.tradingTableFile = {
      format_version,
      tiers: [],
    };
  }

  async build(): Promise<File[]> {
    const { author, namespace } = ManifestGenerator.getInstance();
    return [
      {
        content: json2buf(this.tradingTableFile),
        path: `behavior_pack/trading/${author}/${namespace}/${this.filePath}.json`,
      },
    ];
  }
}
