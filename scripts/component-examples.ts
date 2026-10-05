import { existsSync, readFileSync } from "node:fs";
import { dirname, relative, resolve } from "node:path";

import type { Project, SourceFile } from "ts-morph";

import { componentCatalog } from "../src/lib/component-catalog";
import type { ComponentExample } from "../src/lib/component-examples";

function plainText(value: string) {
  return value
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[`*]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function sourceExportNames(source: SourceFile) {
  return new Set([
    ...source
      .getFunctions()
      .filter((item) => item.hasExportKeyword())
      .map((item) => (item.hasDefaultKeyword() ? "default" : item.getNameOrThrow())),
    ...source
      .getVariableStatements()
      .filter((item) => item.hasExportKeyword())
      .flatMap((item) => item.getDeclarations().map((declaration) => declaration.getName())),
    ...source
      .getExportDeclarations()
      .flatMap((item) =>
        item
          .getNamedExports()
          .map((declaration) => declaration.getAliasNode()?.getText() ?? declaration.getName()),
      ),
    ...source
      .getExportAssignments()
      .filter((item) => !item.isExportEquals())
      .map(() => "default"),
  ]);
}

/** Pair every rendered local example with its own source and upstream section. */
export function componentExamples(
  project: Project,
  root: string,
  slug: string,
  mdx: string,
  versions: Record<string, string>,
): ComponentExample[] {
  const demoPath = resolve(root, `src/modules/showcase/demos/${slug}-demo.tsx`);
  const demo = project.addSourceFileAtPath(demoPath);
  const imports = demo
    .getImportDeclarations()
    .filter((item) => item.getModuleSpecifierValue().startsWith("../examples/"));
  const sections = new Map<string, { title: string; description: string; order: number }>();

  for (const match of mdx.matchAll(/<ComponentPreview\b[\s\S]*?\bname="([^"]+)"[\s\S]*?\/>/g)) {
    const before = mdx.slice(0, match.index);
    const headings = [...before.matchAll(/^#{2,4} (.+)$/gm)];
    const heading = headings.at(-1);
    const text = heading ? before.slice(heading.index! + heading[0].length).trim() : "";
    const paragraph = text
      .split(/\n\s*\n/)
      .find((part) => !/^[<`#|]/.test(part) && !part.includes("\n<Component"));
    sections.set(match[1]!, {
      title: heading ? plainText(heading[1]!) : "Overview",
      description: paragraph && !paragraph.includes("```") ? plainText(paragraph) : "",
      order: match.index,
    });
  }

  const examples = imports.map((item): ComponentExample => {
    const specifier = item.getModuleSpecifierValue();
    const sourcePath = resolve(dirname(demoPath), `${specifier}.tsx`);
    const source = project.addSourceFileAtPath(sourcePath);
    const id = specifier.split("/").at(-1)!;
    const exportName = item.getDefaultImport() ? "default" : item.getNamedImports()[0]?.getName();

    const exportNames = sourceExportNames(source);

    if (!exportName || !exportNames.has(exportName)) {
      throw new Error(`Missing example export: ${id}: ${exportName}`);
    }

    const section = sections.get(id);
    const suffix = id.replace(new RegExp(`^${slug}-?`), "").replace(/^example-?/, "");
    const fallback =
      suffix === "demo" || !suffix
        ? "Overview"
        : suffix
            .split("-")
            .map((word) =>
              word === "otp"
                ? "OTP"
                : word === "api"
                  ? "API"
                  : word[0]!.toUpperCase() + word.slice(1),
            )
            .join(" ");
    const helpers: string[] = [];
    const components = new Map<string, { slug: string; name: string }>();
    const packages = new Set<string>();

    for (const dependency of source.getImportDeclarations()) {
      const path = dependency.getModuleSpecifierValue();
      const component = componentCatalog.find(({ slug }) => path === `@registry/ui/${slug}`);

      if (component && component.slug !== slug) {
        components.set(component.slug, component);
      } else if (
        (path.startsWith(".") || path.startsWith("@/")) &&
        !path.endsWith("/visible-input-otp")
      ) {
        const base = path.startsWith("@/")
          ? resolve(root, "src", path.slice(2))
          : resolve(dirname(sourcePath), path);
        const helper = [`${base}.tsx`, `${base}.ts`].find(existsSync);

        if (!helper) {
          throw new Error(`Missing example helper: ${id}: ${path}`);
        }

        helpers.push(relative(root, helper));
      } else if (!path.startsWith(".") && !path.startsWith("@") && !path.startsWith("preact")) {
        const name = path.split("/")[0]!;

        if (versions[name]) {
          packages.add(`${name}@${versions[name]}`);
        }
      }
    }

    return {
      id,
      title: section?.title ?? fallback,
      description: section?.description ?? "",
      modulePath: `../showcase/examples/${id}.tsx`,
      exportName,
      code: readFileSync(sourcePath, "utf8")
        .replaceAll("@registry/ui/", "./components/ui/")
        .replace(
          'import { VisibleInputOTP as InputOTP } from "../components/visible-input-otp";',
          'import { InputOTP } from "./components/ui/input-otp";',
        ),
      sourcePath: relative(root, sourcePath),
      helpers,
      components: [...components.values()],
      packages: [...packages],
    };
  });

  return examples.sort((a, b) => {
    const primary = (id: string) =>
      id === `${slug}-demo` || (slug === "drawer" && id === "drawer-non-modal");

    return (
      Number(primary(b.id)) - Number(primary(a.id)) ||
      (sections.get(a.id)?.order ?? Infinity) - (sections.get(b.id)?.order ?? Infinity)
    );
  });
}
