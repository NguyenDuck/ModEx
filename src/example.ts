import { modExCore } from './domain/modExCore';
import { BlockFactory } from './factories/blockFactory/BlockFactory';
import { BlockBasicTexturePlugin } from './factories/blockFactory/plugins/blockBasicTexturePlugin';
import { BasicFileHandler } from './fileHandler/basicFileHandler';
import { AssetHandler } from './generators/assetHandler/assetHandler';
import { ManifestGenerator } from './generators/packGenerators/manifestGenerator';

const basicFileHandler = new BasicFileHandler({
  behaviorPackPath: './tests/behavior',
  resourcePackPath: './tests/resource',
  cacheFilePath: './tests/cache/filecache.txt',
});

const core = modExCore.getInstance();
core.setFileHandler(basicFileHandler);

ManifestGenerator.getInstance().configurate({
  author: 'company',
  namespacePrefix: 'project',
});

AssetHandler.getInstance().configurate({
  assetsFolderPath: './assets',
});

new BlockFactory({
  name: 'myblock',
  plugins: [
    new BlockBasicTexturePlugin({
      texture: 'dirt',
    }),
  ],
});

core.build(); // Build the project
