import puppeteer from "puppeteer";
import { spawn } from "child_process";
import { setTimeout as sleep } from "timers/promises";
import { PDFDocument } from "pdf-lib";
import sharp from "sharp";
import fs from "fs";

const WIDTH = 1440;
const HEIGHT = 900;
const SCALE = 2; // retina quality
const OUTPUT = "gavroch-deck.pdf";
const SLIDE_COUNT = 10;

async function waitForServer(url, maxRetries = 30) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const res = await fetch(url);
      if (res.ok) return true;
    } catch {}
    await sleep(1000);
  }
  throw new Error("Dev server did not start in time");
}

async function main() {
  console.log("Starting dev server...");
  const server = spawn("npx", ["next", "dev", "-p", "3099"], {
    cwd: process.cwd(),
    stdio: "pipe",
    shell: true,
  });

  server.stderr.on("data", (d) => {
    const msg = d.toString();
    if (msg.includes("Error")) console.error(msg);
  });

  try {
    await waitForServer("http://localhost:3099");
    console.log("Dev server ready.");

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.setViewport({
      width: WIDTH,
      height: HEIGHT,
      deviceScaleFactor: SCALE,
    });

    console.log("Loading /deck page...");
    await page.goto("http://localhost:3099/deck", {
      waitUntil: "networkidle0",
      timeout: 60000,
    });

    // Wait for images to load
    await sleep(3000);

    // Hide Next.js dev indicator
    await page.evaluate(() => {
      const devIndicator = document.querySelector('nextjs-portal');
      if (devIndicator) devIndicator.remove();
      // Also hide any fixed-position dev overlays
      document.querySelectorAll('*').forEach(el => {
        const s = getComputedStyle(el);
        if (s.position === 'fixed' && el.tagName !== 'SECTION') {
          el.style.display = 'none';
        }
      });
    });

    // Screenshot each slide (each is exactly 1440x900)
    const screenshots = [];
    for (let i = 0; i < SLIDE_COUNT; i++) {
      const y = i * HEIGHT;
      console.log(`  Capturing slide ${i + 1}/${SLIDE_COUNT}...`);

      // Scroll to make sure the slide is in view
      await page.evaluate((top) => window.scrollTo(0, top), y);
      await sleep(300);

      const screenshot = await page.screenshot({
        type: "png",
        clip: { x: 0, y, width: WIDTH, height: HEIGHT },
      });
      screenshots.push(screenshot);
    }

    await browser.close();
    console.log("Browser closed. Building PDF...");

    // Build PDF — JPEG compression for smaller file size
    const pdfDoc = await PDFDocument.create();

    for (let i = 0; i < screenshots.length; i++) {
      const jpegBuffer = await sharp(screenshots[i])
        .jpeg({ quality: 82 })
        .toBuffer();
      const img = await pdfDoc.embedJpg(jpegBuffer);
      const pdfPage = pdfDoc.addPage([WIDTH, HEIGHT]);
      pdfPage.drawImage(img, { x: 0, y: 0, width: WIDTH, height: HEIGHT });
    }

    const pdfBytes = await pdfDoc.save();
    fs.writeFileSync(OUTPUT, pdfBytes);
    const sizeMB = (pdfBytes.length / 1024 / 1024).toFixed(1);
    console.log(`\nPDF generated: ${OUTPUT} (${sizeMB} MB, ${SLIDE_COUNT} slides)`);
  } finally {
    server.kill("SIGTERM");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
