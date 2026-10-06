import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";

import { Project, SyntaxKind } from "ts-morph";

import type { Registry } from "../cli/types";
import { componentCatalog } from "../src/lib/component-catalog";

const root = resolve(import.meta.dirname, "..");

export function createComponentRegistry(): Registry {
  const registry = join(root, "registry/ui");
  const project = new Project({ skipAddingFilesFromTsConfig: true });
  const manifest = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
  const versions = { ...manifest.devDependencies, ...manifest.dependencies } as Record<
    string,
    string
  >;
  const components: Registry["components"] = {};

  for (const { slug, name } of [...componentCatalog, { slug: "theme", name: "Theme" }]) {
    const files = new Set<string>();
    const packages = new Set(["preact", "tw-animate-css"]);

    function visit(file: string) {
      if (files.has(file)) {
        return;
      }

      files.add(file);

      const source = project.addSourceFileAtPath(file);
      const specifiers = [
        ...source.getImportDeclarations().map((item) => item.getModuleSpecifierValue()),
        ...source
          .getExportDeclarations()
          .map((item) => item.getModuleSpecifierValue())
          .filter((item): item is string => Boolean(item)),
        ...source.getDescendantsOfKind(SyntaxKind.ImportType).map((item) =>
          item
            .getArgument()
            .getText()
            .replace(/^['"]|['"]$/g, ""),
        ),
      ];

      for (const specifier of specifiers) {
        if (specifier.startsWith(".")) {
          const base = resolve(dirname(file), specifier);
          const dependency = [
            base,
            `${base}.ts`,
            `${base}.tsx`,
            join(base, "index.ts"),
            join(base, "index.tsx"),
          ].find((candidate) => existsSync(candidate) && /\.tsx?$/.test(candidate));

          if (!dependency || !dependency.startsWith(`${registry}/`)) {
            throw new Error(`Unresolved registry import: ${file}: ${specifier}`);
          }

          visit(dependency);
        } else {
          packages.add(
            specifier.startsWith("@")
              ? specifier.split("/").slice(0, 2).join("/")
              : specifier.split("/")[0]!,
          );
        }
      }
    }

    visit(join(registry, `${slug}.tsx`));

    files.add(join(registry, "primitives/LICENSE"));

    const dependencies = Object.fromEntries(
      [...packages].sort().map((packageName) => {
        const version = versions[packageName];

        if (!version) {
          throw new Error(`Missing dependency version: ${packageName}`);
        }

        return [packageName, version];
      }),
    );
    components[slug] = {
      name,
      files: [...files].map((file) => relative(registry, file)).sort(),
      dependencies,
    };
  }

  const css = readFileSync(join(root, "src/index.css"), "utf8");
  const theme = css.match(/@theme inline \{[\s\S]*?@layer base \{[\s\S]*?\n\}/)?.[0];

  if (!theme) {
    throw new Error("Missing nova theme tokens");
  }

  return {
    version: 1,
    components,
    theme,
    setupDependencies: {
      preact: versions.preact!,
      cn: versions.cn!,
      "tw-animate-css": versions["tw-animate-css"]!,
    },
    setupDevDependencies: {
      tailwindcss: versions.tailwindcss!,
      "@tailwindcss/vite": versions["@tailwindcss/vite"]!,
      "@preact/preset-vite": versions["@preact/preset-vite"]!,
      vite: versions.vite!,
      typescript: versions.typescript!,
      "@types/node": versions["@types/node"]!,
    },
  };
}

if (import.meta.main) {
  const path = join(root, "cli/registry.json");
  const generated = `${JSON.stringify(createComponentRegistry(), null, 2)}\n`;

  if (process.argv.includes("--check")) {
    if (
      !existsSync(path) ||
      JSON.stringify(JSON.parse(readFileSync(path, "utf8"))) !==
        JSON.stringify(JSON.parse(generated))
    ) {
      throw new Error("CLI registry is outdated. Run bun run registry:build.");
    }

    console.log("CLI registry matches all 62 component dependency closures and nova theme tokens.");
  } else {
    writeFileSync(path, generated);

    console.log("Generated cli/registry.json.");
  }
}
