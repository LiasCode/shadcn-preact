import type { BundledLanguage, BundledTheme } from "shiki";
import { createHighlighterCoreSync } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";
import bash from "shiki/langs/bash.mjs";
import css from "shiki/langs/css.mjs";
import javascript from "shiki/langs/javascript.mjs";
import json from "shiki/langs/json.mjs";
import jsx from "shiki/langs/jsx.mjs";
import tsx from "shiki/langs/tsx.mjs";
import typescript from "shiki/langs/typescript.mjs";
import githubDark from "shiki/themes/github-dark-default.mjs";

const highlighterSync = createHighlighterCoreSync({
  themes: [githubDark],
  langs: [tsx, typescript, jsx, javascript, bash, css, json],
  engine: createJavaScriptRegexEngine(),
});

type HighlightCodeSyncData = {
  codeString: string;
  lang: BundledLanguage;
  theme?: BundledTheme;
};

export function highlightCodeSync(data: HighlightCodeSyncData) {
  return highlighterSync.codeToHtml(data.codeString, {
    lang: data.lang,
    theme: data.theme ?? "github-dark-default",
  });
}
