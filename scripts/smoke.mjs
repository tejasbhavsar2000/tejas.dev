/**
 * Browser smoke test.
 *
 * This exists because the page shipped frozen twice. The check that matters is
 * the long task assertion while scrolling: a main thread blocked by layout
 * thrashing shows up here immediately, where reading the diff did not.
 *
 *   node scripts/smoke.mjs            against http://localhost:3000
 *   BASE_URL=... node scripts/smoke.mjs
 */

import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const LONG_TASK_BUDGET_MS = 200;
const SHOTS = ".smoke";

let failures = 0;
const ok = (msg) => console.log(`  pass  ${msg}`);
const bad = (msg) => {
  failures += 1;
  console.error(`  FAIL  ${msg}`);
};

async function main() {
  await mkdir(SHOTS, { recursive: true });

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  const consoleErrors = [];
  const pageErrors = [];
  page.on("console", (m) => {
    if (m.type() === "error") consoleErrors.push(m.text());
  });
  page.on("pageerror", (e) => pageErrors.push(e.message));

  console.log(`\nSmoke test against ${BASE}\n`);

  // --- load ----------------------------------------------------------------
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.waitForTimeout(400);

  // Start recording long tasks before we touch anything.
  await page.evaluate(() => {
    window.__longTasks = [];
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        window.__longTasks.push(entry.duration);
      }
    }).observe({ entryTypes: ["longtask"] });
  });

  // --- scroll the whole page ----------------------------------------------
  const height = await page.evaluate(() => document.body.scrollHeight);
  const step = 400;
  for (let y = 0; y < height; y += step) {
    await page.mouse.wheel(0, step);
    await page.waitForTimeout(60);
  }
  await page.waitForTimeout(300);

  const scrollY = await page.evaluate(() => window.scrollY);
  if (scrollY > 200) ok(`page scrolled (scrollY ${Math.round(scrollY)})`);
  else bad(`page did not scroll (scrollY ${Math.round(scrollY)})`);

  // --- pointer over the hero and a project row -----------------------------
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(200);
  for (let i = 0; i < 24; i++) {
    await page.mouse.move(300 + i * 20, 300);
  }
  const row = page.locator("#work li").first();
  if (await row.count()) {
    await row.hover();
    await page.waitForTimeout(300);
    ok("hovered a project row");
  }

  // --- the assertion that would have caught the freeze ---------------------
  const longTasks = await page.evaluate(() => window.__longTasks ?? []);
  const worst = longTasks.length ? Math.max(...longTasks) : 0;
  if (worst <= LONG_TASK_BUDGET_MS) {
    ok(
      `no long task over ${LONG_TASK_BUDGET_MS}ms (worst ${Math.round(worst)}ms, ${longTasks.length} total)`,
    );
  } else {
    bad(
      `main thread blocked: worst long task ${Math.round(worst)}ms exceeds ${LONG_TASK_BUDGET_MS}ms`,
    );
  }

  // --- page must still respond --------------------------------------------
  const responsive = await Promise.race([
    page.evaluate(() => "alive"),
    new Promise((r) => setTimeout(() => r("timeout"), 3000)),
  ]);
  if (responsive === "alive") ok("page still responds after interaction");
  else bad("page stopped responding");

  // --- progress bar --------------------------------------------------------
  // It shipped invisible once: Tailwind v4 emits `scale-x-0` as the `scale`
  // property, which silently overrode the transform the scroll loop writes.
  await page.evaluate(() =>
    window.scrollTo(0, document.body.scrollHeight),
  );
  await page.waitForTimeout(400);
  const bar = await page.evaluate(() => {
    const el = document.querySelector("header > div[aria-hidden]");
    if (!el) return null;
    const cs = getComputedStyle(el);
    return { transform: cs.transform, scale: cs.scale, width: el.clientWidth };
  });
  if (!bar) {
    bad("progress bar element not found");
  } else {
    // matrix(1, 0, 0, 1, 0, 0) is identity; matrix(0, ...) is collapsed.
    const scaleX = Number(bar.transform.match(/matrix\(([-\d.]+)/)?.[1] ?? 0);
    const scaleProp = bar.scale && bar.scale !== "none" ? bar.scale : null;
    if (scaleProp) {
      bad(`progress bar has a competing \`scale\` property: ${scaleProp}`);
    } else if (scaleX > 0.9) {
      ok(`progress bar fills at the bottom (scaleX ${scaleX.toFixed(2)})`);
    } else {
      bad(`progress bar did not fill (scaleX ${scaleX.toFixed(2)})`);
    }
  }

  // --- theme toggle --------------------------------------------------------
  // A skipped view transition rejects `finished`; leaving that unhandled threw
  // "AbortError: Transition was skipped" at the user.
  await page.evaluate(() => {
    window.__rejections = [];
    window.addEventListener("unhandledrejection", (e) =>
      window.__rejections.push(String(e.reason)),
    );
  });
  const errorsBefore = pageErrors.length;
  const toggle = page.locator('button[aria-label*="mode"]').first();
  if (await toggle.count()) {
    await toggle.click();
    await page.waitForTimeout(150);
    await toggle.click(); // second click mid transition forces a skip
    await page.waitForTimeout(900);

    const rejections = await page.evaluate(() => window.__rejections ?? []);
    const newErrors = pageErrors.slice(errorsBefore);
    if (!rejections.length && !newErrors.length) {
      ok("theme toggle survives a skipped transition with no errors");
    } else {
      bad(
        `theme toggle threw: ${[...rejections, ...newErrors].join(" | ")}`,
      );
    }
  } else {
    bad("theme toggle button not found");
  }

  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(200);

  // --- invalid nesting -----------------------------------------------------
  const badNesting = await page.evaluate(() =>
    [...document.querySelectorAll("ul, ol")].filter((list) =>
      [...list.children].some((c) => c.tagName !== "LI"),
    ).length,
  );
  if (badNesting === 0) ok("every ul and ol contains only li children");
  else bad(`${badNesting} list(s) contain non-li children`);

  // --- errors --------------------------------------------------------------
  if (!pageErrors.length) ok("no uncaught page errors");
  else bad(`page errors: ${pageErrors.join(" | ")}`);

  const realConsoleErrors = consoleErrors.filter(
    (t) => !t.includes("favicon") && !t.toLowerCase().includes("x-frame"),
  );
  if (!realConsoleErrors.length) ok("no console errors");
  else bad(`console errors: ${realConsoleErrors.join(" | ")}`);

  // --- screenshots ---------------------------------------------------------
  for (const [label, width] of [
    ["mobile", 375],
    ["tablet", 768],
    ["desktop", 1440],
  ]) {
    await page.setViewportSize({ width, height: 900 });
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${SHOTS}/${label}.png`, fullPage: true });

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    );
    if (overflow) bad(`horizontal overflow at ${width}px`);
    else ok(`no horizontal overflow at ${width}px`);
  }

  await browser.close();

  console.log(
    failures === 0
      ? `\nAll checks passed. Screenshots in ${SHOTS}/\n`
      : `\n${failures} check(s) failed.\n`,
  );
  process.exit(failures === 0 ? 0 : 1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
