import type { ComponentEntry } from "./catalog";

/** Builds the usage snippet shown on a component page, importing from the consumer's conventional folder. */
export function usageSnippet({ slug, name, exports }: ComponentEntry): string {
  const primary = exports[0] ?? name.replaceAll(" ", "");

  if (exports.length === 1) {
    return `import { ${primary} } from "@/components/ui/${slug}"

export function Example() {
  return <${primary}>${name}</${primary}>
}`;
  }

  return `import {
  ${exports.slice(0, 5).join(",\n  ")}
} from "@/components/ui/${slug}"

export function Example() {
  return (
    <${primary}>
      {/* compose the parts you need */}
    </${primary}>
  )
}`;
}