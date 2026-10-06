import { afterEach, expect, test } from "bun:test";
import { spawnSync } from "node:child_process";
import {
  chmodSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { join, resolve } from "node:path";

import { readRegistry } from "../../cli/install";
import { readJsonConfig } from "../../cli/json-config";

const root = resolve(import.meta.dirname, "../..");
const temporary: string[] = [];

function project() {
  const cwd = mkdtempSync(join(root, ".cache/cli-test-"));
  temporary.push(cwd);

  writeFileSync(
    join(cwd, "package.json"),
    JSON.stringify({ name: "test-app", dependencies: { preact: "11.0.0" } }),
  );

  mkdirSync(join(cwd, "src"));

  writeFileSync(
    join(cwd, "src/index.css"),
    '@import "tailwindcss";\n\n/* Keep my theme */\n.custom { color: red; }\n',
  );

  return cwd;
}

function cli(cwd: string, ...args: string[]) {
  const result = spawnSync(
    "bun",
    [join(root, "cli/index.ts"), ...args, "--cwd", cwd, "--no-install"],
    { encoding: "utf8" },
  );

  return { status: result.status, output: `${result.stdout}\n${result.stderr}` };
}

afterEach(() => {
  for (const cwd of temporary.splice(0)) {
    rmSync(cwd, { recursive: true, force: true });
  }
});

test("init preserves existing CSS, is idempotent, and records custom component paths", () => {
  const cwd = project();
  expect(cli(cwd, "init", "--path", "src/ui").status).toBe(0);

  const css = readFileSync(join(cwd, "src/index.css"), "utf8");
  expect(css).toContain(".custom { color: red; }");
  expect(css.indexOf('@import "tailwindcss"')).toBeLessThan(
    css.indexOf('@import "./shadcn-preact.css"'),
  );
  expect(readFileSync(join(cwd, "src/shadcn-preact.css"), "utf8")).toContain(
    "--background: oklch(1 0 0)",
  );
  expect(readFileSync(join(cwd, "src/shadcn-tailwind.css"))).toEqual(
    readFileSync(join(root, "src/styles/shadcn-tailwind.css")),
  );
  expect(cli(cwd, "init").status).toBe(0);
  expect(readFileSync(join(cwd, "src/index.css"), "utf8")).toBe(css);
  expect(cli(cwd, "add", "button").status).toBe(0);
  expect(existsSync(join(cwd, "src/ui/button.tsx"))).toBe(true);
  expect(existsSync(join(cwd, "src/components/ui/button.tsx"))).toBe(false);
});

test("dry-run leaves the project unchanged and lists exact dependencies", () => {
  const cwd = project();
  const manifest = readFileSync(join(cwd, "package.json"), "utf8");
  const css = readFileSync(join(cwd, "src/index.css"), "utf8");
  expect(cli(cwd, "init", "--dry-run").status).toBe(0);
  expect(existsSync(join(cwd, "shadcn-preact.json"))).toBe(false);
  expect(readFileSync(join(cwd, "package.json"), "utf8")).toBe(manifest);
  expect(readFileSync(join(cwd, "src/index.css"), "utf8")).toBe(css);
  expect(cli(cwd, "init").status).toBe(0);

  const initializedManifest = readFileSync(join(cwd, "package.json"), "utf8");
  const preview = cli(cwd, "add", "dialog", "--dry-run");
  expect(preview.status).toBe(0);
  expect(preview.output).toContain("@floating-ui/react-dom@2.1.9");
  expect(preview.output).toContain("primitives/dialog/index.ts");
  expect(existsSync(join(cwd, "src/components/ui/dialog.tsx"))).toBe(false);
  expect(readFileSync(join(cwd, "package.json"), "utf8")).toBe(initializedManifest);
});

test("modified shared files abort the whole operation; explicit overwrite preserves unrelated files", () => {
  const cwd = project();
  expect(cli(cwd, "init").status).toBe(0);
  expect(cli(cwd, "add", "button").status).toBe(0);

  const destination = join(cwd, "src/components/ui");
  writeFileSync(join(destination, "lib/utils.ts"), "// custom cn\n");

  writeFileSync(join(destination, "custom.tsx"), "// my component\n");

  expect(cli(cwd, "add", "dialog").status).toBe(1);
  expect(existsSync(join(destination, "dialog.tsx"))).toBe(false);
  expect(readFileSync(join(destination, "lib/utils.ts"), "utf8")).toBe("// custom cn\n");
  expect(cli(cwd, "add", "dialog", "--overwrite").status).toBe(0);
  expect(readFileSync(join(destination, "custom.tsx"), "utf8")).toBe("// my component\n");
  expect(existsSync(join(destination, "button.tsx"))).toBe(true);
  expect(cli(cwd, "add", "dialog").output).toContain("Already up to date");
});

test("all 62 components install byte-identical source and both licenses", () => {
  const cwd = project();
  expect(cli(cwd, "init").status).toBe(0);
  expect(cli(cwd, "add", "--all").status).toBe(0);
  const registry = readRegistry();
  expect(Object.keys(registry.components)).toHaveLength(62);
  const destination = join(cwd, "src/components/ui");

  for (const [slug, component] of Object.entries(registry.components)) {
    expect(existsSync(join(destination, `${slug}.tsx`))).toBe(true);

    for (const file of component.files) {
      expect(readFileSync(join(destination, file))).toEqual(
        readFileSync(join(root, "registry/ui", file)),
      );
    }
  }

  expect(readFileSync(join(destination, "LICENSE.md"), "utf8")).toContain("MIT");
  expect(readFileSync(join(destination, "primitives/LICENSE"), "utf8")).toContain("MIT");
});

test("unknown components, invalid arguments and paths outside the project fail before writes", () => {
  const cwd = project();
  expect(cli(cwd, "add", "button").status).toBe(1);
  expect(cli(cwd, "init", "--path", "../outside").status).toBe(1);
  expect(existsSync(join(cwd, "shadcn-preact.json"))).toBe(false);
  expect(cli(cwd, "init", "--css", "src/shadcn-preact.css").status).toBe(1);
  expect(cli(cwd, "init").status).toBe(0);
  expect(cli(cwd, "add", "button", "missing").status).toBe(1);
  expect(existsSync(join(cwd, "src/components/ui/button.tsx"))).toBe(false);
  expect(cli(cwd, "add", "button", "--unknown").status).toBe(1);
  expect(cli(cwd, "add", "button", "--css", "src/index.css").status).toBe(1);
  expect(cli(cwd, "add", "button", "--path").status).toBe(1);

  const outside = project();
  symlinkSync(outside, join(cwd, "linked"));

  expect(cli(cwd, "add", "button", "--path", "linked/ui").status).toBe(1);
  expect(existsSync(join(outside, "ui"))).toBe(false);
});

test("init bootstraps an empty directory with a runnable app and framework tooling", () => {
  const cwd = mkdtempSync(join(root, ".cache/cli-test-"));
  temporary.push(cwd);

  expect(cli(cwd, "init", "--dry-run").status).toBe(0);
  expect(existsSync(join(cwd, "package.json"))).toBe(false);

  const result = cli(cwd, "init");
  expect(result.status).toBe(0);
  expect(result.output).toContain("@tailwindcss/vite@4.3.3");
  expect(result.output).toContain("typescript@7.0.2");
  const manifest = JSON.parse(readFileSync(join(cwd, "package.json"), "utf8"));
  expect(manifest.scripts).toEqual({
    dev: "vite",
    build: "tsc -b && vite build",
    preview: "vite preview",
  });
  expect(readFileSync(join(cwd, "index.html"), "utf8")).toContain("/src/main.tsx");
  expect(readFileSync(join(cwd, "src/main.tsx"), "utf8")).toContain('from "preact"');
  expect(readFileSync(join(cwd, "shadcn-preact.vite.mts"), "utf8")).toContain(
    'name: "shadcn-preact:styles"',
  );
  expect(cli(cwd, "init").output).toContain("Files: 0");
});

test("init preserves Vite functions and JSONC settings across referenced TypeScript projects", () => {
  const cwd = project();
  const vite =
    'export default ({ mode }) => ({ base: "/custom/", server: { port: 4312 }, define: { MODE: JSON.stringify(mode) } });\n';
  writeFileSync(join(cwd, "vite.config.ts"), vite);

  writeFileSync(
    join(cwd, "tsconfig.json"),
    '{\n// Project references\n"files": [], "references": [{"path":"./tsconfig.app.json"},{"path":"./tsconfig.node.json"}],\n}\n',
  );

  writeFileSync(
    join(cwd, "tsconfig.app.json"),
    '{ "compilerOptions": { // Keep strictness\n "strict": true, "paths": { "custom/*": ["./custom/*"] }, }, "include": ["src"] }',
  );

  writeFileSync(
    join(cwd, "tsconfig.node.json"),
    '{"compilerOptions":{"composite":true,"types":["node"]},"include":["vite.config.ts"]}',
  );

  expect(cli(cwd, "init", "--path", "src/ui").status).toBe(0);
  expect(readFileSync(join(cwd, "vite.config.shadcn-preact.original.ts"), "utf8")).toBe(vite);
  expect(readFileSync(join(cwd, "vite.config.ts"), "utf8")).toContain(
    'import original from "./vite.config.shadcn-preact.original.ts"',
  );
  const appSource = readFileSync(join(cwd, "tsconfig.app.json"), "utf8");
  expect(appSource).toContain("// Keep strictness");
  const app = readJsonConfig(appSource) as {
    compilerOptions: { paths: Record<string, string[]>; jsxImportSource: string };
  };
  expect(app.compilerOptions.paths["custom/*"]).toEqual(["./custom/*"]);
  expect(app.compilerOptions.paths["@/components/ui/*"]).toEqual(["./src/ui/*"]);
  expect(app.compilerOptions.jsxImportSource).toBe("preact");
  const node = readJsonConfig(readFileSync(join(cwd, "tsconfig.node.json"), "utf8")) as {
    include: string[];
  };
  expect(node.include).toContain("./shadcn-preact.vite.mts");
  expect(node.include).toContain("./vite.config.shadcn-preact.original.ts");
  expect(cli(cwd, "init").output).toContain("Files: 0");
});

test("init retains inherited aliases when adding its own TypeScript paths", () => {
  const cwd = project();
  mkdirSync(join(cwd, "config"));

  writeFileSync(
    join(cwd, "config/base.json"),
    '{"compilerOptions":{"baseUrl":"..","paths":{"@/*":["custom-src/*"],"helpers/*":["helpers/*"]}}}',
  );

  writeFileSync(join(cwd, "tsconfig.json"), '{"extends":"./config/base.json","include":["src"]}');

  expect(cli(cwd, "init").status).toBe(0);
  const config = readJsonConfig(readFileSync(join(cwd, "tsconfig.json"), "utf8")) as {
    compilerOptions: { paths: Record<string, string[]> };
  };
  expect(config.compilerOptions.paths["@/*"]).toEqual(["./custom-src/*"]);
  expect(config.compilerOptions.paths["helpers/*"]).toEqual(["./helpers/*"]);
  expect(config.compilerOptions.paths.react).toEqual(["./node_modules/preact/compat"]);
  expect(config.compilerOptions.paths["*"]).toEqual(["./*"]);
  expect(
    readJsonConfig(readFileSync(join(cwd, "config/base.json"), "utf8")).compilerOptions,
  ).not.toHaveProperty("baseUrl");
  expect(cli(cwd, "init").output).toContain("Files: 0");
});

test("failed dependency installation restores source, configuration, manifest and lockfile", () => {
  const cwd = project();
  const manifest = readFileSync(join(cwd, "package.json"), "utf8");
  const css = readFileSync(join(cwd, "src/index.css"), "utf8");
  const vite = "export default { server: { port: 4312 } };\n";
  writeFileSync(join(cwd, "vite.config.mts"), vite);

  writeFileSync(join(cwd, "bun.lock"), "original lockfile\n");

  const executables = join(cwd, "fake-bin");
  mkdirSync(executables);

  writeFileSync(join(executables, "bun"), "#!/bin/sh\nprintf broken > bun.lock\nexit 1\n");

  chmodSync(join(executables, "bun"), 0o755);

  const result = spawnSync(process.execPath, [join(root, "cli/index.ts"), "init", "--cwd", cwd], {
    encoding: "utf8",
    env: { ...process.env, PATH: `${executables}:${process.env.PATH}` },
  });
  expect(result.status).toBe(1);
  expect(result.stderr).toContain("rolled back");
  expect(readFileSync(join(cwd, "package.json"), "utf8")).toBe(manifest);
  expect(readFileSync(join(cwd, "src/index.css"), "utf8")).toBe(css);
  expect(readFileSync(join(cwd, "vite.config.mts"), "utf8")).toBe(vite);
  expect(readFileSync(join(cwd, "bun.lock"), "utf8")).toBe("original lockfile\n");
  expect(existsSync(join(cwd, "shadcn-preact.json"))).toBe(false);
  expect(existsSync(join(cwd, "tsconfig.json"))).toBe(false);
  expect(existsSync(join(cwd, "shadcn-preact.vite.mts"))).toBe(false);
  expect(existsSync(join(cwd, "vite.config.shadcn-preact.original.mts"))).toBe(false);
});
