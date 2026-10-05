import { beforeAll, expect, test } from "bun:test";
import { spawnSync } from "node:child_process";
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, resolve } from "node:path";

import { componentDocsPlugin } from "../../scripts/component-docs";
import { componentCatalog } from "../../src/lib/component-catalog";

const root = resolve(import.meta.dirname, "../..");
const cache = join(root, ".cache/component-docs");

beforeAll(() => {
  componentDocsPlugin();
});

test("degit selections copy complete components and licenses while preserving installed components", () => {
  const extracted = mkdtempSync(join(root, ".cache/component-docs-test-"));

  try {
    for (const { slug } of componentCatalog) {
      const doc = JSON.parse(readFileSync(join(cache, `${slug}.json`), "utf8"));
      const workingDirectory = join(extracted, slug);
      const destination = join(workingDirectory, "src/components/ui");
      mkdirSync(destination, { recursive: true });

      writeFileSync(join(destination, "existing.tsx"), "existing component");

      const [clone, ...copy] = (doc.installCommand as string).split("\n");
      const parts = clone!.split(" ");
      expect(parts.slice(0, 3)).toEqual([
        "bunx",
        "degit@3.10.0",
        "https://github.com/LiasCode/shadcn-preact#main",
      ]);
      expect(parts[3]).toBe(`./.cache/shadcn-preact/${slug}`);
      expect(parts[4]).toBe("--files");
      expect(parts[6]).toBe("--force");

      const staging = resolve(workingDirectory, parts[3]!);
      const selection = parts[5]!.split(",");
      expect(selection).toContain("LICENSE.md");
      expect(selection).toContain("registry/ui/primitives/LICENSE");
      expect(selection).toContain(`registry/ui/${slug}.tsx`);

      // Simulate only degit's selected source files, then execute the documented copy steps.
      for (const path of selection) {
        const selected = join(staging, path);
        mkdirSync(dirname(selected), { recursive: true });

        cpSync(join(root, path), selected);
      }

      const copied = spawnSync("sh", ["-eu", "-c", copy.join("\n")], { cwd: workingDirectory });
      expect(copied.status, `${slug}: ${copied.stderr.toString()}`).toBe(0);
      expect(readFileSync(join(destination, "existing.tsx"), "utf8")).toBe("existing component");
      expect(readFileSync(join(destination, "LICENSE.md"), "utf8")).toContain("MIT");
      expect(readFileSync(join(destination, "primitives/LICENSE"), "utf8")).toContain("MIT");

      for (const file of doc.files as string[]) {
        const copied = join(destination, file);
        expect(readFileSync(copied)).toEqual(readFileSync(join(root, "registry/ui", file)));

        if (!/\.tsx?$/.test(file)) {
          continue;
        }

        const source = readFileSync(copied, "utf8");
        const references = [
          ...source.matchAll(/(?:from\s*|import\s*\(\s*|import\s*)["'](\.[^"']+)["']/g),
        ];

        for (const [, specifier] of references) {
          const base = resolve(dirname(copied), specifier!);
          const resolved = [
            `${base}.ts`,
            `${base}.tsx`,
            join(base, "index.ts"),
            join(base, "index.tsx"),
          ].some(existsSync);
          expect(resolved, `${slug}: missing ${file} -> ${specifier}`).toBe(true);
        }
      }
    }
  } finally {
    rmSync(extracted, { recursive: true, force: true });
  }
});

test("component guides use the port's packages and usage imports", () => {
  for (const { slug, name } of componentCatalog) {
    const doc = JSON.parse(readFileSync(join(cache, `${slug}.json`), "utf8"));

    expect(doc.name).toBe(name);
    expect(doc.packages).toContain("preact@11.0.0");
    expect(doc.packages).not.toContain("@base-ui/react@1.6.0");
    expect(doc.description.length).toBeGreaterThan(0);
    expect(doc.usage.length).toBeGreaterThan(0);
    expect(doc.usage.join("\n")).not.toContain('from "react"');
    expect(doc.usage.join("\n")).not.toContain('from "@/components/ui/');
  }
});

test("each documented preview has its own complete source and resolves to a local example", () => {
  for (const { slug } of componentCatalog) {
    const doc = JSON.parse(readFileSync(join(cache, `${slug}.json`), "utf8"));
    const demo = readFileSync(join(root, `src/modules/showcase/demos/${slug}-demo.tsx`), "utf8");
    const imports = [...demo.matchAll(/from "\.\.\/examples\/([^"\n]+)"/g)].map(
      (match) => match[1],
    );
    const ids = doc.examples.map((example: { id: string }) => example.id);

    expect(ids.length).toBeGreaterThan(0);
    expect(new Set(ids).size).toBe(ids.length);
    expect([...ids].sort()).toEqual(imports.sort());

    for (const example of doc.examples) {
      expect(example.modulePath).toBe(`../showcase/examples/${example.id}.tsx`);
      expect(example.title.length).toBeGreaterThan(0);
      expect(example.exportName.length).toBeGreaterThan(0);
      expect(example.code).not.toContain("@registry/ui/");
      expect(example.code).not.toContain("VisibleInputOTP");
      expect(readFileSync(join(root, example.sourcePath), "utf8")).toContain("export");

      for (const helper of example.helpers) {
        expect(existsSync(join(root, helper))).toBe(true);
      }
    }

    const primary = slug === "drawer" ? "drawer-non-modal" : `${slug}-demo`;

    if (imports.includes(primary)) {
      expect(ids[0]).toBe(primary);
    }
  }

  const button = JSON.parse(readFileSync(join(cache, "button.json"), "utf8"));
  const outline = button.examples.find(
    (example: { id: string }) => example.id === "button-outline",
  );
  expect(outline.code).toContain('variant="outline"');

  const drawer = JSON.parse(readFileSync(join(cache, "drawer.json"), "utf8"));
  expect(drawer.examples[0].id).toBe("drawer-non-modal");
});
