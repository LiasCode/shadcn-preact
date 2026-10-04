// Optional external browser tool; run against `bun run preview` after a production build.
import assert from "node:assert/strict";
const { chromium } = await import(process.env.PERFORMANCE_PLAYWRIGHT_MODULE ?? "playwright");
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  page.setDefaultTimeout(5000);
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.addInitScript(() => {
    window.scrollerMeasurements = 0;
    const rect = Element.prototype.getBoundingClientRect;
    Element.prototype.getBoundingClientRect = function () {
      if (this.closest('[data-slot="message-scroller"]')) window.scrollerMeasurements++;
      return rect.call(this);
    };
  });
  await page.goto(`${process.env.PERFORMANCE_URL ?? "http://localhost:4173"}/components`);
  await page.waitForTimeout(1000);
  assert.equal(await page.locator("section[id]").count(), 61);
  const names = ["attachment", "bubble", "marker", "message", "message-scroller", "questionnaire"];
  for (const width of [1440, 390, 320]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const name of names) {
      const section = page.locator(`#${name}`);
      await section.scrollIntoViewIfNeeded();
      const selector = section.locator("select").first();
      const options = await selector
        .locator("option")
        .evaluateAll((elements) => elements.map((element) => element.value));
      for (const value of options) {
        await selector.selectOption(value);
        await page.waitForTimeout(80);
        assert.ok((await section.locator("[data-slot]").count()) > 0);
        assert.equal(
          await page.evaluate(() => document.documentElement.scrollWidth - innerWidth),
          0,
          `${name} example ${value} at ${width}px`,
        );
      }
      await selector.selectOption({ label: "Demo" });
      console.log(`${name}: ${options.length} examples at ${width}px`);
    }
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  const q = page.locator("#questionnaire");
  await q.scrollIntoViewIfNeeded();
  await q.locator('input[type="radio"]').filter({ visible: true }).first().check();
  await q.locator('[data-slot="questionnaire-next"]').click();
  assert.equal(await q.locator('[data-slot="questionnaire-progress"]').getAttribute("aria-valuenow"), "2");
  await q.locator('input[type="checkbox"]').filter({ visible: true }).first().check();
  await q.locator('[data-slot="questionnaire-next"]').click();
  await q.locator('input[type="radio"]').filter({ visible: true }).first().check();
  await q.locator('[data-slot="questionnaire-submit"]').click();
  await page.getByText("Agent plan saved", { exact: true }).waitFor();
  await q.locator("select").first().selectOption({ label: "Freeform" });
  await q.getByLabel("Another refactoring approach").fill("Preserve the public API");
  assert.equal(await q.locator('[data-slot="questionnaire-item"]').getAttribute("data-status"), "answered");
  await q.locator('[data-slot="questionnaire-submit"]').click();
  await page.getByText("Approach selected", { exact: true }).waitFor();
  await q.locator("select").first().selectOption({ label: "Dialog" });
  await q.getByRole("button", { name: "Open clarification" }).click();
  await page.getByRole("dialog").waitFor();
  assert.ok(await page.locator("header").first().isVisible());
  assert.ok(await page.locator('nav[aria-label="Components"]').isVisible());
  assert.ok((await page.locator("header").first().boundingBox()).y >= 0);
  await page.keyboard.press("Escape");
  await page.getByRole("dialog").waitFor({ state: "hidden" });
  const scroller = page.locator("#message-scroller");
  await scroller.scrollIntoViewIfNeeded();
  await scroller.getByRole("button", { name: "Send", exact: true }).click();
  await page.waitForTimeout(1600);
  assert.ok((await scroller.locator('[data-slot="message-scroller-item"]').count()) >= 2);
  assert.equal(
    await scroller.locator('[data-slot="message-scroller-viewport"]').getAttribute("data-pending-scroll"),
    null,
  );
  await scroller.locator("select").first().selectOption({ label: "Load History" });
  await page.waitForTimeout(300);
  const viewport = scroller.locator('[data-slot="message-scroller-viewport"]');
  const anchor = await viewport.evaluate((element) => {
    element.scrollTop = (element.scrollHeight - element.clientHeight) / 2;
    element.dispatchEvent(new Event("scroll"));
    const top = element.getBoundingClientRect().top;
    const row = [...element.querySelectorAll("[data-message-id]")].find(
      (row) => row.getBoundingClientRect().bottom > top + 1,
    );
    return { id: row.dataset.messageId, top: row.getBoundingClientRect().top - top };
  });
  await scroller.getByRole("button", { name: "Load History", exact: true }).click();
  await page.waitForTimeout(300);
  const after = await viewport.evaluate(
    (element, id) =>
      element.querySelector(`[data-message-id="${id}"]`).getBoundingClientRect().top -
      element.getBoundingClientRect().top,
    anchor.id,
  );
  assert.ok(Math.abs(after - anchor.top) < 1, `prepend moved the reading position ${after - anchor.top}px`);
  await scroller.locator("select").first().selectOption({ label: "State" });
  await page.waitForTimeout(800);
  await page.evaluate(() => {
    window.scrollerMeasurements = 0;
  });
  await page.waitForTimeout(500);
  const idle = await page.evaluate(() => window.scrollerMeasurements);
  assert.equal(idle, 0, "idle Message Scroller must not repeatedly measure rows");
  await page.evaluate(() => document.documentElement.classList.add("dark"));
  await page.waitForTimeout(300);
  await page.screenshot({ path: process.env.PHASE8_SCREENSHOT ?? "/tmp/shadcn-preact-phase8-dark.png" });
  assert.deepEqual(errors, []);
  console.log(
    "Form submission, freeform answers, dialog layout, streaming, prepend preservation, idle measurements and dark mode passed.",
  );
} finally {
  await browser.close();
}