export const createConfig = ({
  bpPath,
  rpPath,
  author: companyName,
  namespacePrefix: projectName,
}: {
  bpPath: string;
  rpPath: string;
  author: string;
  namespacePrefix: string;
}) => `// Here all the configuration for the ModExpedite
// framework is defined.

import {
  AssetHandler,
  BasicFileHandler,
  ManifestGenerator,
  modExCore,
} from 'modexpedite';

// Start the modex core
const core = modExCore.getInstance();

// ===================================================
// CONFIGURATION:
const fileConfig = new BasicFileHandler({
  cacheFilePath: '.modexcache', // A path to save a cache file useful for incremental builds, usually you can ignore this
  behaviorPackPath: \`${bpPath}\`, // Path to save the behavior pack
  resourcePackPath: \`${rpPath}\`, // Path to save the resource pack
});

ManifestGenerator.getInstance().configurate({
  author: \`${companyName}\`, // A short name for your company. You can also use your username
  namespacePrefix: \`${projectName}\`, // The namespace to be used for all the entities, blocks and more of this project.
});

AssetHandler.getInstance().configurate({
  assetsFolderPath: './assets', // The path to the folder where you will be putting your assets
});

// ===================================================

core.setFileHandler(fileConfig);
`;
