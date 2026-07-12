const fs = require("node:fs");
const path = require("node:path");
const { pathToFileURL } = require("node:url");
const { chromium } = require("playwright");
const sharp = require("sharp");

const repoRoot = path.resolve(__dirname, "..", "..");
const sourcePath = path.join(__dirname, "carousel-combo-sumut-6d5n.html");
const languages = ["en", "id", "my"];
const slideNames = ["01_cover", "02_highlights", "03_itinerary", "04_cta"];
const chromeCandidates = [
  process.env.CHROME_PATH,
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe"
].filter(Boolean);

const executablePath = chromeCandidates.find((candidate) => fs.existsSync(candidate));

if (!executablePath) {
  throw new Error("Google Chrome was not found. Set CHROME_PATH before rendering.");
}

async function render() {
  const browser = await chromium.launch({ headless: true, executablePath });

  try {
    const page = await browser.newPage({
      viewport: { width: 1080, height: 1080 },
      deviceScaleFactor: 1
    });

    for (const language of languages) {
      const outputDir = path.join(
        repoRoot,
        "assets",
        "ig",
        "combo_sumut_6h5m",
        language
      );
      fs.mkdirSync(outputDir, { recursive: true });

      for (let index = 0; index < slideNames.length; index += 1) {
        const slide = index + 1;
        const sourceUrl = `${pathToFileURL(sourcePath).href}?lang=${language}&slide=${slide}`;
        const pngPath = path.join(outputDir, `${slideNames[index]}.png`);
        const webpPath = path.join(outputDir, `${slideNames[index]}.webp`);

        await page.goto(sourceUrl, { waitUntil: "networkidle" });
        await page.evaluate(() => document.fonts.ready);
        await page.screenshot({ path: pngPath, type: "png" });
        await sharp(pngPath).webp({ quality: 92 }).toFile(webpPath);

        const metadata = await sharp(pngPath).metadata();
        if (metadata.width !== 1080 || metadata.height !== 1080) {
          throw new Error(`${pngPath} rendered at ${metadata.width}x${metadata.height}`);
        }
        process.stdout.write(`Rendered ${language}/${slideNames[index]} (1080x1080)\n`);
      }
    }
  } finally {
    await browser.close();
  }
}

render().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
