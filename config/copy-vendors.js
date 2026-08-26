// Copies third-party scripts that are loaded as plain <script> tags rather than
// bundled. p5 runs in global mode -- setup()/draw() live on window -- so it has
// to be a separate global script, not part of the ES module bundle.
const fs = require("fs");
const path = require("path");

const themeRoot = path.resolve(__dirname, "../wp-content/themes/tims-theme");
const outDir = path.join(themeRoot, "dist/scripts/vendors");

const vendors = [{ from: path.resolve(__dirname, "../node_modules/p5/lib/p5.min.js"), to: path.join(outDir, "p5.min.js") }];

fs.mkdirSync(outDir, { recursive: true });

for (const vendor of vendors) {
    if (!fs.existsSync(vendor.from)) {
        throw new Error("Missing vendor file " + vendor.from + " -- run npm install first.");
    }
    fs.copyFileSync(vendor.from, vendor.to);
    console.log("copied " + path.relative(themeRoot, vendor.to));
}
