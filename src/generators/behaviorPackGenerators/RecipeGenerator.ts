import type { Recipe } from 'bpt/recipes';
import { BaseGenerator, type File } from '~/main';
import { json2buf } from '~/utils/jsonUtils';

export class RecipeGenerator extends BaseGenerator {
  public recipeFile: Recipe;

  get format_version() {
    return this.recipeFile.format_version;
  }

  constructor(
    public fileName: string,
    format_version: string
  ) {
    super();

    if (fileName.endsWith('.json')) {
      throw new Error(
        'Recipe file name should not end with .json, we will automatically add it for you'
      );
    }

    this.recipeFile = {
      format_version,
    };
  }

  async build(): Promise<File[]> {
    return [
      {
        content: json2buf(this.recipeFile),
        path: `behavior_pack/recipes/${this.fileName}.json`,
      },
    ];
  }
}
