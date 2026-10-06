import { spawnSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import {
  existsSync,
  lstatSync,
  mkdirSync,
  readFileSync,
  renameSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { dirname, isAbsolute, join, relative, resolve, sep } from "node:path";

import type { Configuration, Options, Registry } from "./types";

export const sourceRoot = resolve(import.meta.dirname, "..");
const configName = "shadcn-preact.json";

type Change = { path: string; content: string; merge?: boolean };

export function projectPath(cwd: string, path: string) {
  if (!path || isAbsolute(path)) {
    throw new Error(`Use a project-relative path: ${path}`);
  }

  const destination = resolve(cwd, path);
  const local = relative(cwd, destination);

  if (
    !local ||
    local === ".." ||
    local.startsWith(`..${sep}`) ||
    local.split(sep).includes("node_modules")
  ) {
    throw new Error(`Path must stay inside the project: ${path}`);
  }

  let current = cwd;

  const parts = local.split(sep);

  for (const [index, part] of parts.entries()) {
    current = join(current, part);
    const information = lstatSync(current, { throwIfNoEntry: false });

    if (information?.isSymbolicLink()) {
      throw new Error(`Refusing to write through a symlink: ${path}`);
    }

    if (information && index < parts.length - 1 && !information.isDirectory()) {
      throw new Error(`Expected a directory: ${relative(cwd, current)}`);
    }
  }

  return destination;
}

export function readRegistry(): Registry {
  return JSON.parse(readFileSync(join(sourceRoot, "cli/registry.json"), "utf8"));
}

function readProject(cwd: string) {
  const path = join(cwd, "package.json");

  if (!existsSync(path)) {
    throw new Error("No package.json found. Start in an existing Preact project or use --cwd.");
  }

  return JSON.parse(readFileSync(path, "utf8")) as {
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
  };
}

export function readConfiguration(cwd: string): Configuration {
  const path = projectPath(cwd, configName);

  if (!existsSync(path)) {
    throw new Error("Project is not initialized. Run shadcn-preact init first.");
  }

  const config = JSON.parse(readFileSync(path, "utf8")) as Configuration;

  if (
    config.version !== 1 ||
    config.style !== "nova" ||
    typeof config.paths?.ui !== "string" ||
    typeof config.paths?.css !== "string"
  ) {
    throw new Error(
      "Invalid shadcn-preact.json. Expected version 1, style nova, and paths.ui/paths.css.",
    );
  }

  projectPath(cwd, config.paths.ui);

  projectPath(cwd, config.paths.css);

  return config;
}

function apply(changes: Change[], dependencies: Record<string, string>, options: Options) {
  const project = readProject(options.cwd);
  const installed = { ...project.devDependencies, ...project.dependencies };
  const packages = Object.entries(dependencies)
    .filter(([name, version]) => installed[name] !== version)
    .map(([name, version]) => `${name}@${version}`);
  const writes: Change[] = [];
  const conflicts: string[] = [];

  for (const change of changes) {
    const path = projectPath(options.cwd, change.path);

    if (existsSync(path)) {
      if (!lstatSync(path).isFile()) {
        throw new Error(`Expected a file: ${change.path}`);
      }

      if (readFileSync(path, "utf8") === change.content) {
        continue;
      }

      if (!change.merge && !options.overwrite) {
        conflicts.push(change.path);
      }
    }

    writes.push(change);
  }

  console.log(`${options.dryRun ? "Would write" : "Files"}: ${writes.length}`);

  for (const change of writes) {
    console.log(`  ${change.path}`);
  }

  if (packages.length > 0) {
    console.log(`Dependencies: bun add --exact ${packages.join(" ")}`);
  }

  if (conflicts.length > 0) {
    const message = `Existing files differ:\n${conflicts.map((path) => `  ${path}`).join("\n")}\nReview them, then use --overwrite to replace them.`;

    if (options.dryRun) {
      console.log(message);
      return;
    }

    throw new Error(message);
  }

  if (options.dryRun) {
    return;
  }

  if (options.install && packages.length > 0) {
    const result = spawnSync("bun", ["add", "--exact", ...packages], {
      cwd: options.cwd,
      stdio: "inherit",
    });

    if (result.error || result.status !== 0) {
      throw new Error("Dependency installation failed. No component files were changed.");
    }
  }

  const written: { path: string; previous?: Buffer }[] = [];

  try {
    for (const change of writes) {
      const path = projectPath(options.cwd, change.path);
      const previous = existsSync(path) ? readFileSync(path) : undefined;
      const temporary = `${path}.${randomUUID()}.tmp`;
      mkdirSync(dirname(path), { recursive: true });

      try {
        writeFileSync(temporary, change.content);

        renameSync(temporary, path);
      } finally {
        rmSync(temporary, { force: true });
      }

      written.push({ path, previous });
    }
  } catch (error) {
    for (const { path, previous } of written.reverse()) {
      if (previous) {
        writeFileSync(path, previous);
      } else {
        rmSync(path, { force: true });
      }
    }

    throw error;
  }

  console.log(
    writes.length > 0 ? "Done. Component source is yours to customize." : "Already up to date.",
  );
}

export function initialize(registry: Registry, options: Options) {
  readProject(options.cwd);

  const existing = existsSync(projectPath(options.cwd, configName))
    ? readConfiguration(options.cwd)
    : undefined;
  const config: Configuration = {
    version: 1,
    style: "nova",
    paths: {
      ui: options.path ?? existing?.paths.ui ?? "src/components/ui",
      css: options.css ?? existing?.paths.css ?? "src/index.css",
    },
  };
  if (
    !config.paths.css.endsWith(".css") ||
    ["shadcn-preact.css", "shadcn-tailwind.css"].some(
      (name) => config.paths.css.endsWith(`/${name}`) || config.paths.css === name,
    )
  ) {
    throw new Error(
      "Choose a global .css stylesheet other than the generated shadcn-preact.css or shadcn-tailwind.css.",
    );
  }

  const cssPath = projectPath(options.cwd, config.paths.css);
  const cssDirectory = dirname(config.paths.css);
  const css = existsSync(cssPath) ? readFileSync(cssPath, "utf8") : "";
  const setupImport = '@import "./shadcn-preact.css";';
  const scanned = css.replace(/\/\*[\s\S]*?\*\//g, (comment) => " ".repeat(comment.length));
  const imports = [...scanned.matchAll(/^\s*@import\s+[^;]+;/gm)];
  let globalCss = css;

  if (!/\bshadcn-preact\.css["']/.test(scanned)) {
    const position = imports.at(-1);
    const end = position ? position.index! + position[0].length : 0;
    globalCss = `${css.slice(0, end)}\n${setupImport}\n${css.slice(end)}`;
  }

  if (!/@import\s+["']tailwindcss["']/.test(scanned)) {
    globalCss = `@import "tailwindcss";\n${globalCss}`;
  }

  apply(
    [
      { path: configName, content: `${JSON.stringify(config, null, 2)}\n` },
      { path: config.paths.css, content: globalCss, merge: true },
      {
        path: join(cssDirectory, "shadcn-preact.css"),
        content: `@import "tw-animate-css";\n@import "./shadcn-tailwind.css";\n\n@custom-variant dark (&:is(.dark *));\n\n${registry.theme}\n`,
      },
      {
        path: join(cssDirectory, "shadcn-tailwind.css"),
        content: readFileSync(join(sourceRoot, "src/styles/shadcn-tailwind.css"), "utf8"),
      },
      {
        path: join(config.paths.ui, "lib/utils.ts"),
        content: readFileSync(join(sourceRoot, "registry/ui/lib/utils.ts"), "utf8"),
      },
      {
        path: join(config.paths.ui, "LICENSE.md"),
        content: readFileSync(join(sourceRoot, "LICENSE.md"), "utf8"),
      },
    ],
    registry.setupDependencies,
    options,
  );

  console.log(
    "Use your framework's Preact compatibility aliases and Tailwind v4 integration. Import your global stylesheet from the app entry point.",
  );
}

export function addComponents(registry: Registry, names: string[], options: Options) {
  const config = readConfiguration(options.cwd);
  const selected = options.all ? Object.keys(registry.components) : [...new Set(names)];

  if (selected.length === 0) {
    throw new Error(
      "Choose components: shadcn-preact add button dialog, or use --all. Use list to see the catalog.",
    );
  }

  const files = new Set<string>();
  const dependencies: Record<string, string> = {};

  for (const name of selected) {
    const component = Object.hasOwn(registry.components, name)
      ? registry.components[name]
      : undefined;

    if (!component) {
      throw new Error(`Unknown component: ${name}. Use shadcn-preact list.`);
    }

    for (const file of component.files) {
      files.add(file);
    }

    Object.assign(dependencies, component.dependencies);
  }

  const destination = options.path ?? config.paths.ui;
  projectPath(options.cwd, destination);

  const changes = [...files].sort().map((file): Change => ({
    path: join(destination, file),
    content: readFileSync(projectPath(join(sourceRoot, "registry/ui"), file), "utf8"),
  }));
  changes.push({
    path: join(destination, "LICENSE.md"),
    content: readFileSync(join(sourceRoot, "LICENSE.md"), "utf8"),
  });

  console.log(`Components: ${selected.join(", ")}`);

  apply(changes, dependencies, options);
}
