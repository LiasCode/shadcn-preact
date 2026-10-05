import type { ComponentChild } from "preact";

/** Small safe formatter for these static examples; all text is escaped by Preact. */
function inline(text: string): ComponentChild[] {
  return text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((part, index) =>
    part.startsWith("**") ? (
      <strong key={index}>{part.slice(2, -2)}</strong>
    ) : part.startsWith("`") ? (
      <code key={index} className="rounded bg-muted px-1 font-mono text-xs">
        {part.slice(1, -1)}
      </code>
    ) : (
      part
    ),
  );
}

export function Markdown({ children }: { children: string }) {
  return (
    <div data-slot="markdown" className="w-full min-w-0 space-y-3">
      {children
        .trim()
        .split(/\n\s*\n/)
        .map((paragraph, index) => {
          const lines = paragraph.split("\n");

          if (lines.every((line) => /^\d+\. /.test(line))) {
            return (
              <ol key={index} className="list-decimal space-y-1 pl-5">
                {lines.map((line, i) => (
                  <li key={i}>{inline(line.replace(/^\d+\. /, ""))}</li>
                ))}
              </ol>
            );
          }

          return <p key={index}>{inline(paragraph)}</p>;
        })}
    </div>
  );
}
