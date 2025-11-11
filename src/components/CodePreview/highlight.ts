import type { BundledLanguage, BundledTheme } from "shiki";
import { createHighlighterCore } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";

const highlighterPromise = createHighlighterCore({
  themes: [import("@shikijs/themes/github-dark-default")],
  langs: [
    import("@shikijs/langs/typescript"),
    import("@shikijs/langs/tsx"),
    import("@shikijs/langs/jsx"),
    import("@shikijs/langs/javascript"),
    import("@shikijs/langs/bash"),
    import("@shikijs/langs/css"),
    import("@shikijs/langs/json"),
  ],
  engine: createJavaScriptRegexEngine(),
});

export async function highlightCode(data: { codeString: string; lang: BundledLanguage; theme?: BundledTheme }) {
  const highlighter = await highlighterPromise;
  return highlighter.codeToHtml(data.codeString, {
    lang: data.lang,
    theme: data.theme ?? "github-dark-default",
  });
}

export default highlightCode;
