import { randomUUID } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";

import { Project, SyntaxKind } from "ts-morph";
import type { Plugin } from "vite";

import { componentCatalog } from "../src/lib/component-catalog";
import { repositoryUrl } from "../src/lib/site";

const root = resolve(import.meta.dirname, "..");
const registry = join(root, "registry/ui");
const output = join(root, ".cache/component-docs");

function writeAtomic(path: string, data: string) {
  const temporary = `${path}.${randomUUID()}.tmp`;
  writeFileSync(temporary, data);

  renameSync(temporary, path);
}

/** Generate documentation and degit file selections from the actual dependency graph. */
export function componentDocsPlugin(): Plugin {
  mkdirSync(output, { recursive: true });

  const project = new Project({ skipAddingFilesFromTsConfig: true });
  const manifest = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
  const versions = { ...manifest.devDependencies, ...manifest.dependencies } as Record<
    string,
    string
  >;
  const exports = new Map<string, { slug: string; name: string }>();

  for (const component of componentCatalog) {
    const source = project.addSourceFileAtPath(join(registry, `${component.slug}.tsx`));

    for (const name of source.getExportedDeclarations().keys()) {
      if (/^[A-Z]/.test(name)) {
        exports.set(name, component);
      }
    }
  }

  function resolveLocal(owner: string, specifier: string) {
    const base = resolve(dirname(owner), specifier);
    const file = [
      base,
      `${base}.ts`,
      `${base}.tsx`,
      join(base, "index.ts"),
      join(base, "index.tsx"),
    ].find((candidate) => existsSync(candidate) && /\.(?:ts|tsx)$/.test(candidate));

    if (!file || !file.startsWith(`${registry}/`)) {
      throw new Error(`Unresolved registry import: ${owner}: ${specifier}`);
    }

    return file;
  }

  for (const { slug, name } of componentCatalog) {
    const files = new Set<string>();
    const packages = new Set<string>(["preact", "tw-animate-css"]);

    function visit(file: string) {
      if (files.has(file)) {
        return;
      }

      files.add(file);

      const source = project.addSourceFileAtPath(file);
      const imports = [
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

      for (const specifier of imports) {
        if (specifier.startsWith(".")) {
          visit(resolveLocal(file, specifier));
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

    const packageList = [...packages].sort().map((name) => {
      if (!versions[name]) {
        throw new Error(`Missing dependency version: ${name}`);
      }

      return `${name}@${versions[name]}`;
    });
    const mdxPath = join(
      root,
      `upstream/shadcn/apps/v4/content/docs/components/${slug === "sonner" ? "radix" : "base"}`,
      `${slug}.mdx`,
    );
    const mdx = readFileSync(mdxPath, "utf8");
    const description = mdx.match(/^description: (.+)$/m)?.[1]?.replace(/^['"]|['"]$/g, "");

    if (!description) {
      throw new Error(`Missing upstream description: ${slug}`);
    }

    const usageSection = mdx.match(/\n## Usage\n([\s\S]*?)(?=\n## |$)/)?.[1] ?? "";
    const usage = [...usageSection.matchAll(/```(?:tsx|ts|jsx)[^\n]*\n([\s\S]*?)```/g)].map(
      (match) =>
        match[1]!
          .trim()
          .replaceAll("@/components/ui/", "./components/ui/")
          .replaceAll('from "react"', 'from "preact/compat"')
          .replaceAll('from "lucide-react"', 'from "lucide-preact"'),
    );
    if (
      usage.some((code) => code.includes("React.")) &&
      !usage.some((code) => /import .*React/.test(code))
    ) {
      usage.unshift('import * as React from "preact/compat";');
    }

    const demoPath = join(root, "src/modules/showcase/demos", `${slug}-demo.tsx`);
    const demo = readFileSync(demoPath, "utf8");
    const needsNotifications = [
      "sonner",
      "toast",
      "bubble",
      "marker",
      "questionnaire",
      "message-scroller",
      "sidebar",
    ].includes(slug);
    const exampleImport =
      [...demo.matchAll(/from "(\.\.\/examples\/[^"\n]+)"/g)].find((match) =>
        match[1]!.endsWith(`${slug}-demo`),
      ) ?? [...demo.matchAll(/from "(\.\.\/examples\/[^"\n]+)"/g)][0];
    const exampleFile =
      slug === "drawer"
        ? join(root, "src/modules/showcase/examples/drawer-non-modal.tsx")
        : exampleImport
          ? resolve(dirname(demoPath), `${exampleImport[1]}.tsx`)
          : demoPath;
    const example = readFileSync(exampleFile, "utf8")
      .replaceAll("@registry/ui/", "./components/ui/")
      .replace(
        'import { VisibleInputOTP as InputOTP } from "../components/visible-input-otp";',
        'import { InputOTP } from "./components/ui/input-otp";',
      );
    if (usage.length === 0) {
      usage.push(example);
    }

    const related = new Map<string, { slug: string; name: string }>();
    const imported = new Set<string>();

    for (const code of usage) {
      for (const match of code.matchAll(
        /import(?:\s+type)?\s+\{([^}]+)\}\s+from\s+["']([^"']+)["']/g,
      )) {
        for (const name of match[1]!.split(",")) {
          imported.add(
            name
              .trim()
              .split(/\s+as\s+/)
              .at(-1)!
              .replace(/^type /, ""),
          );
        }

        const component = componentCatalog.find(
          (component) => match[2] === `./components/ui/${component.slug}`,
        );

        if (component && !files.has(join(registry, `${component.slug}.tsx`))) {
          related.set(component.slug, component);
        }
      }
    }

    const extraImports = new Map<string, Set<string>>();

    for (const tag of usage.join("\n").matchAll(/<([A-Z]\w*)\b/g)) {
      const name = tag[1]!;
      const component = exports.get(name);

      if (component && !imported.has(name)) {
        const names = extraImports.get(component.slug) ?? new Set<string>();
        names.add(name);
        extraImports.set(component.slug, names);
        imported.add(name);

        if (!files.has(join(registry, `${component.slug}.tsx`))) {
          related.set(component.slug, component);
        }
      }
    }

    if (extraImports.size > 0) {
      usage.unshift(
        [...extraImports]
          .map(
            ([slug, names]) =>
              `import { ${[...names].join(", ")} } from "./components/ui/${slug}";`,
          )
          .join("\n"),
      );
    }

    const helpers = [...example.matchAll(/from "(\.\.\/support\/[^"\n]+)"/g)].map((match) => {
      const base = resolve(dirname(exampleFile), match[1]!);
      const path = [`${base}.tsx`, `${base}.ts`].find(existsSync);

      if (!path) {
        throw new Error(`Missing example helper: ${base}`);
      }

      return relative(root, path);
    });
    files.add(join(registry, "primitives/LICENSE"));

    const sourceFiles = [...files].map((file) => relative(registry, file)).sort();
    const staging = `./.cache/shadcn-preact/${slug}`;
    const selectedFiles = ["LICENSE.md", ...sourceFiles.map((file) => `registry/ui/${file}`)];
    const installCommand = [
      `bunx degit@3.10.0 ${repositoryUrl}#main ${staging} --files ${selectedFiles.join(",")} --force`,
      "mkdir -p ./src/components/ui",
      `cp -R ${staging}/registry/ui/. ./src/components/ui/`,
      `cp ${staging}/LICENSE.md ./src/components/ui/LICENSE.md`,
    ].join("\n");

    writeAtomic(
      join(output, `${slug}.json`),
      JSON.stringify({
        slug,
        name,
        description,
        packages: packageList,
        needsNotifications,
        files: sourceFiles,
        installCommand,
        usage,
        example,
        examplePath: relative(root, exampleFile),
        helpers: [...new Set(helpers)],
        relatedComponents: [...related.values()],
        referenceUrl: `https://ui.shadcn.com/docs/components/${slug === "sonner" ? "radix" : "base"}/${slug}`,
      }),
    );
  }

  return { name: "component-documentation" };
}
