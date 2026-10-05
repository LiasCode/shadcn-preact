import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

import { referenceComponent } from "../upstream";

const root = resolve(import.meta.dirname, "../..");
const cache = join(root, ".cache/browser-parity");
const { wrappers: names } = JSON.parse(readFileSync(join(import.meta.dirname, "manifest.json"), "utf8")) as {
  wrappers: string[];
};
for (const name of names) {
  const source = (await referenceComponent(name))
    .replaceAll('from "./primitives/', 'from "@base-ui/react/')
    .replaceAll('from "./lib/utils"', 'from "cn"')
    .replaceAll('from "lucide-preact"', 'from "lucide-react"');
  mkdirSync(join(cache, "upstream/ui"), { recursive: true });
  writeFileSync(join(cache, "upstream/ui", `${name}.tsx`), source);
}
const fixture = readFileSync(join(import.meta.dirname, "fixture.txt"), "utf8");
for (const runtime of ["local", "upstream"]) {
  const dir = join(cache, runtime);
  mkdirSync(dir, { recursive: true });
  const mount =
    runtime === "local"
      ? 'import { render } from "preact"; render(<Fixture />, document.getElementById("app"));'
      : 'import { createRoot } from "react-dom/client"; createRoot(document.getElementById("app")).render(<Fixture />);';
  writeFileSync(join(dir, "main.tsx"), fixture.replace("MOUNT", mount));
  // Override the repository's Preact JSX setting only in the independent React fixture.
  writeFileSync(
    join(dir, "tsconfig.json"),
    JSON.stringify({
      compilerOptions: { jsx: "react-jsx", jsxImportSource: runtime === "local" ? "preact" : "react" },
    }),
  );
  writeFileSync(
    join(dir, "index.html"),
    '<!doctype html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body><div id="app"></div><script type="module" src="/main.tsx"></script></body></html>',
  );
  writeFileSync(
    join(dir, "style.css"),
    `@import "${join(root, "src/index.css")}";\n@source "../upstream/ui";\nhtml { font-family: Arial, sans-serif; }\nbody { margin: 0; }\nmain { padding: 32px; max-width: 384px; }\n*, *::before, *::after { animation-duration: 0s !important; transition-duration: 0s !important; }\n`,
  );
}
console.log("Prepared independent Preact and React/Base UI browser fixtures from the pinned upstream.");