// Bundle the application modules for Node using Vite's existing bundler.
import { rolldown } from "rolldown";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { spawnSync } from "node:child_process";

const output = path.resolve("node_modules/.cache/blockly-instances/tests.cjs");
await mkdir(path.dirname(output), { recursive: true });
const bundle = await rolldown({
  input: "src/components/Blockly/fields/FieldInstance.test.js",
  platform: "node",
  external: (id) =>
    !id.startsWith(".") && !id.startsWith("/") && !id.startsWith("@/"),
  resolve: { alias: { "@": path.resolve("src") } },
});
await bundle.write({ file: output, format: "cjs", codeSplitting: false });
await bundle.close();
const result = spawnSync(process.execPath, ["--test", output], {
  stdio: "inherit",
});
process.exitCode = result.status ?? 1;
