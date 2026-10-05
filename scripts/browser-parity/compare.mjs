import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { resolve, join } from "node:path";

import pixelmatch from "pixelmatch";
import { chromium } from "playwright";
import { PNG } from "pngjs";
import { createServer } from "vite";

const root = resolve(import.meta.dirname, "../..");
const cache = join(root, ".cache/browser-parity");
const { cases } = JSON.parse(readFileSync(join(import.meta.dirname, "manifest.json"), "utf8"));
const output = join(
  cache,
  process.env.BROWSER_PARITY_MUTATION
    ? `mutation-${process.env.BROWSER_PARITY_MUTATION}`
    : "results",
);
rmSync(output, { recursive: true, force: true });

mkdirSync(output, { recursive: true });
const report = {
  upstream: execFileSync("git", ["-C", "upstream/shadcn", "rev-parse", "HEAD"], {
    cwd: root,
    encoding: "utf8",
  }).trim(),
  results: [],
  failures: [],
};
const servers = [];
let browser;

async function start(runtime) {
  const local = runtime === "local";
  const aliases = [
    { find: "@ui", replacement: local ? join(root, "registry/ui") : join(cache, "upstream/ui") },
    {
      find: "@primitive",
      replacement: local ? join(root, "registry/ui/primitives") : "@base-ui/react",
    },
  ];

  if (local) {
    aliases.push(
      { find: /^react\/jsx-runtime$/, replacement: "preact/jsx-runtime" },
      { find: /^react\/jsx-dev-runtime$/, replacement: "preact/jsx-runtime" },
      { find: /^react-dom$/, replacement: "preact/compat" },
      { find: /^react$/, replacement: "preact/compat" },
    );
  }

  const server = await createServer({
    configFile: false,
    root: join(cache, runtime),
    cacheDir: join(cache, `vite-${runtime}`),
    resolve: { alias: aliases },
    server: { host: "127.0.0.1", port: 0, fs: { allow: [root] } },
    css: { postcss: root },
    oxc: { jsx: { runtime: "automatic", importSource: local ? "preact" : "react" } },
  });
  servers.push(server);

  await server.listen();
  return server.resolvedUrls.local[0];
}

async function capture(pages, key, observed) {
  assert.deepEqual(observed[0], observed[1], `${key}: behavior differs`);
  const geometry = await Promise.all(
    pages.map((page) =>
      page.locator("[data-slot]").evaluateAll((nodes) =>
        nodes.map((node) => {
          const rect = node.getBoundingClientRect(),
            style = getComputedStyle(node);
          return {
            slot: node.getAttribute("data-slot"),
            tag: node.tagName,
            text: node.textContent,
            rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
            font: style.font,
            lineHeight: style.lineHeight,
            active: node === document.activeElement,
          };
        }),
      ),
    ),
  );
  writeFileSync(join(output, `${key}-geometry.json`), JSON.stringify(geometry, null, 2));
  const buffers = await Promise.all(
    pages.map((page) => page.screenshot({ animations: "disabled", caret: "hide" })),
  );
  const [local, upstream] = buffers.map((buffer) => PNG.sync.read(buffer));
  assert.equal(local.width, upstream.width);

  assert.equal(local.height, upstream.height);
  const diff = new PNG({ width: local.width, height: local.height });
  const pixels = pixelmatch(local.data, upstream.data, diff.data, local.width, local.height, {
    threshold: 0.1,
  });
  const result = {
    key,
    observed: observed[0],
    differentPixels: pixels,
    ratio: pixels / (local.width * local.height),
  };
  report.results.push(result);

  for (const [index, runtime] of ["local", "upstream"].entries()) {
    writeFileSync(join(output, `${key}-${runtime}.png`), buffers[index]);
  }

  writeFileSync(join(output, `${key}-diff.png`), PNG.sync.write(diff));
  // An independent reference comparison, never a baseline that can be blessed from the port.
  assert.equal(
    pixels,
    0,
    `${key}: ${pixels} pixels differ; inspect .cache/browser-parity/results/${key}-diff.png`,
  );
}

async function scenario(pages, name, prefix, direction) {
  async function step(state, action, observe = async () => ({})) {
    const observed = await Promise.all(
      pages.map(async (page) => {
        if (action) {
          await action(page);
        }

        await page.evaluate(() => document.fonts.ready);

        await page.evaluate(
          () =>
            new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))),
        );
        return observe(page);
      }),
    );
    await capture(pages, `${prefix}-${name}-${state}`, observed);
  }

  await step("initial");

  if (name === "button") {
    await step(
      "clicked",
      async (page) => page.getByRole("button", { name: "Action", exact: true }).click(),
      async (page) => {
        assert.equal(await page.locator("output").textContent(), "clicked");

        assert.equal(
          await page.getByRole("button", { name: "Disabled", exact: true }).isDisabled(),
          true,
        );
        return { clicked: true, disabled: true };
      },
    );
  }

  if (name === "input") {
    await step(
      "edited",
      async (page) => page.getByRole("textbox").fill("Hello"),
      async (page) => {
        assert.equal(await page.getByRole("textbox").inputValue(), "Hello");
        return { value: "Hello" };
      },
    );
  }

  if (name === "checkbox") {
    await step(
      "checked",
      async (page) => {
        await page.getByRole("checkbox").focus();

        await page.getByRole("checkbox").press("Space");
      },
      async (page) => {
        assert.equal(await page.getByRole("checkbox").getAttribute("aria-checked"), "true");
        return { checked: true };
      },
    );

    await step(
      "unchecked",
      async (page) => page.getByRole("checkbox").press("Space"),
      async (page) => {
        assert.equal(await page.getByRole("checkbox").getAttribute("aria-checked"), "false");
        return { checked: false };
      },
    );
  }

  if (name === "tabs") {
    await step(
      "keyboard",
      async (page) => {
        await page.getByRole("tab", { name: "First", exact: true }).focus();

        await page.keyboard.press(direction === "rtl" ? "ArrowLeft" : "ArrowRight");

        await page.keyboard.press("Enter");

        await page
          .getByRole("tabpanel", { name: "First", exact: true })
          .waitFor({ state: "hidden" });
      },
      async (page) => {
        assert.equal(
          await page
            .getByRole("tab", { name: "Second", exact: true })
            .getAttribute("aria-selected"),
          "true",
        );

        assert.equal(
          await page.getByRole("tabpanel", { name: "Second", exact: true }).textContent(),
          "Second panel",
        );
        return { selected: "Second", panel: "Second panel" };
      },
    );
  }

  if (name === "accordion") {
    await step(
      "expanded",
      async (page) => page.getByRole("button", { name: "Details", exact: true }).click(),
      async (page) => {
        assert.equal(await page.getByRole("button").getAttribute("aria-expanded"), "true");

        await page.getByText("Content of the details panel.").waitFor({ state: "visible" });
        return { expanded: true };
      },
    );

    await step(
      "collapsed",
      async (page) => page.getByRole("button").press("Enter"),
      async (page) => {
        assert.equal(await page.getByRole("button").getAttribute("aria-expanded"), "false");
        return { expanded: false };
      },
    );
  }

  if (name === "dialog") {
    await step(
      "open",
      async (page) => page.getByRole("button", { name: "Open dialog", exact: true }).click(),
      async (page) => {
        const dialog = page.getByRole("dialog", { name: "Account", exact: true });
        await dialog.waitFor({ state: "visible" });

        assert.equal(await dialog.evaluate((node) => node.contains(document.activeElement)), true);
        return { dialog: "Account", focusedInside: true };
      },
    );

    await step(
      "closed",
      async (page) => {
        await page.keyboard.press("Escape");

        await page.getByRole("dialog").waitFor({ state: "hidden" });
      },
      async (page) => {
        assert.equal(
          await page
            .getByRole("button", { name: "Open dialog", exact: true })
            .evaluate((node) => node === document.activeElement),
          true,
        );
        return { restoredFocus: true };
      },
    );
  }

  if (name === "select") {
    await step(
      "open",
      async (page) => page.getByRole("combobox").click(),
      async (page) => {
        await page
          .getByRole("option", { name: "Apple", exact: true })
          .waitFor({ state: "visible" });

        assert.equal(await page.getByRole("combobox").getAttribute("aria-expanded"), "true");
        return { expanded: true, options: await page.getByRole("option").allTextContents() };
      },
    );

    await step(
      "selected",
      async (page) => page.getByRole("option", { name: "Banana", exact: true }).click(),
      async (page) => {
        assert.equal(await page.getByRole("combobox").getAttribute("aria-expanded"), "false");

        assert.ok((await page.getByRole("combobox").textContent()).includes("Banana"));
        return { selected: "Banana" };
      },
    );
  }

  if (name === "switch" || name === "toggle") {
    const role = name === "switch" ? "switch" : "button";
    const label = name === "switch" ? "Notifications" : "Bold";
    const attribute = name === "switch" ? "aria-checked" : "aria-pressed";

    for (const [state, expected] of [
      ["on", "true"],
      ["off", "false"],
    ]) {
      await step(
        state,
        async (page) => {
          await page.getByRole(role, { name: label, exact: true }).focus();

          await page.keyboard.press("Space");
        },
        async (page) => {
          assert.equal(
            await page.getByRole(role, { name: label, exact: true }).getAttribute(attribute),
            expected,
          );

          assert.equal(
            await page
              .getByRole(role, {
                name: name === "switch" ? "Unavailable switch" : "Unavailable toggle",
                exact: true,
              })
              .isDisabled(),
            true,
          );
          return { active: expected === "true", disabled: true };
        },
      );
    }
  }

  if (name === "radio-group") {
    await step(
      "keyboard",
      async (page) => {
        await page.getByRole("radio", { name: "Email", exact: true }).focus();

        await page.keyboard.press("ArrowDown");
      },
      async (page) => {
        assert.equal(
          await page
            .getByRole("radio", { name: "Phone", exact: true })
            .getAttribute("aria-checked"),
          "true",
        );

        assert.equal(
          await page.getByRole("radio", { name: "Unavailable radio", exact: true }).isDisabled(),
          true,
        );

        assert.equal(
          await page
            .getByRole("radio", { name: "Phone", exact: true })
            .evaluate((node) => node === document.activeElement),
          true,
        );
        return { selected: "Phone", skippedDisabled: true };
      },
    );
  }

  if (name === "toggle-group") {
    await step(
      "keyboard",
      async (page) => {
        await page.getByRole("button", { name: "Left", exact: true }).focus();

        await page.keyboard.press(direction === "rtl" ? "ArrowLeft" : "ArrowRight");

        await page.keyboard.press("Space");
      },
      async (page) => {
        assert.equal(
          await page
            .getByRole("button", { name: "Right", exact: true })
            .getAttribute("aria-pressed"),
          "true",
        );

        assert.equal(
          await page
            .getByRole("button", { name: "Left", exact: true })
            .getAttribute("aria-pressed"),
          "false",
        );
        return { selected: "Right", skippedDisabled: true };
      },
    );
  }

  if (name === "popover") {
    await step(
      "open",
      async (page) => page.getByRole("button", { name: "Open settings", exact: true }).click(),
      async (page) => {
        const popup = page.getByRole("dialog", { name: "Settings", exact: true });
        await popup.waitFor();

        assert.equal(
          await page
            .getByRole("textbox", { name: "Popover name", exact: true })
            .evaluate((node) => node === document.activeElement),
          true,
        );
        return { focusedInput: true };
      },
    );

    await step(
      "closed",
      async (page) => {
        await page.keyboard.press("Escape");

        await page.getByRole("dialog").waitFor({ state: "hidden" });
      },
      async (page) => {
        assert.equal(
          await page
            .getByRole("button", { name: "Open settings", exact: true })
            .evaluate((node) => node === document.activeElement),
          true,
        );
        return { restoredFocus: true };
      },
    );
  }

  if (name === "alert-dialog") {
    await step(
      "open",
      async (page) => page.getByRole("button", { name: "Delete record", exact: true }).click(),
      async (page) => {
        const popup = page.getByRole("alertdialog", { name: "Confirm removal", exact: true });
        await popup.waitFor();

        assert.equal(await popup.evaluate((node) => node.contains(document.activeElement)), true);
        return { focusedInside: true };
      },
    );

    await step(
      "outside-press",
      async (page) => page.mouse.click(4, 4),
      async (page) => {
        assert.equal(await page.getByRole("alertdialog").isVisible(), true);
        return { retained: true };
      },
    );

    await step(
      "confirmed",
      async (page) => page.getByRole("button", { name: "Confirm removal", exact: true }).click(),
      async (page) => {
        assert.equal(await page.locator("output").textContent(), "confirmed");

        assert.equal(await page.getByRole("alertdialog").isVisible(), true);
        return { action: "confirmed", retained: true };
      },
    );

    await step(
      "canceled",
      async (page) => {
        await page.getByRole("button", { name: "Cancel removal", exact: true }).click();

        await page.getByRole("alertdialog").waitFor({ state: "hidden" });
      },
      async (page) => {
        assert.equal(
          await page
            .getByRole("button", { name: "Delete record", exact: true })
            .evaluate((node) => node === document.activeElement),
          true,
        );
        return { restoredFocus: true };
      },
    );
  }

  if (name === "field") {
    await step(
      "native-error",
      async (page) => {
        await page.getByRole("textbox").fill("A");

        await page.getByRole("textbox").press("Tab");
      },
      async (page) => {
        assert.equal(await page.getByRole("textbox").getAttribute("aria-invalid"), "true");
        return { invalid: true };
      },
    );

    await step(
      "custom-error",
      async (page) => {
        await page.getByRole("textbox").fill("admin");

        await page.getByRole("textbox").press("Tab");
      },
      async (page) => {
        await page.getByText("Reserved username", { exact: true }).waitFor();
        return { error: "Reserved username" };
      },
    );

    await step(
      "valid",
      async (page) => {
        await page.getByRole("textbox").fill("member");

        await page.getByRole("button", { name: "Save", exact: true }).click();
      },
      async (page) => {
        assert.equal(await page.locator("output").textContent(), "member");
        return { submitted: "member" };
      },
    );

    await step(
      "reset",
      async (page) => {
        await page.getByRole("button", { name: "Reset", exact: true }).click();

        await page.waitForFunction(() => document.querySelector("input")?.value === "");
      },
      async (page) => {
        assert.equal(await page.getByRole("textbox").inputValue(), "");
        return { value: "" };
      },
    );
  }
}

try {
  const urls = await Promise.all([start("local"), start("upstream")]);
  browser = await chromium.launch({ headless: true });
  report.browser = browser.version();
  const only = process.env.BROWSER_PARITY_CASE;
  assert.ok(
    !only || only.split(",").every((name) => cases.includes(name)),
    "Unknown BROWSER_PARITY_CASE",
  );
  const directions = process.env.BROWSER_PARITY_DIRECTION
    ? [process.env.BROWSER_PARITY_DIRECTION]
    : ["ltr", "rtl"];
  assert.ok(
    directions.every((direction) => direction === "ltr" || direction === "rtl"),
    "Unknown BROWSER_PARITY_DIRECTION",
  );
  report.directions = directions;
  report.cases = cases.filter((name) => !only || only.split(",").includes(name));

  for (const viewport of [
    { width: 1440, height: 900 },
    { width: 390, height: 844 },
  ]) {
    for (const theme of ["light", "dark"]) {
      for (const direction of directions) {
        for (const name of report.cases) {
          const pages = await Promise.all(
            urls.map(async (url) => {
              const page = await browser.newPage({ viewport, reducedMotion: "reduce" });
              page.setDefaultTimeout(5000);

              page.on("pageerror", (error) =>
                report.failures.push({ name, theme, direction, viewport, error: error.message }),
              );

              await page.goto(`${url}?case=${name}&direction=${direction}`, {
                waitUntil: "networkidle",
              });

              await page.locator(`[data-fixture="${name}"]`).waitFor();

              await page.evaluate(
                ({ dark, direction }) => {
                  document.documentElement.classList.toggle("dark", dark);
                  document.documentElement.dir = direction;
                },
                { dark: theme === "dark", direction },
              );

              if (url === urls[0] && process.env.BROWSER_PARITY_MUTATION === "visual") {
                await page.addStyleTag({
                  content: '[data-slot="button"] { border-radius: 0 !important; }',
                });
              }

              if (url === urls[0] && process.env.BROWSER_PARITY_MUTATION === "behavior") {
                await page
                  .getByRole("button", { name: "Action", exact: true })
                  .evaluate((node) =>
                    node.addEventListener(
                      "click",
                      (event) => event.stopImmediatePropagation(),
                      true,
                    ),
                  );
              }

              return page;
            }),
          );
          const prefix = `${viewport.width}-${theme}-${direction}`;

          try {
            await scenario(pages, name, prefix, direction);

            console.log(`✓ ${prefix} ${name}`);
          } catch (error) {
            report.failures.push({ name, theme, direction, viewport, error: error.message });

            console.error(`✗ ${prefix} ${name}: ${error.message}`);

            await Promise.all(
              pages.map((page, index) =>
                page.screenshot({
                  path: join(
                    output,
                    `${prefix}-${name}-failure-${index === 0 ? "local" : "upstream"}.png`,
                  ),
                  animations: "disabled",
                  caret: "hide",
                }),
              ),
            );
          } finally {
            await Promise.all(pages.map((page) => page.close()));
          }
        }
      }
    }
  }
} catch (error) {
  report.failures.push({ phase: "runner", error: error.message });

  console.error(error);
} finally {
  await browser?.close();

  await Promise.all(servers.map((server) => server.close()));

  writeFileSync(join(output, "report.json"), JSON.stringify(report, null, 2));
}

console.log(
  `${report.results.length} state comparisons; ${report.failures.length} failures. Report: .cache/browser-parity/results/report.json`,
);

if (report.failures.length) {
  process.exitCode = 1;
}
