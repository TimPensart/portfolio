import { folderInput } from "rollup-plugin-folder-input";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { babel } from "@rollup/plugin-babel";
import terser from "@rollup/plugin-terser";

export default {
    input: ["wp-content/themes/tims-theme/src/scripts/*.js"],
    output: {
        dir: "wp-content/themes/tims-theme/dist/scripts/",
        format: "esm",
    },
    plugins: [folderInput(), nodeResolve(), commonjs(), babel({ babelHelpers: "bundled", exclude: "node_modules/**" }), terser()],
};
