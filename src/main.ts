import { modExCore } from './domain/modExCore';
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
  company: 'company',
  projectName: 'project',
});

AssetHandler.getInstance().configurate({
  assetsFolderPath: './assets',
});

// Your code goes here

core.build(); // Build the project
