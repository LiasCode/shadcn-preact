// Checks the registry against the original shadcn/ui (ADR 0008): the vendored shadcn Tailwind CSS, the neutral theme
// tokens, exports, runtime literal multiplicity, declared props/defaults and JSX structure/attributes.
// Missing or retired wrappers fail. This is static wrapper parity, not functional certification. Usage: bun run parity

import { existsSync, readdirSync, readFileSync } from "node:fs";
import { basename, join, resolve } from "node:path";

import { parityAdaptations, matchesAdaptation } from "./parity-adaptations";
import { componentShape, compareEntries } from "./parity-shape";
import { componentNames, paths, referenceComponent, tsMorph } from "./upstream";

const root = join(import.meta.dirname, "..");
// An isolated fixture directory is used by CLI regression tests; production checks default to registry/ui.
const registryDir = resolve(process.env.PARITY_REGISTRY_DIR ?? join(root, "registry/ui"));
const project = new tsMorph.Project({ useInMemoryFileSystem: true });
const { ScriptKind } = tsMorph;

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
  const block =
    css.match(new RegExp(`^${selector.replace(".", "\\.")} \\{([^}]*)\\}`, "m"))?.[1] ?? "";

  for (const [name, value] of Object.entries<string>(neutral.cssVars[mode])) {
    const actual = block.match(new RegExp(`--${name}:\\s*([^;]+);`))?.[1]?.trim();

    if (actual !== value) {
      fail(`src/index.css ${selector} --${name} is ${actual ?? "missing"}, upstream ${value}`);
    }
  }
}

if (failures === 0) {
  console.log("✓ neutral theme tokens match upstream");
}

function exportsOf(source: string, filename: string): Set<string> {
  const file = project.createSourceFile(filename, source, {
    scriptKind: ScriptKind.TSX,
    overwrite: true,
  });
  return new Set(file.getExportedDeclarations().keys());
}

const usedAdaptations = new Set<string>();

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

    fail(`${name}: missing upstream component`);
    continue;
  }

  const source = readFileSync(join(registryDir, `${name}.tsx`), "utf8");

  if (source.includes('from "./share/')) {
    pending.push(name);

    fail(`${name}: still uses retired primitives`);
    continue;
  }

  const reference = await referenceComponent(name);
  const ours = componentShape(source, `ours-${name}.tsx`);
  const theirs = componentShape(reference, `upstream-${name}.tsx`);
  const ourExports = exportsOf(source, `ours-${name}.tsx`);
  const theirExports = exportsOf(reference, `upstream-${name}.tsx`);
  const problems = [
    ...difference(theirExports, ourExports).map((item) => `missing export ${item}`),
    ...difference(ourExports, theirExports).map((item) => `extra export ${item}`),
    ...compareEntries("runtime literal counts", ours.tokens, theirs.tokens),
  ];

  for (const category of ["props", "jsx"] as const) {
    const localShape = new Map(ours[category]);
    const upstreamShape = new Map(theirs[category]);

    for (const adaptation of parityAdaptations) {
      if (adaptation.component !== name || adaptation.category !== category) {
        continue;
      }

      const local = localShape.get(adaptation.member);
      const upstream = upstreamShape.get(adaptation.member);

      if (matchesAdaptation(local, upstream, adaptation)) {
        localShape.delete(adaptation.member);

        upstreamShape.delete(adaptation.member);

        usedAdaptations.add(`${name}:${category}:${adaptation.member}`);
      }
    }

    problems.push(...compareEntries(category, localShape, upstreamShape));
  }

  if (problems.length > 0) {
    fail(`${name}:\n    ${problems.join("\n    ")}`);
  } else {
    matching++;
  }
}

for (const adaptation of parityAdaptations) {
  const key = `${adaptation.component}:${adaptation.category}:${adaptation.member}`;

  if (!usedAdaptations.has(key)) {
    fail(
      `${key}: reviewed adaptation no longer matches; inspect and update/remove its exact contract`,
    );
  }
}

console.log(
  `✓ ${matching} wrappers match upstream exports, runtime literal counts, prop declarations and JSX`,
);

console.log(`… ${usedAdaptations.size} exact documented adaptation(s)`);

console.log(
  "… Static wrapper parity does not certify primitive behavior, resolved public types or visual equivalence.",
);

console.log(`… ${pending.length} pending (old primitives): ${pending.join(", ") || "none"}`);

console.log(`… ${missing.length} not ported yet: ${missing.join(", ") || "none"}`);

const extraLocal = difference(local, new Set(componentNames())).filter(
  (name) => existsSync(join(registryDir, `${name}.tsx`)) && name !== "theme",
);

if (extraLocal.length > 0) {
  console.log(`… not in upstream: ${extraLocal.join(", ")}`);
}

process.exit(failures > 0 ? 1 : 0);
