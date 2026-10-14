import { createHighlighterCoreSync } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";
import bash from "shiki/langs/bash.mjs";
import css from "shiki/langs/css.mjs";
import json from "shiki/langs/json.mjs";
import tsx from "shiki/langs/tsx.mjs";
import githubDark from "shiki/themes/github-dark.mjs";
import githubLight from "shiki/themes/github-light.mjs";

import type { HighlightedCode } from "../src/lib/highlighted-code.ts";

/** "text" is for output that is not code, such as directory trees; it is only escaped. */
export type HighlightLanguage = "bash" | "css" | "json" | "text" | "tsx";

// Runs only in Node while the documentation data is generated: nothing here reaches the browser.
const highlighter = createHighlighterCoreSync({
  themes: [githubLight, githubDark],
  langs: [tsx, bash, css, json],
  engine: createJavaScriptRegexEngine(),
});

const entities: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;" };

function escapeHtml(value: string) {
  return value.replace(/[&<>]/g, (character) => entities[character]!);
}

/**
 * Tokenize code into static HTML. Each token carries its light and dark colors as the custom
 * properties `--shiki-light` and `--shiki-dark`; `src/index.css` picks one by the `.dark` class.
 * Text content is escaped, so the markup can be injected as-is and still reads back as `code`.
 */
export function highlightCode(code: string, language: HighlightLanguage): HighlightedCode {
  if (language === "text") {
    return { code, html: escapeHtml(code) };
  }

  const { tokens } = highlighter.codeToTokens(code, {
    lang: language,
    themes: { light: "github-light", dark: "github-dark" },
    defaultColor: false,
  });
  const html = tokens
    .map((line) =>
      line
        .map((token) => {
          const style = Object.entries(token.htmlStyle ?? {})
            .map(([property, value]) => `${property}:${value}`)
            .join(";");

          return style
            ? `<span style="${style}">${escapeHtml(token.content)}</span>`
            : escapeHtml(token.content);
        })
        .join(""),
    )
    .join("\n");

  return { code, html };
}
