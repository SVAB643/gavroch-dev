import puppeteer from "puppeteer";
import { spawn } from "child_process";
import { setTimeout as sleep } from "timers/promises";
import { PDFDocument } from "pdf-lib";
import sharp from "sharp";
import fs from "fs";

// Business card: 85mm × 55mm
// At 300dpi: 1004 × 650px → we use 1008 × 648 (clean)
const W = 1008;
const H = 648;
const SCALE = 2;
const OUTPUT = "gavroch-card.pdf";

// 85mm × 55mm in PDF points (1mm = 2.8346pt)
const PT_W = 85 * 2.8346;
const PT_H = 55 * 2.8346;

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
    await page.setViewport({ width: W, height: H, deviceScaleFactor: SCALE });

    console.log("Loading /card page...");
    await page.goto("http://localhost:3099/card", {
      waitUntil: "networkidle0",
      timeout: 60000,
    });
    await sleep(2000);

    // Hide Next.js dev indicator
    await page.evaluate(() => {
      const devIndicator = document.querySelector("nextjs-portal");
      if (devIndicator) devIndicator.remove();
      document.querySelectorAll("*").forEach((el) => {
        const s = getComputedStyle(el);
        if (s.position === "fixed") el.style.display = "none";
      });
    });

    // Screenshot recto (top card)
    console.log("  Capturing recto...");
    const recto = await page.screenshot({
      type: "png",
      clip: { x: 0, y: 0, width: W, height: H },
    });

    // Screenshot verso (bottom card)
    console.log("  Capturing verso...");
    const verso = await page.screenshot({
      type: "png",
      clip: { x: 0, y: H, width: W, height: H },
    });

    await browser.close();
    console.log("Browser closed. Building PDF...");

    const pdfDoc = await PDFDocument.create();

    for (const [label, buf] of [["Recto", recto], ["Verso", verso]]) {
      const jpegBuffer = await sharp(buf).jpeg({ quality: 95 }).toBuffer();
      const img = await pdfDoc.embedJpg(jpegBuffer);
      const pdfPage = pdfDoc.addPage([PT_W, PT_H]);
      pdfPage.drawImage(img, { x: 0, y: 0, width: PT_W, height: PT_H });
      console.log(`  ${label} added`);
    }

    const pdfBytes = await pdfDoc.save();
    fs.writeFileSync(OUTPUT, pdfBytes);
    const sizeKB = (pdfBytes.length / 1024).toFixed(0);
    console.log(`\nBusiness card PDF: ${OUTPUT} (${sizeKB} KB, 2 pages — recto/verso)`);
  } finally {
    server.kill("SIGTERM");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
