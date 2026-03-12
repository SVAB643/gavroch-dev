import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";

const SCALE = 4;

async function capture(htmlFile, outputFile) {
  const html = fs.readFileSync(htmlFile, "utf-8");
  const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"] });
  const page = await browser.newPage();
  await page.setViewport({ width: 600, height: 400, deviceScaleFactor: SCALE });
  await page.setContent(html, { waitUntil: "networkidle0" });

  // Get the bounding box of the signature table
  const rect = await page.evaluate(() => {
    const table = document.querySelector("table");
    const r = table.getBoundingClientRect();
    return { x: r.x, y: r.y, width: r.width, height: r.height };
  });

  await page.screenshot({
    path: outputFile,
    type: "png",
    clip: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
    omitBackground: true,
  });

  await browser.close();
  const sizeKB = (fs.statSync(outputFile).size / 1024).toFixed(0);
  console.log(`  ${outputFile} (${sizeKB} KB)`);
}

async function main() {
  const dir = path.dirname(new URL(import.meta.url).pathname);
  console.log("Generating signature PNGs...");
  await capture(path.join(dir, "email-signature-adrien.html"), path.join(dir, "email-signature-adrien.png"));
  await capture(path.join(dir, "email-signature-alexandre.html"), path.join(dir, "email-signature-alexandre.png"));
  console.log("Done.");
}

main().catch((err) => { console.error(err); process.exit(1); });
