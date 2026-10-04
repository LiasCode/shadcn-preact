// Loads the original shadcn/ui checkout (ADR 0008) and runs its own transforms, so the reference is exactly what
// `shadcn add` installs for the Base UI base with the nova style. Nothing is written to the checkout.

import { existsSync, readdirSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { basename, join, resolve } from "node:path";

export const STYLE = "nova";

export const shadcnDir = resolve(process.env.SHADCN_DIR ?? join(import.meta.dirname, "../../shadcn"));

if (!existsSync(join(shadcnDir, "apps/v4/registry/bases/base/ui"))) {
  throw new Error(
    `The shadcn/ui checkout was not found at ${shadcnDir}. Clone it next to this repository or set SHADCN_DIR.`,
  );
}

export const paths = {
  ui: join(shadcnDir, "apps/v4/registry/bases/base/ui"),
  examples: join(shadcnDir, "apps/v4/examples/base"),
  style: join(shadcnDir, `apps/v4/registry/styles/style-${STYLE}.css`),
  tailwindCss: join(shadcnDir, "packages/shadcn/src/tailwind.css"),
  themes: join(shadcnDir, "apps/v4/registry/themes.ts"),
};

const upstreamRequire = createRequire(join(shadcnDir, "packages/shadcn/package.json"));

const { createStyleMap } = await import(join(shadcnDir, "packages/shadcn/src/styles/create-style-map.ts"));
const { transformStyle } = await import(join(shadcnDir, "packages/shadcn/src/styles/transform.ts"));
const { transformIcons } = await import(join(shadcnDir, "packages/registry/src/utils/transformers/transform-icons.ts"));
export const tsMorph = await import(upstreamRequire.resolve("ts-morph"));

const styleMap = createStyleMap(readFileSync(paths.style, "utf8"));
const iconProject = new tsMorph.Project({ useInMemoryFileSystem: true });

/** Names of the upstream components (file names without `.tsx`). */
export function componentNames(): string[] {
  return readdirSync(paths.ui)
    .filter((file) => file.endsWith(".tsx"))
    .map((file) => basename(file, ".tsx"))
    .sort();
}

/** Names of the upstream examples for the Base UI base. */
export function exampleNames(): string[] {
  return readdirSync(paths.examples)
    .filter((file) => file.endsWith(".tsx"))
    .map((file) => basename(file, ".tsx"))
    .sort();
}

async function resolveIcons(source: string, filename: string): Promise<string> {
  if (!source.includes("IconPlaceholder")) return source;
  const sourceFile = iconProject.createSourceFile(filename, source, {
    scriptKind: tsMorph.ScriptKind.TSX,
    overwrite: true,
  });
  await transformIcons({ filename, raw: source, sourceFile, config: { iconLibrary: "lucide" } });
  return sourceFile.getText();
}

/** Maps upstream import paths to the self-contained layout of `registry/ui` (ADR 0002, ADR 0008). */
function rewriteComponentImports(source: string): string {
  return source
    .replace(/^"use client"\n+/m, "")
    .replaceAll('from "@shadcn/react/', 'from "./primitives/')
    .replaceAll('from "@base-ui/react/', 'from "./primitives/')
    .replaceAll('from "@base-ui/react"', 'from "./primitives"')
    .replaceAll('from "cn"', 'from "./lib/utils"')
    .replaceAll('from "@/registry/bases/base/ui/', 'from "./')
    .replaceAll('from "@/registry/bases/base/hooks/', 'from "./hooks/')
    .replaceAll('from "@/registry/bases/base/lib/', 'from "./lib/')
    .replaceAll('from "lucide-react"', 'from "lucide-preact"');
}

/** Maps upstream example imports to the documentation app. */
function rewriteExampleImports(source: string): string {
  return source
    .replace(/^"use client"\n+/m, "")
    .replace(/from "@\/styles\/base-(?:nova|rhea)\/ui\//g, 'from "@registry/ui/')
    .replaceAll('from "lucide-react"', 'from "lucide-preact"');
}

/** The upstream component as installed for base-nova, with imports mapped to this repository. */
export async function referenceComponent(name: string): Promise<string> {
  const raw = readFileSync(join(paths.ui, `${name}.tsx`), "utf8");
  const styled = await transformStyle(raw, { styleMap });
  const withIcons = await resolveIcons(styled, `${name}.tsx`);
  return rewriteComponentImports(withIcons);
}

/** The upstream example with imports mapped to the documentation app. */
export function referenceExample(name: string): string {
  return rewriteExampleImports(readFileSync(join(paths.examples, `${name}.tsx`), "utf8"));
}