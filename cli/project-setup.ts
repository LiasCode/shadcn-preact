import { existsSync, readFileSync } from "node:fs";
import { basename, dirname, extname, join, relative, resolve, sep } from "node:path";

import { readJsonConfig, removeJsonValue, setJsonValue } from "./json-config";
import { projectPath } from "./project-path";
import type { Configuration, FileChange } from "./types";

const marker = "// Configured by shadcn-preact init.";
const configFiles = [
  "vite.config.js",
  "vite.config.mjs",
  "vite.config.ts",
  "vite.config.cjs",
  "vite.config.mts",
  "vite.config.cts",
];

function localImport(from: string, target: string) {
  const path = relative(dirname(from), target).split(sep).join("/");

  return path.startsWith(".") ? path : `./${path}`;
}

function managedVite(configPath: string, config: Configuration) {
  const css = JSON.stringify(localImport(configPath, config.paths.css));
  const ui = JSON.stringify(localImport(configPath, config.paths.ui));
  const src = JSON.stringify(localImport(configPath, "src"));

  return `${marker}
import { fileURLToPath } from "node:url";
import preact from "@preact/preset-vite";
import tailwindcss from "@tailwindcss/vite";
import { mergeConfig, normalizePath } from "vite";
import type { ConfigEnv, Plugin, PluginOption, UserConfig, UserConfigExport } from "vite";

async function flatten(plugins: PluginOption[]): Promise<Plugin[]> {
  const result: Plugin[] = [];

  for (const option of plugins) {
    const plugin = await option;

    if (Array.isArray(plugin)) {
      result.push(...await flatten(plugin));
    } else if (plugin) {
      result.push(plugin);
    }
  }

  return result;
}

export function configurePreact(original: UserConfigExport = {}) {
  return async (env: ConfigEnv): Promise<UserConfig> => {
    const user = await (typeof original === "function" ? original(env) : original);
    const plugins = (await flatten(user.plugins ?? [])).filter((plugin) => !plugin.name.startsWith("vite:react"));
    const userAliases = user.resolve?.alias;
    const hasSourceAlias = Array.isArray(userAliases)
      ? userAliases.some((alias) => alias.find === "@")
      : !!userAliases && Object.hasOwn(userAliases, "@");
    const styles = fileURLToPath(new URL(${css}, import.meta.url));
    const required: PluginOption[] = [];

    if (!plugins.some((plugin) => plugin.name === "preact:config" || plugin.name.startsWith("vite:preact"))) {
      // CJS Vite configs can expose the preset through an extra default export.
      const preset = typeof preact === "function" ? preact : (preact as { default: typeof preact }).default;
      required.push(preset());
    }

    if (!plugins.some((plugin) => plugin.name.startsWith("@tailwindcss/vite"))) {
      const tailwind = typeof tailwindcss === "function" ? tailwindcss : (tailwindcss as { default: typeof tailwindcss }).default;
      required.push(tailwind());
    }

    required.push({
      name: "shadcn-preact:styles",
      transformIndexHtml: {
        order: "pre",
        handler: () => [{ tag: "link", attrs: { rel: "stylesheet", href: "/@fs/" + normalizePath(styles) }, injectTo: "head" }],
      },
    });

    return mergeConfig({ ...user, plugins }, {
      plugins: required,
      resolve: {
        alias: [
          { find: /^react\\/jsx-dev-runtime$/, replacement: "preact/jsx-runtime" },
          { find: /^react\\/jsx-runtime$/, replacement: "preact/jsx-runtime" },
          { find: /^react-dom\\/test-utils$/, replacement: "preact/test-utils" },
          { find: /^react-dom\\/client$/, replacement: "preact/compat/client" },
          { find: /^react-dom$/, replacement: "preact/compat" },
          { find: /^react$/, replacement: "preact/compat" },
          { find: "@/components/ui", replacement: fileURLToPath(new URL(${ui}, import.meta.url)) },
          ...(!hasSourceAlias ? [{ find: "@", replacement: fileURLToPath(new URL(${src}, import.meta.url)) }] : []),
        ],
      },
    });
  };
}
`;
}

function typescriptChanges(cwd: string, config: Configuration, viteFiles: string[]): FileChange[] {
  const changes: FileChange[] = [];
  const visited = new Set<string>();

  function inheritedSettings(
    absolute: string,
    seen = new Set<string>(),
  ): {
    base?: string;
    paths: Record<string, string[]>;
    types?: string[];
    target?: string;
    lib?: string[];
  } {
    if (seen.has(absolute) || !existsSync(absolute)) {
      return { paths: {} };
    }

    seen.add(absolute);

    const data = readJsonConfig(readFileSync(absolute, "utf8"));
    const compiler = (data.compilerOptions ?? {}) as Record<string, unknown>;
    let parent: ReturnType<typeof inheritedSettings> = { paths: {} };

    if (typeof data.extends === "string" && data.extends.startsWith(".")) {
      const target = resolve(dirname(absolute), data.extends);
      parent = inheritedSettings(target.endsWith(".json") ? target : `${target}.json`, seen);
    }

    const base =
      typeof compiler.baseUrl === "string"
        ? resolve(dirname(absolute), compiler.baseUrl)
        : parent.base;
    const paths = compiler.paths as Record<string, string[]> | undefined;

    return {
      base,
      paths: paths
        ? Object.fromEntries(
            Object.entries(paths).map(([name, values]) => [
              name,
              values.map((value) => resolve(base ?? dirname(absolute), value)),
            ]),
          )
        : parent.paths,
      types: (compiler.types as string[] | undefined) ?? parent.types,
      target: (compiler.target as string | undefined) ?? parent.target,
      lib: (compiler.lib as string[] | undefined) ?? parent.lib,
    };
  }

  function visit(path: string) {
    if (visited.has(path)) {
      return;
    }

    visited.add(path);

    const absolute = projectPath(cwd, path);
    let source = existsSync(absolute)
      ? readFileSync(absolute, "utf8")
      : JSON.stringify(
          {
            compilerOptions: {
              target: "ES2022",
              lib: ["ES2023", "DOM", "DOM.Iterable"],
              strict: true,
              types: ["vite/client", "node"],
            },
            include: ["src", "*.ts", "*.mts"],
          },
          null,
          2,
        ) + "\n";
    const original = readJsonConfig(source);
    const compiler = (original.compilerOptions ?? {}) as Record<string, unknown>;
    const inherited = inheritedSettings(absolute);
    const base = dirname(absolute);
    source = removeJsonValue(source, ["compilerOptions", "baseUrl"]);

    const mapped = (target: string) => localImport(join(base, "placeholder"), join(cwd, target));
    const aliases = {
      react: [mapped("node_modules/preact/compat")],
      "react-dom": [mapped("node_modules/preact/compat")],
      "react-dom/client": [mapped("node_modules/preact/compat/client")],
      "react-dom/test-utils": [mapped("node_modules/preact/test-utils")],
      "react/jsx-runtime": [mapped("node_modules/preact/jsx-runtime")],
      "react/jsx-dev-runtime": [mapped("node_modules/preact/jsx-runtime")],
      "@/components/ui/*": [mapped(`${config.paths.ui}/*`)],
    };

    const target = inherited.target?.toUpperCase() ?? "";

    if (!["ES2022", "ES2023", "ES2024", "ES2025", "ESNEXT"].includes(target)) {
      source = setJsonValue(source, ["compilerOptions", "target"], "ES2022");
    }

    const libraries = inherited.lib ?? [];
    source = setJsonValue(
      source,
      ["compilerOptions", "lib"],
      [
        ...new Set([
          ...libraries,
          "ES2023",
          ...(path.includes("node") ? [] : ["DOM", "DOM.Iterable"]),
        ]),
      ],
    );

    for (const [key, value] of Object.entries({
      jsx: "react-jsx",
      jsxImportSource: "preact",
      module: "ESNext",
      moduleResolution: "Bundler",
      noEmit: true,
      allowImportingTsExtensions: true,
      skipLibCheck: true,
      esModuleInterop: true,
    })) {
      source = setJsonValue(source, ["compilerOptions", key], value);
    }

    for (const [name, values] of Object.entries(inherited.paths)) {
      source = setJsonValue(
        source,
        ["compilerOptions", "paths", name],
        values.map((value) => localImport(join(base, "placeholder"), value)),
      );
    }

    if (inherited.base && !inherited.paths["*"]) {
      source = setJsonValue(
        source,
        ["compilerOptions", "paths", "*"],
        [localImport(join(base, "placeholder"), join(inherited.base, "*"))],
      );
    }

    if (
      !inherited.paths["@/*"] &&
      !(compiler.paths as Record<string, unknown> | undefined)?.["@/*"]
    ) {
      source = setJsonValue(source, ["compilerOptions", "paths", "@/*"], [mapped("src/*")]);
    }

    for (const [key, value] of Object.entries(aliases)) {
      source = setJsonValue(source, ["compilerOptions", "paths", key], value);
    }

    const types = inherited.types;

    if (types) {
      source = setJsonValue(
        source,
        ["compilerOptions", "types"],
        [...new Set([...types, "vite/client", "node"])],
      );
    }

    const include = original.include as string[] | undefined;

    if (
      include &&
      (path.includes("node") || include.some((item) => item.includes("vite.config")))
    ) {
      source = setJsonValue(
        source,
        ["include"],
        [...new Set([...include, ...viteFiles.map((file) => localImport(path, file))])],
      );
    }

    changes.push({ path, content: source, merge: true });

    const references = original.references as { path: string }[] | undefined;

    for (const reference of references ?? []) {
      const candidate = resolve(dirname(absolute), reference.path);
      const target = existsSync(join(candidate, "tsconfig.json"))
        ? join(candidate, "tsconfig.json")
        : candidate.endsWith(".json")
          ? candidate
          : `${candidate}.json`;
      visit(relative(cwd, target));
    }

    if (typeof original.extends === "string" && original.extends.startsWith(".")) {
      const candidate = resolve(dirname(absolute), original.extends);
      const target = candidate.endsWith(".json") ? candidate : `${candidate}.json`;
      const local = relative(cwd, target);

      if (!local.startsWith(`..${sep}`) && existsSync(target)) {
        visit(local);
      }
    }
  }

  visit("tsconfig.json");

  for (const path of ["tsconfig.app.json", "tsconfig.node.json"]) {
    if (existsSync(projectPath(cwd, path))) {
      visit(path);
    }
  }

  return changes;
}

export function projectSetup(cwd: string, config: Configuration): FileChange[] {
  const changes: FileChange[] = [];
  const manifestPath = projectPath(cwd, "package.json");
  let manifest = existsSync(manifestPath)
    ? readFileSync(manifestPath, "utf8")
    : JSON.stringify(
        {
          name: basename(cwd)
            .toLowerCase()
            .replace(/[^a-z0-9-]/g, "-"),
          private: true,
          type: "module",
        },
        null,
        2,
      ) + "\n";
  const data = readJsonConfig(manifest);
  const scripts = (data.scripts ?? {}) as Record<string, string>;

  for (const [name, command] of Object.entries({
    dev: "vite",
    build: "tsc -b && vite build",
    preview: "vite preview",
  })) {
    if (!scripts[name]) {
      manifest = setJsonValue(manifest, ["scripts", name], command);
    }
  }

  changes.push({ path: "package.json", content: manifest, merge: true });

  const explicit = [scripts.dev, scripts.build]
    .filter(Boolean)
    .map((script) =>
      script
        ?.match(/(?:--config|-c)(?:=|\s+)(?:["']([^"']+)["']|(\S+))/)
        ?.slice(1)
        .find(Boolean),
    )
    .find(Boolean);
  const vitePath =
    explicit ?? configFiles.find((path) => existsSync(projectPath(cwd, path))) ?? "vite.config.mts";
  const existingPath = projectPath(cwd, vitePath);
  const extension = extname(vitePath);
  const helper = join(dirname(vitePath), "shadcn-preact.vite.mts");
  const backup = vitePath.slice(0, -extension.length) + `.shadcn-preact.original${extension}`;
  changes.push(
    ...typescriptChanges(cwd, config, [
      vitePath,
      helper,
      ...(existsSync(existingPath) ? [backup] : []),
    ]),
  );
  const original = existsSync(existingPath) ? readFileSync(existingPath, "utf8") : undefined;

  if (!original?.startsWith(marker)) {
    if (original) {
      changes.push({ path: backup, content: original });
    }

    const commonjs = extension === ".cjs" || extension === ".cts";
    const helperImport = JSON.stringify(localImport(vitePath, helper));
    const base = JSON.stringify(localImport(vitePath, backup));
    const wrapper = commonjs
      ? `${marker}\nmodule.exports = async (env${extension === ".cts" ? ': import("vite").ConfigEnv' : ""}) => {\n  const { configurePreact } = await import(${helperImport});\n  return configurePreact(${original ? `require(${base})` : "{}"})(env);\n};\n`
      : `${marker}\n${original ? `import original from ${base};\n` : ""}import { configurePreact } from ${helperImport};\n\nexport default configurePreact(${original ? "original" : ""});\n`;
    changes.push({ path: vitePath, content: wrapper, merge: true });
  }

  changes.push({ path: helper, content: managedVite(helper, config) });

  const htmlPath = projectPath(cwd, "index.html");

  if (!existsSync(htmlPath)) {
    const entry =
      [
        "src/main.tsx",
        "src/main.jsx",
        "src/main.ts",
        "src/main.js",
        "src/index.tsx",
        "src/index.jsx",
      ].find((path) => existsSync(projectPath(cwd, path))) ?? "src/main.tsx";

    if (!existsSync(projectPath(cwd, entry))) {
      changes.push({
        path: entry,
        content: `import { render } from "preact";\n\nfunction App() {\n  return <main className="p-8"><h1 className="text-2xl font-semibold">Your Preact project is ready</h1></main>;\n}\n\nrender(<App />, document.getElementById("app")!);\n`,
      });
    }

    changes.push({
      path: "index.html",
      content: `<!doctype html>\n<html lang="en">\n  <head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /><title>Preact app</title></head>\n  <body><div id="app"></div><script type="module" src="/${entry.split(sep).join("/")}"></script></body>\n</html>\n`,
    });
  }

  return changes;
}
