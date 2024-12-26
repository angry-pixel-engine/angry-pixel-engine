import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import { terser } from "rollup-plugin-terser";
import dts from "rollup-plugin-dts";
import del from "rollup-plugin-del";

const builderECS = (format, filename) => ({
    exports: "named",
    name: "angry-pixel",
    file: "../../bundles/angry-pixel/lib/" + filename,
    format,
    sourcemap: true,
});

const workerConfig = (worker) => ({
    input: `src/worker/${worker}.ts`,
    output: [
        builderECS("umd", `${worker}.js`),
        builderECS("esm", `${worker}.esm.js`),
        builderECS("cjs", `${worker}.cjs.js`),
    ],
    plugins: [
        nodeResolve(),
        typescript({
            compilerOptions: {
                declaration: false,
                emitDeclarationOnly: false,
                declarationDir: undefined,
            },
        }),
        commonjs({ extensions: [".ts", ".js"] }),
        terser(),
    ],
});

const main = () => {
    return [
        // this generates one file containing all the type declarations
        {
            input: "../../bundles/angry-pixel/types/index.d.ts",
            output: [
                {
                    file: "../../bundles/angry-pixel/lib/index.d.ts",
                    format: "es",
                },
            ],
            plugins: [dts(), del({ dest: "../../bundles/angry-pixel/types" })],
        },
        // this generates the modules
        {
            input: "src/index.ts",
            output: [
                builderECS("umd", "index.js"),
                builderECS("esm", "index.esm.js"),
                builderECS("cjs", "index.cjs.js"),
            ],
            plugins: [
                nodeResolve(),
                typescript({
                    compilerOptions: {
                        declaration: false,
                        emitDeclarationOnly: false,
                        declarationDir: undefined,
                    },
                }),
                commonjs({ extensions: [".ts", ".js"] }),
                terser(),
            ],
        },
        // this builds the workers
        workerConfig("broadPhaseWorker"),
    ];
};

export default main();
