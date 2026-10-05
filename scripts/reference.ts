// Writes the upstream reference (components and examples for base-nova) inside the ignored repository cache, to read while
// porting. Usage: bun run reference [--out <dir>]

import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { parseArgs } from "node:util";

import {
  componentNames,
  exampleNames,
  referenceComponent,
  referenceExample,
  STYLE,
} from "./upstream";

const { values } = parseArgs({ options: { out: { type: "string" } } });
const outDir = resolve(
  values.out ?? join(import.meta.dirname, "../.cache/shadcn-reference", `base-${STYLE}`),
);

rmSync(outDir, { recursive: true, force: true });

mkdirSync(join(outDir, "ui"), { recursive: true });

mkdirSync(join(outDir, "examples"), { recursive: true });

for (const name of componentNames()) {
  writeFileSync(join(outDir, "ui", `${name}.tsx`), await referenceComponent(name));
}

for (const name of exampleNames()) {
  writeFileSync(join(outDir, "examples", `${name}.tsx`), referenceExample(name));
}

console.log(
  `Reference written to ${outDir}: ${componentNames().length} components, ${exampleNames().length} examples.`,
);
