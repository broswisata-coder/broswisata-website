const fs = require("node:fs");
const path = require("node:path");
const { pathToFileURL } = require("node:url");
const { chromium } = require("playwright");
const sharp = require("sharp");

const repoRoot = path.resolve(__dirname, "..", "..");
const sourcePath = path.join(__dirname, "carousel-combo-sumut-6d5n.html");
const packageKeys = [
  "medan_heritage_3h2m",
  "bukit_lawang_4h3m",
  "berastagi_3h2m",
  "tangkahan_3h2m"
];
const languages = ["en", "id", "my"];
const slideNames = ["01_cover", "02_highlights", "03_itinerary", "04_cta"];
const legacyPalette = new Set([
  "0b3d2e", "b68a35", "c0392b",
  "1f4068", "c8a24a", "eef1f5", "162136",
  "1b4332", "d4a24c", "eff3e8", "1f2a20",
  "5c3a21", "c8932f", "f5efe3", "2a1e10"
].map((hex) => Number.parseInt(hex, 16)));
const chromeCandidates = [
  process.env.CHROME_PATH,
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe"
].filter(Boolean);

const executablePath = chromeCandidates.find((candidate) => fs.existsSync(candidate));

if (!executablePath) {
  throw new Error("Google Chrome was not found. Set CHROME_PATH before rendering.");
}

async function waitForAssetsAndValidate(page, label) {
  const result = await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all(
      Array.from(document.images).map((image) => {
        if (image.complete && image.naturalWidth > 0) return Promise.resolve();
        return new Promise((resolve, reject) => {
          image.addEventListener("load", resolve, { once: true });
          image.addEventListener("error", () => reject(new Error(`Image failed: ${image.src}`)), { once: true });
        });
      })
    );

    const root = document.querySelector(".slide");
    if (!root) return { error: "Slide root was not rendered" };
    const overflow = Array.from(root.querySelectorAll("h1, h2, p, .cta-button"))
      .filter((element) => {
        const horizontal = element.scrollWidth > element.clientWidth + 2;
        const vertical = !element.matches("h1, h2") && element.scrollHeight > element.clientHeight + 2;
        return horizontal || vertical;
      })
      .map((element) => ({
        selector: `${element.tagName}.${element.className || ""}`,
        text: element.textContent.trim().slice(0, 80),
        client: [element.clientWidth, element.clientHeight],
        scroll: [element.scrollWidth, element.scrollHeight]
      }));
    return {
      width: root.getBoundingClientRect().width,
      height: root.getBoundingClientRect().height,
      overflow
    };
  });

  if (result.error) throw new Error(`${label}: ${result.error}`);
  if (Math.round(result.width) !== 1080 || Math.round(result.height) !== 1080) {
    throw new Error(`${label}: slide root is ${result.width}x${result.height}`);
  }
  if (result.overflow.length) {
    throw new Error(`${label}: text overflow ${JSON.stringify(result.overflow)}`);
  }
}

async function assertNoLegacyPalette(pngPath, label) {
  const { data, info } = await sharp(pngPath)
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const matches = new Map();
  for (let offset = 0; offset < data.length; offset += info.channels) {
    const rgb = (data[offset] << 16) | (data[offset + 1] << 8) | data[offset + 2];
    if (legacyPalette.has(rgb)) {
      matches.set(rgb, (matches.get(rgb) || 0) + 1);
    }
  }
  const offenders = Array.from(matches.entries()).filter(([, count]) => count >= 1000);
  if (offenders.length) {
    const summary = offenders
      .map(([rgb, count]) => `#${rgb.toString(16).padStart(6, "0").toUpperCase()}=${count}`)
      .join(", ");
    throw new Error(`${label}: legacy palette blocks remain (${summary})`);
  }
}

async function render() {
  const browser = await chromium.launch({ headless: true, executablePath });

  try {
    const page = await browser.newPage({
      viewport: { width: 1080, height: 1080 },
      deviceScaleFactor: 1
    });

    for (const packageKey of packageKeys) {
      for (const language of languages) {
        const outputDir = path.join(repoRoot, "assets", "ig", packageKey, language);
        fs.mkdirSync(outputDir, { recursive: true });

        for (let index = 0; index < slideNames.length; index += 1) {
          const slide = index + 1;
          const label = `${packageKey}/${language}/${slideNames[index]}`;
          const sourceUrl = `${pathToFileURL(sourcePath).href}?package=${packageKey}&lang=${language}&slide=${slide}`;
          const pngPath = path.join(outputDir, `${slideNames[index]}.png`);
          const webpPath = path.join(outputDir, `${slideNames[index]}.webp`);

          await page.goto(sourceUrl, { waitUntil: "networkidle" });
          await waitForAssetsAndValidate(page, label);
          await page.screenshot({ path: pngPath, type: "png" });
          await assertNoLegacyPalette(pngPath, label);
          await sharp(pngPath).webp({ quality: 92 }).toFile(webpPath);

          const [pngMetadata, webpMetadata] = await Promise.all([
            sharp(pngPath).metadata(),
            sharp(webpPath).metadata()
          ]);
          for (const metadata of [pngMetadata, webpMetadata]) {
            if (metadata.width !== 1080 || metadata.height !== 1080) {
              throw new Error(`${label} rendered at ${metadata.width}x${metadata.height}`);
            }
          }
          process.stdout.write(`Rendered ${label} (1080x1080 PNG + WebP)\n`);
        }
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
