import type { HighlightedCode } from "./highlighted-code";

/**
 * The code blocks of /docs/installation. `scripts/installation-docs.ts` must provide every key, and
 * the page reads them by name, so a missing or misspelled snippet fails type-checking.
 */
export type InstallationSnippetKey =
  | "create"
  | "cleanFiles"
  | "cleanCss"
  | "cleanApp"
  | "init"
  | "geistInstall"
  | "geistCss"
  | "add"
  | "usage"
  | "verify"
  | "addTheme"
  | "main"
  | "options"
  | "tree"
  | "runtimeInstall"
  | "developmentInstall"
  | "manualVite"
  | "manualTypescript"
  | "copyCatalog"
  | "manualCss"
  | "themeCss";

export type InstallationSnippets = Record<InstallationSnippetKey, HighlightedCode>;
