#!/usr/bin/env bun
import { resolve } from "node:path";

import { addComponents, initialize, readRegistry } from "./install";
import type { Options } from "./types";

const help = `shadcn-preact — copy-paste Preact components, Base UI + nova

Usage:
  shadcn-preact init                  Configure paths, theme CSS and shared dependencies
  shadcn-preact add button dialog     Install components and their dependency closures
  shadcn-preact list                  List available components

Options:
  -c, --cwd <directory>    Target project (default: current directory)
  -p, --path <directory>   Component directory relative to the project
  --css <file>            Global stylesheet path (init only)
  -a, --all               Install the full catalog (add only)
  -o, --overwrite         Replace existing files that differ
  --dry-run               Show files and dependencies without changing the project
  --no-install            Copy files without running bun add
  -h, --help              Show help

Requires Bun and an existing Preact project with Tailwind v4 and compatibility aliases.
Manual installation and degit remain available in the documentation.`;

export function run(args: string[]) {
  const options: Options = {
    cwd: process.cwd(),
    dryRun: false,
    overwrite: false,
    install: true,
    all: false,
  };
  const names: string[] = [];
  let command: string | undefined;

  for (let index = 0; index < args.length; index++) {
    const arg = args[index]!;

    if (arg === "--help" || arg === "-h") {
      console.log(help);
      return;
    }

    if (["--cwd", "-c", "--path", "-p", "--css"].includes(arg)) {
      const value = args[++index];

      if (!value || value.startsWith("-")) {
        throw new Error(`Missing value for ${arg}`);
      }

      if (arg === "--cwd" || arg === "-c") {
        options.cwd = resolve(value);
      } else if (arg === "--css") {
        options.css = value;
      } else {
        options.path = value;
      }
    } else if (arg === "--dry-run") {
      options.dryRun = true;
    } else if (arg === "--overwrite" || arg === "-o") {
      options.overwrite = true;
    } else if (arg === "--no-install") {
      options.install = false;
    } else if (arg === "--all" || arg === "-a") {
      options.all = true;
    } else if (arg.startsWith("-")) {
      throw new Error(`Unknown option: ${arg}`);
    } else if (!command) {
      command = arg;
    } else {
      names.push(arg);
    }
  }

  if (!command) {
    console.log(help);
    return;
  }

  if (!["init", "add", "list"].includes(command)) {
    throw new Error(`Unknown command: ${command}. Use --help.`);
  }

  if (
    (options.css && command !== "init") ||
    (options.all && command !== "add") ||
    (names.length > 0 && command !== "add")
  ) {
    throw new Error("Unexpected arguments. Use --help to see options for each command.");
  }

  const registry = readRegistry();

  if (command === "list") {
    for (const [slug, component] of Object.entries(registry.components)) {
      console.log(`${slug.padEnd(20)} ${component.name}`);
    }
  } else if (command === "init") {
    initialize(registry, options);
  } else {
    addComponents(registry, names, options);
  }
}

if (import.meta.main) {
  try {
    run(process.argv.slice(2));
  } catch (error) {
    console.error(`shadcn-preact: ${error instanceof Error ? error.message : String(error)}`);
    process.exitCode = 1;
  }
}
