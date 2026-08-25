const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const blocksDir = path.resolve(__dirname, "../wp-content/themes/tims-theme/src/styles/blocks");
const outDir = path.resolve(__dirname, "../wp-content/themes/tims-theme/blocks");
const nodeModules = path.resolve(__dirname, "../node_modules");

fs.readdirSync(blocksDir).forEach((file) => {
    if (file.endsWith(".scss")) {
        const blockName = path.basename(file, ".scss");
        const src = path.join(blocksDir, file);
        const destFolder = path.join(outDir, blockName);
        const dest = path.join(destFolder, `${blockName}.css`);
        if (!fs.existsSync(destFolder)) fs.mkdirSync(destFolder);
        execSync(`sass --load-path="${nodeModules}" --style=compressed --source-map --quiet "${src}" "${dest}"`);
    }
});
