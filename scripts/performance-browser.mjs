// Playwright is an optional external profiling tool, not a registry or app dependency.
const { chromium } = await import(process.env.PERFORMANCE_PLAYWRIGHT_MODULE ?? "playwright");
import { writeFileSync } from "node:fs";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
page.setDefaultTimeout(4000);
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
const cdp = await page.context().newCDPSession(page);
await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
await cdp.send("Performance.enable");
await page.addInitScript(() => {
  window.sample = { long: [], frames: [], styles: 0, rects: 0, observers: 0, observerMs: 0 };
  const style = window.getComputedStyle;
  window.getComputedStyle = (...a) => {
    window.sample.styles++;
    return style(...a);
  };
  const rect = Element.prototype.getBoundingClientRect;
  Element.prototype.getBoundingClientRect = function () {
    window.sample.rects++;
    return rect.call(this);
  };
  const MO = window.MutationObserver;
  window.MutationObserver = class extends MO {
    constructor(fn) {
      super((...a) => {
        const t = performance.now();
        fn(...a);
        window.sample.observers++;
        window.sample.observerMs += performance.now() - t;
      });
    }
  };
  new PerformanceObserver((list) => window.sample.long.push(...list.getEntries().map((e) => e.duration))).observe({
    type: "longtask",
  });
  let last = performance.now();
  function frame(t) {
    window.sample.frames.push(t - last);
    last = t;
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
  window.resetSample = () =>
    (window.sample = { long: [], frames: [], styles: 0, rects: 0, observers: 0, observerMs: 0 });
  window.readSample = () => ({
    longCount: window.sample.long.length,
    maxTaskMs: Math.max(0, ...window.sample.long),
    totalLongMs: window.sample.long.reduce((a, b) => a + b, 0),
    maxFrameMs: Math.round(Math.max(0, ...window.sample.frames)),
    styles: window.sample.styles,
    rects: window.sample.rects,
    observers: window.sample.observers,
    observerMs: Math.round(window.sample.observerMs),
  });
});
const base = process.env.PERFORMANCE_URL ?? "http://localhost:4173";
const start = Date.now();
await page.goto(base + "/components");
await page.locator("[data-containment-ready]").waitFor({ state: "attached" });
await page.waitForTimeout(1600);
const load = {
  elapsedMs: Date.now() - start,
  ...(await page.evaluate(() => window.readSample())),
  nodes: await page.locator("*").count(),
};
const metrics = async () =>
  Object.fromEntries((await cdp.send("Performance.getMetrics")).metrics.map((m) => [m.name, m.value]));
const idleBefore = await metrics();
await page.evaluate(() => window.resetSample());
await page.waitForTimeout(2000);
const idleAfter = await metrics();
const idle = {
  taskMs: Math.round((idleAfter.TaskDuration - idleBefore.TaskDuration) * 1000),
  ...(await page.evaluate(() => window.readSample())),
};
const slugs = await page.locator("section[id]").evaluateAll((es) => es.map((e) => e.id));
const rows = [];
const popup = new Set(["alert-dialog", "dialog", "drawer", "dropdown-menu", "menubar", "popover", "select", "sheet"]);
for (const slug of slugs) {
  const section = page.locator("#" + slug);
  await page.mouse.move(1400, 850);
  await page.evaluate(() => window.resetSample());
  await section.scrollIntoViewIfNeeded();
  await page.waitForTimeout(250);
  const reveal = await page.evaluate(() => window.readSample());
  await page.evaluate(() => window.resetSample());
  let action = "presentation";
  let error = null;
  try {
    const button = section.locator("button:enabled:visible").first();
    if (popup.has(slug)) {
      action = "open + Escape";
      await button.click();
      await page.waitForTimeout(220);
      await page.keyboard.press("Escape");
    } else if (
      [
        "accordion",
        "collapsible",
        "toggle",
        "toggle-group",
        "sidebar",
        "calendar",
        "carousel",
        "button",
        "button-group",
      ].includes(slug)
    ) {
      action = "activate";
      await button.click();
    } else if (["input", "input-group", "field", "combobox", "command", "input-otp"].includes(slug)) {
      action = "type";
      await section
        .locator(
          "input:enabled:visible:not([readonly]):not([type=hidden]):not([type=checkbox]):not([type=radio]):not([type=range])",
        )
        .first()
        .fill(slug === "input-otp" ? "123456" : "a");
      await page.keyboard.press("Escape");
    } else if (["checkbox", "switch"].includes(slug)) {
      action = "activate";
      await section.getByRole(slug).filter({ visible: true }).first().click();
    } else if (slug === "textarea") {
      action = "type";
      await section.locator("textarea:enabled:visible:not([readonly])").first().fill("performance");
    } else if (slug === "radio-group") {
      action = "keyboard";
      await section.locator("[role=radio]:visible").first().press("ArrowRight");
    } else if (slug === "tabs") {
      action = "switch panel";
      await section.locator("[role=tab]:enabled").nth(1).click();
    } else if (slug === "slider") {
      action = "keyboard";
      await section.getByRole("slider").first().press("ArrowRight");
    } else if (slug === "resizable") {
      action = "keyboard";
      await section.locator("[role=separator]:visible").first().press("ArrowRight");
    } else if (slug === "scroll-area") {
      action = "scroll";
      await section
        .locator("[data-slot=scroll-area-viewport]")
        .first()
        .evaluate((e) => (e.scrollTop += 200));
    } else if (slug === "native-select") {
      action = "select";
      await section.locator("select:enabled").first().selectOption({ index: 1 });
    } else if (slug === "context-menu") {
      action = "contextmenu";
      await section.locator("[data-slot=context-menu-trigger]").first().click({ button: "right" });
      await page.waitForTimeout(220);
      await page.keyboard.press("Escape");
    } else if (["hover-card", "tooltip", "navigation-menu"].includes(slug)) {
      action = "hover";
      const target = slug === "navigation-menu" ? button : section.locator(`[data-slot=${slug}-trigger]`).first();
      await target.hover();
      await page.waitForTimeout(650);
      await page.keyboard.press("Escape");
      await page.mouse.move(1400, 850);
    } else if (slug === "chart") {
      action = "hover chart";
      await section.locator("svg.recharts-surface").first().hover();
    } else if (["toast", "sonner"].includes(slug)) {
      action = "notify";
      await button.click();
      await page.waitForTimeout(250);
      await page
        .locator("[data-slot=toast-close]:visible,[data-sonner-toast] [data-close-button]:visible")
        .evaluateAll((es) => es.forEach((e) => e.click()));
    }
    await page.waitForTimeout(300);
  } catch (e) {
    error = e.message.split("\n")[0];
  }
  const interaction = await page.evaluate(() => window.readSample());
  const row = { slug, action, error, domNodes: await section.locator("*").count(), reveal, interaction };
  rows.push(row);
  console.log(slug, action, error ?? "", interaction.maxTaskMs + "ms", interaction.styles + " styles");
}
await page.mouse.move(1400, 850);
await page.keyboard.press("Escape");
await page.waitForTimeout(1200);
const result = {
  capturedAt: new Date().toISOString(),
  viewport: "1440x900",
  cpuThrottle: 4,
  load,
  idle,
  components: rows,
  errors,
};
writeFileSync(
  process.env.PERFORMANCE_OUTPUT ?? "/tmp/shadcn-preact-performance-browser.json",
  JSON.stringify(result, null, 2),
);
console.log("summary", JSON.stringify({ load, idle, errors, failed: rows.filter((r) => r.error) }));
await browser.close();
if (errors.length || rows.some((row) => row.error)) process.exitCode = 1;