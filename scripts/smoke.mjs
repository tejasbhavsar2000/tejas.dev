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

  // Headless Chromium defaults to SwiftShader, which rasterises in software.
  // A PBR material with a PMREM environment compiles and draws roughly ten
  // times slower there than on any real GPU, so measuring performance on it
  // would tell us nothing about actual visitors. Ask for the hardware backend.
  const browser = await chromium.launch({
    args: ["--use-angle=metal", "--enable-gpu", "--ignore-gpu-blocklist"],
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  const consoleErrors = [];
  const pageErrors = [];
  const scripts = [];
  page.on("request", (r) => {
    if (r.resourceType() === "script") scripts.push(r.url());
  });
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

  // --- the background must not cost anything up front ---------------------
  // Measured on its own page, because `networkidle` above waits until after the
  // deferred chunk has already arrived, which would make this assert nothing.
  {
    const fresh = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    const freshScripts = [];
    fresh.on("request", (r) => {
      if (r.resourceType() === "script") freshScripts.push(r.url());
    });
    await fresh.goto(BASE, { waitUntil: "domcontentloaded" });

    const atPaint = await fresh.evaluate(
      () => document.querySelectorAll("canvas").length,
    );
    const scriptsAtPaint = freshScripts.length;
    if (atPaint === 0) ok("background is not mounted on first paint");
    else bad("background mounted before first paint completed");

    // It should then arrive on idle, with no scrolling needed.
    await fresh.waitForTimeout(3000);
    const bg = await fresh.evaluate(() => {
      const c = document.querySelector("canvas");
      if (!c) return null;
      const r = c.getBoundingClientRect();
      const gl = c.getContext("webgl2") || c.getContext("webgl");
      return {
        w: Math.round(r.width),
        h: Math.round(r.height),
        gl: !!gl,
        events: getComputedStyle(c.parentElement).pointerEvents,
      };
    });
    if (!bg) bad("background never mounted");
    else if (bg.w < 100 || bg.h < 100) bad(`background has no size (${bg.w}x${bg.h})`);
    else if (!bg.gl) bad("background has no WebGL context");
    else if (bg.events !== "none") bad("background is not pointer-events none");
    else ok(`background mounted and rendering (${bg.w}x${bg.h})`);

    if (freshScripts.length > scriptsAtPaint) {
      ok(
        `three loaded after first paint (${freshScripts.length - scriptsAtPaint} extra script requests)`,
      );
    } else {
      bad("no script fetched after first paint, so three was in the initial bundle");
    }
    await fresh.close();
  }

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

  // --- the cursor preview must track the pointer, before and after a scroll --
  // It previously drifted by the scroll distance, because a `backdrop-filter`
  // ancestor makes `position: fixed` resolve against that ancestor rather than
  // the viewport. Hovering alone never caught it; scrolling does.
  {
    const row = page.locator("#work li").first();
    await row.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);

    const readPreview = async (atX, atY) => {
      await row.hover();
      await page.mouse.move(atX, atY);
      await page.waitForTimeout(700); // let the spring settle
      return page.evaluate(() => {
        const v = document.querySelector("video[src*='projects']:not([controls])");
        const panel = v?.closest("div");
        if (!panel) return null;
        const r = panel.getBoundingClientRect();
        return { x: Math.round(r.left), y: Math.round(r.top) };
      });
    };

    const box = await row.boundingBox();
    if (!box) {
      bad("could not locate a project row for the preview check");
    } else {
      const at = { x: Math.round(box.x + 200), y: Math.round(box.y + 20) };
      const before = await readPreview(at.x, at.y);

      await page.mouse.wheel(0, 260);
      await page.waitForTimeout(400);
      const after = await readPreview(at.x, at.y);

      if (!before || !after) {
        bad("cursor preview never appeared");
      } else {
        // Same pointer position, so the preview must land in the same place.
        const drift = Math.max(
          Math.abs(after.x - before.x),
          Math.abs(after.y - before.y),
        );
        if (drift <= 6) {
          ok(`cursor preview tracks the pointer across a scroll (drift ${drift}px)`);
        } else {
          bad(`cursor preview drifted ${drift}px after scrolling`);
        }
      }
    }
    await page.mouse.move(10, 10);
    await page.waitForTimeout(200);
  }

  // --- drag to reorder a project row ---------------------------------------
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(200);

  const readOrder = () =>
    page.$$eval('#work button[aria-label^="Move"]', (els) =>
      els.map((e) => e.getAttribute("aria-label")),
    );
  const namesBefore = await readOrder();
  const grips = page.locator('#work button[aria-label^="Move"]');
  const gripCount = await grips.count();

  if (gripCount === 0) {
    bad("no drag grips found in projects");
  } else {
    ok(`${gripCount} drag grips present in projects`);
    const grip = grips.first();
    // Must be on screen: boundingBox is page relative but mouse coordinates are
    // viewport relative, so dragging an off screen element presses whatever the
    // clamped position happens to land on.
    await grip.scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);
    const box = await grip.boundingBox();
    if (box) {
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.down();
      // Move well past the next row so the reorder definitely commits.
      for (let i = 1; i <= 12; i++) {
        await page.mouse.move(
          box.x + box.width / 2,
          box.y + box.height / 2 + i * 22,
        );
        await page.waitForTimeout(16);
      }
      await page.mouse.up();
      await page.waitForTimeout(500);

      const namesAfter = await readOrder();
      if (namesBefore.join("|") !== namesAfter.join("|")) {
        ok("dragging a grip reordered the project list");
      } else {
        bad("drag did not change project order");
      }
    }
  }

  // Close anything a stray press may have opened before testing scroll.
  await page.keyboard.press("Escape");
  await page.waitForTimeout(200);

  // The page must still scroll after a drag: touch-action belongs on the grip
  // alone, never the row.
  const beforeScroll = await page.evaluate(() => window.scrollY);
  await page.mouse.wheel(0, 500);
  await page.waitForTimeout(200);
  const afterScroll = await page.evaluate(() => window.scrollY);
  if (afterScroll > beforeScroll) ok("page still scrolls after a drag");
  else bad("drag captured the scroll");

  // --- hero free movement ---------------------------------------------------
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);

  const heroGrip = page
    .locator('[data-free-item] button[aria-label^="Move"]')
    .first();
  if ((await heroGrip.count()) === 0) {
    bad("no hero drag grip found");
  } else {
    await heroGrip.scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);
    const box = await heroGrip.boundingBox();
    if (box) {
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.down();
      // Shove hard toward the right edge to exercise clamping.
      for (let i = 1; i <= 20; i++) {
        await page.mouse.move(
          box.x + box.width / 2 + i * 90,
          box.y + box.height / 2 + i * 12,
        );
        await page.waitForTimeout(16);
      }
      await page.mouse.up();
      await page.waitForTimeout(300);

      const moved = await page.evaluate(() => {
        const el = document.querySelector("[data-free-item]");
        if (!el) return null;
        const t = getComputedStyle(el).transform;
        const area = el.closest("[data-free-item]")?.parentElement;
        const r = el.getBoundingClientRect();
        const a = area?.getBoundingClientRect();
        return {
          transform: t,
          inside: a ? r.right <= a.right + 1 && r.left >= a.left - 1 : true,
        };
      });
      if (!moved) {
        bad("hero block not found after drag");
      } else if (moved.transform === "none" || moved.transform === "matrix(1, 0, 0, 1, 0, 0)") {
        bad("hero block did not move");
      } else if (!moved.inside) {
        bad("hero block escaped its bounds despite clamping");
      } else {
        ok("hero block moves freely and stays clamped inside the hero");
      }
    }
  }

  const heroOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth + 1,
  );
  if (heroOverflow) bad("dragging the hero caused horizontal overflow");
  else ok("no horizontal overflow after dragging the hero");

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
    // Eight rapid clicks reliably force skipped transitions. Two did not, which
    // is why this check passed while the AbortError was still happening.
    for (let i = 0; i < 8; i++) {
      await toggle.click();
      await page.waitForTimeout(80);
    }
    await page.waitForTimeout(1200);

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

    if (width === 375) {
      const gripsHere = await page.evaluate(
        () => document.querySelectorAll('button[aria-label^="Move"]').length,
      );
      if (gripsHere === 0) ok("no drag grips at 375px");
      else bad(`${gripsHere} drag grips rendered at 375px`);

      // A full page canvas must never swallow the page scroll.
      const before = await page.evaluate(() => window.scrollY);
      await page.mouse.move(187, 400);
      await page.mouse.wheel(0, 400);
      await page.waitForTimeout(250);
      const after = await page.evaluate(() => window.scrollY);
      if (after > before) ok("page scrolls with the pointer over the background");
      else bad("the background captured the page scroll at 375px");
    }
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
