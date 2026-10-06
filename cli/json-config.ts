type Token = { text: string; start: number; end: number; string?: string };

function tokens(source: string): Token[] {
  const result: Token[] = [];

  for (let index = 0; index < source.length;) {
    const start = index;
    const char = source[index]!;

    if (/\s/.test(char) || char === "\uFEFF") {
      index++;
      continue;
    }

    if (source.startsWith("//", index)) {
      const end = source.indexOf("\n", index);
      index = end === -1 ? source.length : end;
      continue;
    }

    if (source.startsWith("/*", index)) {
      const end = source.indexOf("*/", index + 2);

      if (end === -1) {
        throw new Error("Unclosed JSON configuration comment.");
      }

      index = end + 2;
      continue;
    }

    if (char === '"') {
      index++;

      while (index < source.length) {
        if (source[index] === "\\") {
          index += 2;
        } else if (source[index++] === '"') {
          break;
        }
      }

      const text = source.slice(start, index);
      result.push({ text, start, end: index, string: JSON.parse(text) });
    } else if ("{}[]:,".includes(char)) {
      result.push({ text: char, start, end: ++index });
    } else {
      while (index < source.length && !/[\s{}[\]:,/]/.test(source[index]!)) {
        index++;
      }

      if (index === start) {
        throw new Error(`Invalid JSON configuration at offset ${index}.`);
      }

      result.push({ text: source.slice(start, index), start, end: index });
    }
  }

  return result;
}

export function readJsonConfig(source: string): Record<string, unknown> {
  const items = tokens(source);
  const json = items
    .filter(
      (token, index) => token.text !== "," || !["}", "]"].includes(items[index + 1]?.text ?? ""),
    )
    .map((token) => token.text)
    .join("");
  const value: unknown = JSON.parse(json);

  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("Expected a JSON configuration object.");
  }

  return value as Record<string, unknown>;
}

function valueEnd(items: Token[], start: number) {
  let depth = 0;

  for (let index = start; index < items.length; index++) {
    const text = items[index]!.text;

    if (text === "{" || text === "[") {
      depth++;
    } else if (text === "}" || text === "]") {
      depth--;
    }

    if (depth === 0) {
      return index;
    }
  }

  throw new Error("Incomplete JSON configuration value.");
}

/** Change individual JSONC properties, preserving unrelated values and comments. */
export function setJsonValue(source: string, path: string[], value: unknown): string {
  readJsonConfig(source);

  const items = tokens(source);
  let object = 0;

  for (let depth = 0; depth < path.length; depth++) {
    const key = path[depth]!;
    const end = valueEnd(items, object);
    let found: { start: number; end: number } | undefined;

    for (let index = object + 1; index < end;) {
      const name = items[index]!.string;
      const start = index + 2;
      const last = valueEnd(items, start);

      if (name === key) {
        found = { start, end: last };
        break;
      }

      index = last + 1;

      if (items[index]?.text === ",") {
        index++;
      }
    }

    if (!found) {
      const nested = path
        .slice(depth + 1)
        .reduceRight<unknown>((child, name) => ({ [name]: child }), value);
      const previous = items[end - 1]!.text;
      const comma = previous === "{" || previous === "," ? "" : ",";
      const indent = "  ".repeat(depth + 1);
      const position = items[end]!.start;
      const previousEnd = items[end - 1]!.end;
      const before = (
        source.slice(0, previousEnd) +
        comma +
        source.slice(previousEnd, position)
      ).replace(/[ \t]*$/, "");
      const addition = `${before.endsWith("\n") ? "" : "\n"}${indent}${JSON.stringify(key)}: ${JSON.stringify(nested, null, 2).replaceAll("\n", `\n${indent}`)}\n${"  ".repeat(depth)}`;

      return before + addition + source.slice(position);
    }

    if (depth === path.length - 1) {
      const start = items[found.start]!.start;
      const end = items[found.end]!.end;
      const original = source.slice(start, end);
      const originalTokens = tokens(original);
      const parsed = JSON.parse(
        originalTokens
          .filter(
            (token, index) =>
              token.text !== "," || !["}", "]"].includes(originalTokens[index + 1]?.text ?? ""),
          )
          .map((token) => token.text)
          .join(""),
      );

      if (JSON.stringify(parsed) === JSON.stringify(value)) {
        return source;
      }

      const indent = "  ".repeat(depth + 1);
      return (
        source.slice(0, start) +
        JSON.stringify(value, null, 2).replaceAll("\n", `\n${indent}`) +
        source.slice(end)
      );
    }

    object = found.start;

    if (items[object]?.text !== "{") {
      throw new Error(`Expected an object at ${path.slice(0, depth + 1).join(".")}.`);
    }
  }

  return source;
}

/** Remove a retired option without rewriting the surrounding JSONC file. */
export function removeJsonValue(source: string, path: string[]): string {
  readJsonConfig(source);

  const items = tokens(source);
  let object = 0;

  for (let depth = 0; depth < path.length; depth++) {
    const end = valueEnd(items, object);
    let found = false;

    for (let index = object + 1; index < end;) {
      const last = valueEnd(items, index + 2);

      if (items[index]!.string === path[depth]) {
        if (depth === path.length - 1) {
          const following = items[last + 1]?.text === "," ? items[last + 1] : undefined;
          const preceding = items[index - 1]?.text === "," ? items[index - 1] : undefined;
          const start = !following && preceding ? preceding.start : items[index]!.start;
          const finish = following?.end ?? items[last]!.end;

          return source.slice(0, start) + source.slice(finish);
        }

        object = index + 2;
        found = true;
        break;
      }

      index = last + 1;

      if (items[index]?.text === ",") {
        index++;
      }
    }

    if (!found || items[object]?.text !== "{") {
      return source;
    }
  }

  return source;
}
