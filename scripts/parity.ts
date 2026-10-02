// Checks the registry against the original shadcn/ui (ADR 0008): the vendored shadcn Tailwind CSS, the neutral theme
// tokens, and, for every rebuilt component, its exports and every literal token (Tailwind classes, data-slot values,
// tag names). Components still on the old `./share/` primitives are reported as pending. Usage: bun run parity

import { existsSync, readdirSync, readFileSync } from "node:fs";
import { basename, join } from "node:path";

import { componentNames, paths, referenceComponent, tsMorph } from "./upstream";

const root = join(import.meta.dirname, "..");
const registryDir = join(root, "registry/ui");
const project = new tsMorph.Project({ useInMemoryFileSystem: true });
const { Node, ScriptKind } = tsMorph;

let failures = 0;
const fail = (message: string) => {
  failures++;
  console.log(`✗ ${message}`);
};

// Vendored `shadcn/tailwind.css`.
const vendoredCss = join(root, "src/styles/shadcn-tailwind.css");
if (readFileSync(vendoredCss, "utf8") !== readFileSync(paths.tailwindCss, "utf8")) {
  fail(`src/styles/shadcn-tailwind.css differs from ${paths.tailwindCss}; copy it again.`);
} else {
  console.log("✓ src/styles/shadcn-tailwind.css matches upstream");
}

// Neutral theme tokens in `src/index.css`.
const { THEMES } = await import(paths.themes);
const neutral = THEMES.find((theme: { name: string }) => theme.name === "neutral");
const css = readFileSync(join(root, "src/index.css"), "utf8");
for (const [mode, selector] of [
  ["light", ":root"],
  ["dark", ".dark"],
] as const) {
  const block = css.match(new RegExp(`^${selector.replace(".", "\\.")} \\{([^}]*)\\}`, "m"))?.[1] ?? "";
  for (const [name, value] of Object.entries<string>(neutral.cssVars[mode])) {
    const actual = block.match(new RegExp(`--${name}:\\s*([^;]+);`))?.[1]?.trim();
    if (actual !== value) fail(`src/index.css ${selector} --${name} is ${actual ?? "missing"}, upstream ${value}`);
  }
}
if (failures === 0) console.log("✓ neutral theme tokens match upstream");

type Shape = { exports: Set<string>; tokens: Map<string, number> };

function shapeOf(source: string, filename: string): Shape {
  const file = project.createSourceFile(filename, source, { scriptKind: ScriptKind.TSX, overwrite: true });
  const exports = new Set<string>(file.getExportedDeclarations().keys());
  const tokens = new Map<string, number>();
  file.forEachDescendant((node: InstanceType<typeof Node>) => {
    if (!Node.isStringLiteral(node) && !Node.isNoSubstitutionTemplateLiteral(node)) return;
    const parent = node.getParent();
    if (Node.isImportDeclaration(parent) || Node.isExportDeclaration(parent)) return;
    for (const token of node.getLiteralText().split(/\s+/).filter(Boolean)) {
      tokens.set(token, (tokens.get(token) ?? 0) + 1);
    }
  });
  return { exports, tokens };
}

function difference<T>(a: Iterable<T>, b: Set<T> | Map<T, unknown>): T[] {
  return [...a].filter((item) => !b.has(item));
}

const local = new Set(
  readdirSync(registryDir)
    .filter((file) => file.endsWith(".tsx"))
    .map((file) => basename(file, ".tsx")),
);
const pending: string[] = [];
const missing: string[] = [];
let matching = 0;

for (const name of componentNames()) {
  if (!local.has(name)) {
    missing.push(name);
    continue;
  }
  const source = readFileSync(join(registryDir, `${name}.tsx`), "utf8");
  if (source.includes('from "./share/')) {
    pending.push(name);
    continue;
  }

  const ours = shapeOf(source, `ours-${name}.tsx`);
  const theirs = shapeOf(await referenceComponent(name), `upstream-${name}.tsx`);
  const problems = [
    ...difference(theirs.exports, ours.exports).map((item) => `missing export ${item}`),
    ...difference(ours.exports, theirs.exports).map((item) => `extra export ${item}`),
    ...difference(theirs.tokens.keys(), ours.tokens).map((item) => `missing "${item}"`),
    ...difference(ours.tokens.keys(), theirs.tokens).map((item) => `extra "${item}"`),
  ];
  if (problems.length > 0) {
    fail(`${name}:\n    ${problems.join("\n    ")}`);
  } else {
    matching++;
  }
}

console.log(`✓ ${matching} rebuilt components match upstream`);
console.log(`… ${pending.length} pending (old primitives): ${pending.join(", ") || "none"}`);
console.log(`… ${missing.length} not ported yet: ${missing.join(", ") || "none"}`);

const extraLocal = difference(local, new Set(componentNames())).filter(
  (name) => existsSync(join(registryDir, `${name}.tsx`)) && name !== "theme",
);
if (extraLocal.length > 0) console.log(`… not in upstream: ${extraLocal.join(", ")}`);

process.exit(failures > 0 ? 1 : 0);