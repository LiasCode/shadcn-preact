import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

for (const mutation of ["visual", "behavior"]) {
  const result = spawnSync(process.execPath, [resolve(import.meta.dirname, "compare.mjs")], {
    env: {
      ...process.env,
      BROWSER_PARITY_CASE: "button",
      BROWSER_PARITY_DIRECTION: "ltr",
      BROWSER_PARITY_MUTATION: mutation,
    },
    encoding: "utf8",
  });
  assert.equal(
    result.status,
    1,
    `${mutation}: comparison must reject the mutation\n${result.stdout}\n${result.stderr}`,
  );
  const report = JSON.parse(
    readFileSync(
      resolve(import.meta.dirname, `../../.cache/browser-parity/mutation-${mutation}/report.json`),
      "utf8",
    ),
  );
  assert.equal(report.failures.length, 4);

  assert.ok(
    report.failures.every((failure) =>
      mutation === "visual"
        ? failure.error.includes("pixels differ")
        : failure.error.includes("clicked"),
    ),
    `Unexpected failure: ${JSON.stringify(report.failures)}`,
  );

  console.log(`✓ ${mutation} mutation rejected at both widths and in both themes`);
}
