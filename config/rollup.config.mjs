import { folderInput } from "rollup-plugin-folder-input";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import postcss from "rollup-plugin-postcss";
import commonjs from "@rollup/plugin-commonjs";
import { babel } from "@rollup/plugin-babel";
import terser from "@rollup/plugin-terser";

export default {
    input: ["wp-content/themes/tims-theme/src/scripts/*.js"],
    output: {
        dir: "wp-content/themes/tims-theme/dist/scripts/",
        format: "esm",
    },
    plugins: [folderInput(), nodeResolve(), postcss(), commonjs(), babel({ babelHelpers: "bundled" }), terser()],
};
