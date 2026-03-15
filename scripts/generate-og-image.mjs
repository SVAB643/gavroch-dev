import puppeteer from "puppeteer";
import path from "path";
import { fileURLToPath } from "url";

const dir = path.dirname(fileURLToPath(import.meta.url));

const browser = await puppeteer.launch();
const page = await browser.newPage();
await page.setViewport({ width: 1200, height: 630 });
await page.goto(`file://${path.join(dir, "og-image.html")}`, { waitUntil: "networkidle0" });
await page.screenshot({ path: path.join(dir, "..", "public", "img", "og-image.png") });
await browser.close();
console.log("✓ OG image generated → public/img/og-image.png");
