import { chromium } from "playwright";

// Captures the site's own hero to use as the laptop screen inside the intro.
// Re-run this whenever the hero changes: npm run dev, then `node capture-screen.mjs`.
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
await page.waitForTimeout(1400);
const skip = page.getByRole("button", { name: /skip intro/i });
if (await skip.count()) {
  await skip.click();
  await page.waitForTimeout(1300);
}
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(900);
await page.screenshot({ path: "public/intro/site-screen.png" });
await browser.close();
console.log("captured public/intro/site-screen.png");
