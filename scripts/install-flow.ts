// Replays the /docs/installation quick start on a fresh Vite preact-ts project with the local CLI.
// It needs network access (Vite template and npm packages), so it is separate from `bun run check`.
import { spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const cli = join(root, "cli/index.ts");
const workspace = mkdtempSync(join(tmpdir(), "shadcn-preact-flow-"));
const project = join(workspace, "my-app");

function run(command: string, args: string[], cwd: string) {
  console.log(`$ ${[command, ...args].join(" ")}`);

  const result = spawnSync(command, args, {
    cwd,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  const output = `${result.stdout}\n${result.stderr}`;

  if (result.error || result.status !== 0) {
    console.error(output);

    throw new Error(`Command failed (${result.status}): ${[command, ...args].join(" ")}`);
  }

  return output;
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(`Installation flow check failed: ${message}`);
  }
}

function write(path: string, content: string) {
  writeFileSync(join(project, path), content);
}

try {
  // Step 1: create the Vite project.
  run("bun", ["create", "vite", "my-app", "--template", "preact-ts"], workspace);
  run("bun", ["install"], project);

  // Step 2: the untouched starter must be flagged before init changes anything.
  const dryRun = run("bun", [cli, "init", "--dry-run"], project);

  assert(
    dryRun.includes("already declares --border, --accent"),
    "init does not warn about the starter's theme variables",
  );

  // Clean the starter styles exactly as the guide describes.
  rmSync(join(project, "src/app.css"));
  rmSync(join(project, "src/assets"), { recursive: true });
  write("src/index.css", '@import "tailwindcss";\n');
  write(
    "src/app.tsx",
    'export function App() {\n  return <main className="p-8">Hello</main>;\n}\n',
  );

  // Step 3: init must leave a clean project without warnings.
  const init = run("bun", [cli, "init"], project);

  assert(!init.includes("Warning"), "init warns after the starter styles were cleaned");

  for (const file of [
    "shadcn-preact.json",
    "shadcn-preact.vite.mts",
    "vite.config.shadcn-preact.original.ts",
    "src/shadcn-preact.css",
    "src/shadcn-tailwind.css",
    "src/components/ui/lib/utils.ts",
  ]) {
    assert(existsSync(join(project, file)), `init did not create ${file}`);
  }

  // Step 4: Geist, imported between Tailwind and the theme.
  run("bun", ["add", "--exact", "@fontsource-variable/geist"], project);
  write(
    "src/index.css",
    '@import "tailwindcss";\n@import "@fontsource-variable/geist";\n@import "./shadcn-preact.css";\n',
  );

  // Step 5: components, including the Theme provider used by the dark-mode section.
  run("bun", [cli, "add", "button", "dialog", "theme"], project);

  // Step 6 and the dark-mode section: the same code the guide shows.
  write(
    "src/app.tsx",
    `import { Button } from "./components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./components/ui/dialog";

export function App() {
  return (
    <main className="flex gap-3 p-8">
      <Button>Continue</Button>

      <Dialog>
        <DialogTrigger render={<Button variant="outline" />}>Open</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hello</DialogTitle>
            <DialogDescription>Your project is configured.</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </main>
  );
}
`,
  );
  write(
    "src/main.tsx",
    `import { render } from "preact";

import { App } from "./app";
import { ThemeProvider } from "./components/ui/theme";
import "./index.css";

render(
  <ThemeProvider defaultTheme="system" storageKey="ui-theme">
    <App />
  </ThemeProvider>,
  document.getElementById("app")!,
);
`,
  );

  // Step 7: the production build must type-check and bundle the theme and the font.
  run("bun", ["run", "build"], project);

  const assets = readdirSync(join(project, "dist/assets"));
  const stylesheet = assets.find((name) => name.endsWith(".css"));

  assert(stylesheet, "the build produced no stylesheet");
  assert(
    readFileSync(join(project, "dist/assets", stylesheet), "utf8").includes("--primary"),
    "the built stylesheet does not contain the nova theme",
  );
  assert(
    assets.some((name) => name.startsWith("geist-") && name.endsWith(".woff2")),
    "the build did not bundle the Geist font",
  );

  console.log("Installation flow passed: fresh Vite preact-ts project configured, built, themed.");
} finally {
  rmSync(workspace, { recursive: true, force: true });
}
