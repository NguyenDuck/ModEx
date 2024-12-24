
import { AssetHandler, BasicFileHandler, ManifestGenerator, modExCore } from '../../src/main'

test("Empty global manifest", () => {
    modExCore.getInstance().setFileHandler(new BasicFileHandler({
        behaviorPackPath: "./tests/.build/bp",
        resourcePackPath: "./tests/.build/rp",
        cacheFilePath: "./tests/.build/.modexcache",
    }))

    ManifestGenerator.getInstance().configurate({
        author: "Test Author",
        namespacePrefix: "test",
    })

    AssetHandler.getInstance().configurate({
        assetsFolderPath: '../../RP',
    })

    modExCore.getInstance().build()
})