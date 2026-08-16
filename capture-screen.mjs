import { chromium } from "playwright";

// Captures the site's own hero to use as the laptop screen inside the intro.
// Re-run this whenever the hero changes: npm run dev, then `node capture-screen.mjs`.
const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1600, height: 1000 },
  // The surest way past the intro is to not trigger it at all. Clicking "Skip"
  // races the sequence finishing on its own, and the button detaches mid-click.
  reducedMotion: "reduce",
});

await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
await page.waitForTimeout(1500);

if (await page.locator("canvas").count()) {
  // Belt and braces: if the intro did mount, let it finish rather than racing it.
  await page.waitForSelector("canvas", { state: "detached", timeout: 40000 }).catch(() => {});
  await page.waitForTimeout(1200);
}

await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(900);
await page.screenshot({ path: "public/intro/site-screen.png" });
await browser.close();
console.log("captured public/intro/site-screen.png");
