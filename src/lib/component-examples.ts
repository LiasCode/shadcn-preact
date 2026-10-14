import type { HighlightedCode } from "./highlighted-code";

export type ComponentExample = {
  id: string;
  title: string;
  description: string;
  modulePath: string;
  exportName: string;
  code: string;
  /** `code` highlighted at build time. */
  html: string;
  sourcePath: string;
  helpers: string[];
  components: { slug: string; name: string }[];
  packages: string[];
  /** `bun add` command for `packages`, or null when the example needs none. */
  packagesCommand: HighlightedCode | null;
};
