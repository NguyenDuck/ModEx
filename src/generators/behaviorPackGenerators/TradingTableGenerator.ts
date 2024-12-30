import { BaseGenerator, ManifestGenerator, type File } from '~/main';
import { json2buf } from '~/utils/jsonUtils';
import type { Trading } from '../../types/generated/behavior/trading';

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
